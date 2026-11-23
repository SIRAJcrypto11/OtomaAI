"use server";

import { sql } from "@vercel/postgres";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { isPostgresConfigured } from "@/lib/env";

export async function getAgents() {
    try {
        const session = await auth();
        if (!session?.user?.workspaceId) {
            return { error: "Not authenticated or missing workspace", data: [] };
        }

        const workspaceId = session.user.workspaceId;

        // Fetch agents associated with the workspace
        // Role based restriction: Operators can only see Active agents, Owners see all.
        let query;

        if (session.user.role === "Operator") {
            query = sql`
                SELECT a.id, a.name, a.status, a.updated_at as last_active, COALESCE(a.role, 'Agent') as type
                FROM agents a
                WHERE a.workspace_id = ${workspaceId} AND a.status = 'Active'
                ORDER BY a.updated_at DESC
            `;
        } else {
            // Super Admin or Workspace Owner see all agents in the workspace
            query = sql`
                SELECT a.id, a.name, a.status, a.updated_at as last_active, COALESCE(a.role, 'Agent') as type
                FROM agents a
                WHERE a.workspace_id = ${workspaceId}
                ORDER BY a.updated_at DESC
            `;
        }

        const { rows } = await query;

        // Fallback robust mapping if columns are missing
        const formattedAgents = rows.map(row => ({
            id: String(row.id),
            name: row.name || "Unnamed Agent",
            type: row.type || "General",
            status: row.status || "Draft",
            messages: "0", // Mock for now until message counting is fully integrated to per agent level
            lastActive: row.last_active ? new Date(row.last_active).toLocaleString() : "Unknown timeframe"
        }));

        return { data: formattedAgents };

    } catch (error) {
        console.error("Failed to fetch agents:", error);
        return { error: "Database error", data: [] };
    }
}

export async function createAgent(formData: FormData) {
    try {
        if (!isPostgresConfigured()) {
            return { error: "Creating agents requires a database (set POSTGRES_URL)." };
        }

        const session = await auth();
        if (!session?.user?.workspaceId) {
            return { error: "Not authenticated or missing workspace" };
        }

        const workspaceId = session.user.workspaceId;

        const name = (formData.get("name") as string || "").trim();
        const systemPrompt = (formData.get("systemPrompt") as string || "").trim();

        if (!name || !systemPrompt) {
            return { error: "Name and System Prompt are required." };
        }

        // id defaults to gen_random_uuid() in the schema; prompt_template stores
        // the system prompt (schema requires it to be persisted).
        await sql`
            INSERT INTO agents (name, prompt_template, type, status, workspace_id, role, updated_at)
            VALUES (${name}, ${systemPrompt}, 'Custom', 'Active', ${workspaceId}, 'Agent', NOW())
        `;
    } catch (error) {
        console.error("Failed to create agent:", error);
        return { error: "Database error while creating agent" };
    }

    // Next.js redirect MUST be called outside try-catch
    redirect("/dashboard/agents");
}

export async function getAgentById(id: string) {
    try {
        const session = await auth();
        if (!session?.user?.workspaceId) {
            return { error: "Not authenticated", data: null };
        }

        const workspaceId = session.user.workspaceId;

        // Fetch the agent
        const { rows: agentRows } = await sql`
            SELECT id, name, type, status, created_at, updated_at
            FROM agents 
            WHERE id = ${id} AND workspace_id = ${workspaceId}
        `;

        if (agentRows.length === 0) {
            return { error: "Agent not found", data: null };
        }

        const agent = agentRows[0];

        // Fetch real metric counts
        const { rows: metricsRows } = await sql`
            SELECT 
                COUNT(*) as total_messages,
                COUNT(DISTINCT session_id) as total_sessions
            FROM messages
            WHERE agent_id = ${id}
        `;

        const metrics = metricsRows[0] || { total_messages: 0, total_sessions: 0 };

        // Fetch recent logs
        const { rows: logsRows } = await sql`
            SELECT id, action, details, created_at
            FROM usage_logs
            WHERE agent_id = ${id}
            ORDER BY created_at DESC
            LIMIT 5
        `;

        return {
            data: {
                id: agent.id,
                name: agent.name,
                type: agent.type || "General",
                status: agent.status,
                createdAt: agent.created_at,
                metrics: {
                    totalMessages: Number(metrics.total_messages),
                    totalConversations: Number(metrics.total_sessions),
                    avgResponseTime: "1.2s", // Hardware dependent, mocked for visual
                    successRate: "98.5%" // Logical mock until qualitative analysis implemented
                },
                recentLogs: logsRows.map(log => ({
                    id: log.id,
                    action: log.action,
                    details: log.details,
                    timestamp: new Date(log.created_at).toLocaleString()
                }))
            }
        };

    } catch (error) {
        console.error("Failed to fetch agent details:", error);
        return { error: "Database error", data: null };
    }
}

