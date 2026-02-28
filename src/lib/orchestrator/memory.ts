import { Redis } from "@upstash/redis";
import { sql } from "@vercel/postgres";

// We fallback to dummy strings if env is not loaded to prevent build crashes, 
// though these should be present in production.
const redisUrl = process.env.UPSTASH_REDIS_REST_URL || 'https://example.upstash.io';
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || 'dummy-token';

const redis = new Redis({
    url: redisUrl,
    token: redisToken,
});

export interface MemoryMessage {
    id: string;
    role: "user" | "assistant" | "system";
    content: string;
    timestamp: Date;
    metadata?: Record<string, any>;
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

    public async addMessage(message: MemoryMessage): Promise<void> {
        // 1. Save to short-term cache (Redis) - Extremely Fast
        if (process.env.UPSTASH_REDIS_REST_URL) {
            try {
                await redis.rpush(this.getCacheKey(), JSON.stringify(message));
                // Expire conversation cache after 24 hours of inactivity
                await redis.expire(this.getCacheKey(), 60 * 60 * 24);
            } catch (error) {
                console.warn("Failed to save to Redis cache:", error);
            }
        }

        // 2. Save to persistent archive (Postgres)
        if (process.env.POSTGRES_URL) {
            try {
                await sql`
                    INSERT INTO messages (id, conversation_id, role, content, metadata, created_at)
                    VALUES (${message.id}, ${this.conversationId}, ${message.role}, ${message.content}, ${JSON.stringify(message.metadata || {})}, ${message.timestamp.toISOString()})
                    ON CONFLICT (id) DO NOTHING;
                `;
            } catch (error) {
                console.error("Failed to archive message to Postgres:", error);
            }
        }
    }

    public async getRecentHistory(limit: number = 20): Promise<MemoryMessage[]> {
        // Try to get from Redis first (Speed)
        if (process.env.UPSTASH_REDIS_REST_URL) {
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
        if (process.env.POSTGRES_URL) {
            try {
                const { rows } = await sql`
                    SELECT * FROM messages 
                    WHERE conversation_id = ${this.conversationId}
                    ORDER BY created_at DESC
                    LIMIT ${limit}
                `;
                return rows.reverse().map(row => ({
                    id: row.id,
                    role: row.role as any,
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
