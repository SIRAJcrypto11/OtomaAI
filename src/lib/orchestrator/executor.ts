import { ToolRegistry } from "./registry";

export interface ExecutionOptions {
    maxRetries?: number;
    timeout?: number;
}

export class TaskExecutor {
    private registry: ToolRegistry;

    constructor(registry: ToolRegistry) {
        this.registry = registry;
    }

    public async executeTool(toolName: string, args: any, options: ExecutionOptions = {}): Promise<any> {
        const tool = this.registry.getTool(toolName);
        if (!tool) {
            throw new Error(`Tool '${toolName}' not found in registry.`);
        }

        const maxRetries = options.maxRetries ?? 3;
        const timeout = options.timeout ?? 15000;

        let attempt = 0;
        let lastError: Error | null = null;

        while (attempt < maxRetries) {
            try {
                // Execute with timeout
                const result = await Promise.race([
                    tool.execute(args),
                    new Promise((_, reject) =>
                        setTimeout(() => reject(new Error(`Tool execution timed out after ${timeout}ms`)), timeout)
                    )
                ]);
                return result;
            } catch (error: any) {
                lastError = error;
                attempt++;
                console.warn(`Attempt ${attempt} for tool '${toolName}' failed: ${error.message}`);

                if (attempt < maxRetries) {
                    // Exponential backoff
                    const delay = Math.pow(2, attempt) * 1000;
                    await new Promise(res => setTimeout(res, delay));
                }
            }
        }

        throw new Error(`Tool '${toolName}' failed after ${maxRetries} attempts. Last error: ${lastError?.message}`);
    }
}
