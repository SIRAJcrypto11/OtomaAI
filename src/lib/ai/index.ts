import { GeminiProvider } from "./gemini";
import { GroqProvider } from "./groq";
import { AIProvider } from "./provider";

export type ProviderType = "gemini" | "groq";

export function createAIProvider(
    type: ProviderType,
    apiKey: string,
    model?: string
): AIProvider {
    switch (type) {
        case "gemini":
            return new GeminiProvider(apiKey, model);
        case "groq":
            return new GroqProvider(apiKey, model);
        default:
            throw new Error(`Provider ${type} is not currently supported.`);
    }
}

export * from "./provider";
export * from "./gemini";
export * from "./groq";
