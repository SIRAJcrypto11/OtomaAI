import { NextResponse } from 'next/server';
import { TelegramIntegration } from '@/lib/integrations/telegram';
import { Agent, MemoryManager, ToolRegistry } from '@/lib/orchestrator';
import { createAIProvider } from '@/lib/ai';
// Initialize Telegram with bot token
// In production, each workspace would have its own bot.
// For the platform MVP, we assume a single central bot or we fetch the token from the DB.
const telegramToken = process.env.TELEGRAM_BOT_TOKEN || "";
const telegram = new TelegramIntegration(telegramToken);

// Instantiate a persistent ToolRegistry and Provider for the webhook scope
// Normally, this comes from a database configuration per user.
const registry = new ToolRegistry();

export async function POST(req: Request) {
    if (!telegramToken) {
        return NextResponse.json({ error: "Telegram Bot Token not configured" }, { status: 500 });
    }

    try {
        const body = await req.json();

        // Telegram Webhook Payload
        if (body.message) {
            const chatId = body.message.chat.id;
            const text = body.message.text;
            const userId = body.message.from.id.toString();

            if (!text) {
                return NextResponse.json({ status: "Ignored non-text message" });
            }

            console.log(`Received message from ${userId}: ${text}`);

            // 1. Send an immediate typing indicator or "Processing..." message
            await telegram.sendMessage(chatId, "⏳ Memproses pesan Anda...");

            // 2. Initialize Memory for this specific user chat
            const memory = new MemoryManager("nexus-default-agent", `telegram-${chatId}`);

            // 3. Initialize the AI Provider (Fallback to Gemini if Groq is not configured)
            const aiKey = process.env.GEMINI_API_KEY || "";
            if (!aiKey) {
                await telegram.sendMessage(chatId, "⚠️ Sistem AI belum dikonfigurasi dengan API Key.");
                return NextResponse.json({ error: "API Key missing" }, { status: 500 });
            }

            const provider = createAIProvider("gemini", aiKey);

            // 4. Instantiate the Agent
            const agent = new Agent({
                id: "nexus-default-agent",
                name: "NEXUS Assistant",
                systemPrompt: "Anda adalah asisten cerdas dari platform NEXUS AI. Anda membantu pengguna menjawab pertanyaan mereka dengan jelas, profesional, dan berbahasa Indonesia.",
                provider: provider
            });

            // Restore recent history into the agent
            const recentHistory = await memory.getRecentHistory(10);
            const formattedHistory = recentHistory.map((msg: any) => ({
                role: msg.role,
                content: msg.content
            }));

            if (formattedHistory.length > 0) {
                agent.loadHistory(formattedHistory);
            }

            // 5. Run the message through the Agent
            const response = await agent.chat(text);

            // 6. Save new messages to memory
            await memory.addMessage({
                id: Date.now().toString(),
                role: "user",
                content: text,
                timestamp: new Date()
            });

            await memory.addMessage({
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: response,
                timestamp: new Date()
            });

            // 7. Send the response back to Telegram
            await telegram.sendMessage(chatId, response);

            return NextResponse.json({ success: true, response });
        }

        return NextResponse.json({ status: "No message payload" });

    } catch (error: any) {
        console.error("Telegram Webhook Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
