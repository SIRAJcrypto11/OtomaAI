import TelegramBot from 'node-telegram-bot-api';

export class TelegramIntegration {
    private bot: TelegramBot | null = null;
    private token: string;

    constructor(token: string) {
        this.token = token;
        if (this.token) {
            // Webhook mode (polling: false)
            this.bot = new TelegramBot(this.token, { polling: false });
        } else {
            console.warn("Telegram token is missing. Telegram integration is disabled.");
        }
    }

    /**
     * Set the webhook URL for the Telegram Bot.
     * @param url The public URL of the application, e.g., https://nexus-ai.vercel.app/api/webhooks/telegram
     */
    public async setWebhook(url: string): Promise<boolean> {
        if (!this.bot) return false;
        try {
            await this.bot.setWebHook(url);
            console.log(`Telegram Webhook set to: ${url}`);
            return true;
        } catch (error) {
            console.error("Failed to set Telegram Webhook:", error);
            return false;
        }
    }

    /**
     * Send a message to a specific chat ID.
     */
    public async sendMessage(chatId: string | number, text: string, options?: TelegramBot.SendMessageOptions): Promise<TelegramBot.Message | null> {
        if (!this.bot) return null;
        try {
            return await this.bot.sendMessage(chatId, text, options);
        } catch (error) {
            console.error(`Failed to send message to ${chatId}:`, error);
            return null;
        }
    }

    /**
     * Get the underlying bot instance.
     */
    public getBot(): TelegramBot | null {
        return this.bot;
    }
}
