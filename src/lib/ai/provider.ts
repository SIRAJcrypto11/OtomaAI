export interface AIProvider {
    generate(prompt: string, options?: any): Promise<string>;
    chat(messages: { role: string; content: string }[], options?: any): Promise<string>;
}

export abstract class BaseAIProvider implements AIProvider {
    protected apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    abstract generate(prompt: string, options?: any): Promise<string>;
    abstract chat(messages: { role: string; content: string }[], options?: any): Promise<string>;
}
