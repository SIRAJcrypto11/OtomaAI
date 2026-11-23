import makeWASocket, { DisconnectReason, useMultiFileAuthState as initMultiFileAuthState } from '@whiskeysockets/baileys';
import type { WASocket } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import path from 'path';
import pino from 'pino';
import { Agent, MemoryManager } from '@/lib/orchestrator';
import { createAIProvider } from '@/lib/ai';

type BaileysLogger = NonNullable<Parameters<typeof makeWASocket>[0]>['logger'];

export class WhatsAppIntegration {
    private sock: WASocket | null = null;
    private id: string;
    private sessionDir: string;

    constructor(id: string = 'default') {
        this.id = id;
        this.sessionDir = path.join(process.cwd(), 'wa_sessions', `session-${this.id}`);
    }

    public async connect() {
        // "useMultiFileAuthState" is a plain Baileys helper (not a React hook); it is
        // imported under a non-"use" alias so linting treats it as a regular function.
        const { state, saveCreds } = await initMultiFileAuthState(this.sessionDir);

        const sock = makeWASocket({
            auth: state,
            printQRInTerminal: true, // Will print QR in server console for user to scan
            logger: pino({ level: 'silent' }) as unknown as BaileysLogger, // Suppress verbose Baileys logs
            browser: ['NEXUS AI Orchestrator', 'Chrome', '1.0.0']
        });
        this.sock = sock;

        sock.ev.on('connection.update', (update) => {
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

        sock.ev.on('creds.update', saveCreds);

        // Listen for incoming messages
        sock.ev.on('messages.upsert', async (m) => {
            if (m.type === 'notify') {
                for (const msg of m.messages) {
                    if (msg.key && !msg.key.fromMe && msg.message) {
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
                                const formattedHistory = recentHistory.map((msg) => ({
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
        const sock = this.sock;
        if (!sock) {
            console.error("WhatsApp socket not initialized");
            return false;
        }

        try {
            await sock.sendMessage(to, { text });
            return true;
        } catch (error) {
            console.error("Failed to send WhatsApp message:", error);
            return false;
        }
    }

    public disconnect() {
        if (this.sock) {
            const sock = this.sock;
            sock.logout();
            this.sock = null;
        }
    }
}
