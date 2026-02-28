export interface Tool {
    name: string;
    description: string;
    execute: (args: any) => Promise<any>;
}

export class ToolRegistry {
    private tools: Map<string, Tool> = new Map();

    public register(tool: Tool) {
        if (this.tools.has(tool.name)) {
            console.warn(`Tool ${tool.name} is already registered. Overwriting.`);
        }
        this.tools.set(tool.name, tool);
    }

    public getTool(name: string): Tool | undefined {
        return this.tools.get(name);
    }

    public getAllTools(): Tool[] {
        return Array.from(this.tools.values());
    }

    public removeTool(name: string) {
        this.tools.delete(name);
    }

    public getToolsDescriptions(): string {
        return this.getAllTools()
            .map(tool => `- ${tool.name}: ${tool.description}`)
            .join("\n");
    }
}
