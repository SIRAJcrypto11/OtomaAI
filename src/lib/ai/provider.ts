export type AIRequestOptions = Record<string, unknown>;

export interface AIProvider {
    generate(prompt: string, options?: AIRequestOptions): Promise<string>;
    chat(messages: { role: string; content: string }[], options?: AIRequestOptions): Promise<string>;
}

export abstract class BaseAIProvider implements AIProvider {
    protected apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    abstract generate(prompt: string, options?: AIRequestOptions): Promise<string>;
    abstract chat(messages: { role: string; content: string }[], options?: AIRequestOptions): Promise<string>;
}
