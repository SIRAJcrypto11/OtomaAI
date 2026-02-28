"use server";

import { sql } from "@vercel/postgres";
import { auth } from "@/auth";

export async function getDashboardMetrics() {
    try {
        const session = await auth();
        if (!session?.user) {
            throw new Error("Unauthorized");
        }

        const role = session.user.role;
        const workspaceId = session.user.workspaceId;

        // Graceful fallback if database isn't configured locally
        if (!process.env.POSTGRES_URL) {
            return {
                totalMessages: 0,
                activeAgents: 0,
                revenue: 0,
                avgResponseTime: "N/A",
                activities: [{
                    title: "Database connection string missing",
                    time: "Just now",
                    status: "warning" as const
                }]
            };
        }

        // Base query conditions depending on role
        if (role === "Super Admin") {
            // Global Metrics
            const messagesPromise = sql`SELECT COUNT(*) FROM messages`;
            const agentsPromise = sql`SELECT COUNT(*) FROM agents WHERE status = 'Active'`;
            const costPromise = sql`SELECT COALESCE(SUM(cost_estimate), 0) as total FROM usage_logs`;
            const recentLogsPromise = sql`
                SELECT u.event_type as title, u.created_at as time, 'success' as status 
                FROM usage_logs u 
                ORDER BY created_at DESC LIMIT 5
            `;

            const [messagesReq, agentsReq, costReq, recentLogsReq] = await Promise.all([
                messagesPromise, agentsPromise, costPromise, recentLogsPromise
            ]);

            return {
                totalMessages: parseInt(messagesReq.rows[0].count, 10) || 0,
                activeAgents: parseInt(agentsReq.rows[0].count, 10) || 0,
                revenue: parseFloat(costReq.rows[0].total) || 0,
                avgResponseTime: "1.2s", // Mocked avg response since we don't have a specific column for it yet
                activities: recentLogsReq.rows.map(row => ({
                    title: row.title || 'System operation executed',
                    time: formatRelativeTime(new Date(row.time)),
                    status: row.status
                }))
            };
        } else if (role === "Workspace Owner") {
            // Workspace-specific Metrics
            const messagesPromise = sql`
                SELECT COUNT(m.*) 
                FROM messages m 
                JOIN conversations c ON m.conversation_id = c.id
                WHERE c.workspace_id = ${workspaceId}
            `;
            const agentsPromise = sql`SELECT COUNT(*) FROM agents WHERE workspace_id = ${workspaceId} AND status = 'Active'`;
            const costPromise = sql`SELECT COALESCE(SUM(cost_estimate), 0) as total FROM usage_logs WHERE workspace_id = ${workspaceId}`;
            const recentLogsPromise = sql`
                SELECT event_type as title, created_at as time, 'success' as status 
                FROM usage_logs 
                WHERE workspace_id = ${workspaceId}
                ORDER BY created_at DESC LIMIT 5
            `;

            const [messagesReq, agentsReq, costReq, recentLogsReq] = await Promise.all([
                messagesPromise, agentsPromise, costPromise, recentLogsPromise
            ]);

            return {
                totalMessages: parseInt(messagesReq.rows[0].count, 10) || 0,
                activeAgents: parseInt(agentsReq.rows[0].count, 10) || 0,
                revenue: parseFloat(costReq.rows[0].total) || 0,
                avgResponseTime: "0.8s",
                activities: recentLogsReq.rows.map(row => ({
                    title: row.title || 'Workspace operation executed',
                    time: formatRelativeTime(new Date(row.time)),
                    status: row.status
                }))
            };
        } else {
            // Operator Metrics (Minimal)
            const recentLogsPromise = sql`
                SELECT event_type as title, created_at as time, 'success' as status 
                FROM usage_logs 
                WHERE workspace_id = ${workspaceId}
                ORDER BY created_at DESC LIMIT 10
            `;
            const recentLogsReq = await recentLogsPromise;

            return {
                totalMessages: 0,
                activeAgents: 0,
                revenue: 0,
                avgResponseTime: "N/A",
                activities: recentLogsReq.rows.map(row => ({
                    title: row.title || 'Agent activity logged',
                    time: formatRelativeTime(new Date(row.time)),
                    status: row.status
                }))
            };
        }
    } catch (error) {
        console.error("Error fetching dashboard metrics:", error);
        return {
            totalMessages: 0,
            activeAgents: 0,
            revenue: 0,
            avgResponseTime: "N/A",
            activities: []
        };
    }
}

// Helper formatting function for JS dates
function formatRelativeTime(date: Date) {
    const diffInSeconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
}
