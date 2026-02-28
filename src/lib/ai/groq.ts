import Groq from "groq-sdk";
import { BaseAIProvider } from "./provider";

export class GroqProvider extends BaseAIProvider {
    private groq: Groq;
    private model: string;

    constructor(apiKey: string, model: string = "mixtral-8x7b-32768") {
        super(apiKey);
        this.groq = new Groq({ apiKey: this.apiKey });
        this.model = model;
    }

    async generate(prompt: string, options?: any): Promise<string> {
        try {
            const chatCompletion = await this.groq.chat.completions.create({
                messages: [{ role: "user", content: prompt }],
                model: this.model,
                ...options,
            });

            return chatCompletion.choices[0]?.message?.content || "";
        } catch (error) {
            console.error("Groq Generate Error:", error);
            throw error;
        }
    }

    async chat(messages: { role: string; content: string }[], options?: any): Promise<string> {
        try {
            // Mapping standard roles to Groq expectations (user, assistant, system)
            const mappedMessages = messages.map(m => ({
                role: m.role as "user" | "assistant" | "system",
                content: m.content
            }));

            const chatCompletion = await this.groq.chat.completions.create({
                messages: mappedMessages,
                model: this.model,
                ...options,
            });

            return chatCompletion.choices[0]?.message?.content || "";
        } catch (error) {
            console.error("Groq Chat Error:", error);
            throw error;
        }
    }
}
