import { Redis } from "@upstash/redis";
import { sql } from "@vercel/postgres";
import { isPostgresConfigured } from "@/lib/env";
import { deriveUuid, isUuid } from "@/lib/uuid";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = redisUrl && redisToken ? new Redis({
    url: redisUrl,
    token: redisToken,
}) : null;

export interface MemoryMessage {
    id: string;
    role: "user" | "assistant" | "system";
    content: string;
    timestamp: Date;
    metadata?: Record<string, unknown>;
}

export class MemoryManager {
    private AgentId: string;
    private conversationId: string;

    constructor(AgentId: string, conversationId: string) {
        this.AgentId = AgentId;
        this.conversationId = conversationId;
    }

    private getCacheKey(): string {
        return `agent:${this.AgentId}:conv:${this.conversationId}`;
    }

    // External conversation keys (e.g. "telegram-123456") are not UUIDs, but the
    // Postgres schema keys conversations/messages by UUID. Derive a stable UUID.
    private getConversationUuid(): string {
        return isUuid(this.conversationId)
            ? this.conversationId
            : deriveUuid(`${this.AgentId}:${this.conversationId}`);
    }

    public async addMessage(message: MemoryMessage): Promise<void> {
        // 1. Save to short-term cache (Redis) - Extremely Fast
        if (redis) {
            try {
                await redis.rpush(this.getCacheKey(), JSON.stringify(message));
                // Expire conversation cache after 24 hours of inactivity
                await redis.expire(this.getCacheKey(), 60 * 60 * 24);
            } catch (error) {
                console.warn("Failed to save to Redis cache:", error);
            }
        }

        // 2. Save to persistent archive (Postgres)
        if (isPostgresConfigured()) {
            try {
                const conversationUuid = this.getConversationUuid();
                await sql`
                    INSERT INTO conversations (id, agent_id, metadata)
                    VALUES (${conversationUuid}, NULL, ${JSON.stringify({ source_key: this.conversationId, agent_id: this.AgentId })})
                    ON CONFLICT (id) DO NOTHING;
                `;
                await sql`
                    INSERT INTO messages (conversation_id, session_id, role, content, metadata, created_at)
                    VALUES (${conversationUuid}, ${this.conversationId}, ${message.role}, ${message.content}, ${JSON.stringify(message.metadata || {})}, ${message.timestamp.toISOString()})
                `;
            } catch (error) {
                console.error("Failed to archive message to Postgres:", error);
            }
        }
    }

    public async getRecentHistory(limit: number = 20): Promise<MemoryMessage[]> {
        // Try to get from Redis first (Speed)
        if (redis) {
            try {
                const cached = await redis.lrange(this.getCacheKey(), -limit, -1);
                if (cached && cached.length > 0) {
                    return cached.map(item => typeof item === 'string' ? JSON.parse(item) : item);
                }
            } catch (error) {
                console.warn("Redis fetch failed, falling back to Postgres:", error);
            }
        }

        // Fallback to Postgres
        if (isPostgresConfigured()) {
            try {
                const { rows } = await sql`
                    SELECT * FROM messages 
                    WHERE conversation_id = ${this.getConversationUuid()}
                    ORDER BY created_at DESC
                    LIMIT ${limit}
                `;
                return rows.reverse().map(row => ({
                    id: row.id,
                    role: row.role as MemoryMessage["role"],
                    content: row.content,
                    timestamp: row.created_at,
                    metadata: row.metadata
                }));
            } catch (error) {
                console.error("Postgres fetch failed:", error);
                return [];
            }
        }

        return [];
    }
}
