import { GoogleGenerativeAI } from "@google/generative-ai";
import { BaseAIProvider } from "./provider";

export class GeminiProvider extends BaseAIProvider {
    private genAI: GoogleGenerativeAI;
    private model: string;

    constructor(apiKey: string, model: string = "gemini-1.5-flash") {
        super(apiKey);
        this.genAI = new GoogleGenerativeAI(this.apiKey);
        this.model = model;
    }

    async generate(prompt: string, options?: any): Promise<string> {
        try {
            const aiModel = this.genAI.getGenerativeModel({ model: this.model });
            const result = await aiModel.generateContent(prompt);
            return result.response.text();
        } catch (error) {
            console.error("Gemini Generate Error:", error);
            throw error;
        }
    }

    async chat(messages: { role: string; content: string }[], options?: any): Promise<string> {
        try {
            if (messages.length === 0) return "";

            const aiModel = this.genAI.getGenerativeModel({ model: this.model });

            // Format history for Gemini (requires alternating user/model roles)
            const history = messages.slice(0, -1).map(m => ({
                role: m.role === "assistant" ? "model" : "user",
                parts: [{ text: m.content }]
            }));

            const latestMessage = messages[messages.length - 1].content;

            const chatSession = aiModel.startChat({ history });
            const result = await chatSession.sendMessage(latestMessage);

            return result.response.text();
        } catch (error) {
            console.error("Gemini Chat Error:", error);
            throw error;
        }
    }
}
