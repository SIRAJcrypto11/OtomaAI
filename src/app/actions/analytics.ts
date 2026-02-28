"use server";

import { sql } from "@vercel/postgres";
import { auth } from "@/auth";

export async function getAnalyticsData() {
    try {
        const session = await auth();
        if (!session?.user?.workspaceId) {
            throw new Error("Unauthorized");
        }

        const workspaceId = session.user.workspaceId;

        if (!process.env.POSTGRES_URL) {
            // Fallback for no DB connection
            return {
                metrics: {
                    totalMessages: 0,
                    activeAgents: 0,
                    apiRequests: "0",
                    revenue: "Rp 0"
                },
                chartData: new Array(12).fill(5), // Minimum height 5%
                chartRaw: new Array(12).fill(0),
                topAgents: []
            };
        }

        // 1. Top Metrics
        const messagesQuery = await sql`
            SELECT COUNT(m.*) as count 
            FROM messages m 
            JOIN conversations c ON m.conversation_id = c.id
            WHERE c.workspace_id = ${workspaceId}
        `;
        const totalMessages = parseInt(messagesQuery.rows[0].count, 10) || 0;

        const agentsQuery = await sql`
            SELECT COUNT(*) as count FROM agents 
            WHERE workspace_id = ${workspaceId} AND status = 'Active'
        `;
        const activeAgents = parseInt(agentsQuery.rows[0].count, 10) || 0;

        // Mock calculations for API requests and Revenue
        const apiRequests = (totalMessages * 2.5).toLocaleString() + (totalMessages > 1000000 ? 'M' : '');
        const revenue = "Rp " + ((totalMessages * 150) / 1000000).toFixed(1) + "M";

        // 2. Chart Data (Current Year by Month)
        // Group messages by month
        const chartQuery = await sql`
            SELECT EXTRACT(MONTH FROM m.created_at) as month, COUNT(m.*) as count
            FROM messages m
            JOIN conversations c ON m.conversation_id = c.id
            WHERE c.workspace_id = ${workspaceId}
              AND EXTRACT(YEAR FROM m.created_at) = EXTRACT(YEAR FROM CURRENT_DATE)
            GROUP BY EXTRACT(MONTH FROM m.created_at)
        `;

        let chartData = new Array(12).fill(0);
        // Find max to calculate percentages. Default to at least 100 for scale.
        let maxCount = 100;
        chartQuery.rows.forEach(row => {
            const m = parseInt(row.month, 10) - 1; // 0-indexed month
            const c = parseInt(row.count, 10);
            chartData[m] = c;
            if (c > maxCount) maxCount = c;
        });

        // Convert chartData to percentages for the CSS height
        const chartPercentages = chartData.map(val => val === 0 ? 5 : Math.round((val / maxCount) * 100)); // Minimum height 5%

        // 3. Top Agents
        const topAgentsQuery = await sql`
            SELECT a.name, COUNT(m.*) as message_count
            FROM agents a
            LEFT JOIN messages m ON a.id = m.agent_id
            WHERE a.workspace_id = ${workspaceId}
            GROUP BY a.id, a.name
            ORDER BY message_count DESC
            LIMIT 5
        `;

        const topAgents = topAgentsQuery.rows.map(row => ({
            name: row.name,
            msgs: (parseInt(row.message_count, 10)).toLocaleString(),
            load: Math.round(Math.random() * 40 + 40) + '%' // Mock load percentage
        }));

        return {
            metrics: {
                totalMessages,
                activeAgents,
                apiRequests,
                revenue
            },
            chartData: chartPercentages,
            chartRaw: chartData,
            topAgents
        };

    } catch (error) {
        console.error("Error fetching analytics data:", error);
        return {
            metrics: {
                totalMessages: 0,
                activeAgents: 0,
                apiRequests: "0",
                revenue: "Rp 0"
            },
            chartData: new Array(12).fill(5),
            chartRaw: new Array(12).fill(0),
            topAgents: []
        };
    }
}
