import makeWASocket, { DisconnectReason, useMultiFileAuthState } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import path from 'path';
import pino from 'pino';
import { Agent, MemoryManager } from '@/lib/orchestrator';
import { createAIProvider } from '@/lib/ai';

export class WhatsAppIntegration {
    private sock: any = null;
    private id: string;
    private sessionDir: string;

    constructor(id: string = 'default') {
        this.id = id;
        this.sessionDir = path.join(process.cwd(), 'wa_sessions', `session-${this.id}`);
    }

    public async connect() {
        const { state, saveCreds } = await useMultiFileAuthState(this.sessionDir);

        this.sock = makeWASocket({
            auth: state,
            printQRInTerminal: true, // Will print QR in server console for user to scan
            logger: pino({ level: 'silent' }) as any, // Suppress verbose Baileys logs
            browser: ['NEXUS AI Orchestrator', 'Chrome', '1.0.0']
        });

        this.sock.ev.on('connection.update', (update: any) => {
            const { connection, lastDisconnect } = update;
            if (connection === 'close') {
                const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
                console.log('WhatsApp connection closed due to ', lastDisconnect?.error, ', reconnecting ', shouldReconnect);
                if (shouldReconnect) {
                    this.connect();
                }
            } else if (connection === 'open') {
                console.log(`WhatsApp integration [${this.id}] connected successfully!`);
            }
        });

        this.sock.ev.on('creds.update', saveCreds);

        // Listen for incoming messages
        this.sock.ev.on('messages.upsert', async (m: any) => {
            if (m.type === 'notify') {
                for (const msg of m.messages) {
                    if (!msg.key.fromMe && msg.message) {
                        const sender = msg.key.remoteJid;
                        const text = msg.message.conversation || msg.message.extendedTextMessage?.text;

                        if (text && sender) {
                            console.log(`[WhatsApp] Received from ${sender}: ${text}`);

                            try {
                                // 1. Memory Setup
                                const memory = new MemoryManager("nexus-default-agent", `wa-${sender}`);

                                // 2. Provider Setup
                                const aiKey = process.env.GEMINI_API_KEY || "";
                                if (!aiKey) {
                                    await this.sendMessage(sender, "⚠️ Sistem AI belum dikonfigurasi dengan API Key.");
                                    continue;
                                }

                                const provider = createAIProvider("gemini", aiKey);

                                // 3. Agent Setup
                                const agent = new Agent({
                                    id: "nexus-default-agent",
                                    name: "NEXUS Assistant",
                                    systemPrompt: "Anda adalah asisten cerdas dari platform NEXUS AI. Anda membantu pengguna menjawab pertanyaan mereka dengan jelas, profesional, dan berbahasa Indonesia.",
                                    provider: provider
                                });

                                // Restore Context
                                const recentHistory = await memory.getRecentHistory(10);
                                const formattedHistory = recentHistory.map((msg: any) => ({
                                    role: msg.role,
                                    content: msg.content
                                }));
                                if (formattedHistory.length > 0) {
                                    agent.loadHistory(formattedHistory);
                                }

                                // 4. Process Message
                                const response = await agent.chat(text);

                                // 5. Save Context
                                await memory.addMessage({ id: Date.now().toString(), role: "user", content: text, timestamp: new Date() });
                                await memory.addMessage({ id: (Date.now() + 1).toString(), role: "assistant", content: response, timestamp: new Date() });

                                // 6. Reply
                                await this.sendMessage(sender, response);

                            } catch (e) {
                                console.error("Error processing WhatsApp message via Orchestrator:", e);
                                await this.sendMessage(sender, "Mohon maaf, terjadi kesalahan pada agen AI saat memproses pesan Anda.");
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * Send a standard text message
     */
    public async sendMessage(to: string, text: string) {
        if (!this.sock) {
            console.error("WhatsApp socket not initialized");
            return false;
        }

        try {
            await this.sock.sendMessage(to, { text });
            return true;
        } catch (error) {
            console.error("Failed to send WhatsApp message:", error);
            return false;
        }
    }

    public disconnect() {
        if (this.sock) {
            this.sock.logout();
            this.sock = null;
        }
    }
}
