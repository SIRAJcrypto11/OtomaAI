import { NextResponse } from 'next/server';
import { Agent, ToolRegistry, TaskExecutor, MemoryManager } from '@/lib/orchestrator';

// Dummy implementation of an AI Provider for testing without needing API keys
class DummyProvider {
    async generate(prompt: string) { return `Generated: ${prompt}`; }
    async chat(messages: { role: string; content: string }[]) {
        return `Chat response to: ${messages[messages.length - 1].content}`;
    }
}

export async function GET() {
    if (process.env.NODE_ENV !== "development") {
        return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    try {
        // 1. Initialize Memory Manager
        const memory = new MemoryManager("test-agent-1", "test-conv-1");

        // 2. Initialize Tool Registry and Executor
        const registry = new ToolRegistry();
        registry.register({
            name: "test_tool",
            description: "A test tool",
            execute: async (args) => `Tool executed with args: ${JSON.stringify(args)}`
        });
        const executor = new TaskExecutor(registry);

        // 3. Initialize Agent with Dummy Provider
        const agent = new Agent({
            id: "agent-001",
            name: "TestNexus",
            systemPrompt: "You are a test agent.",
            provider: new DummyProvider() as any
        });

        // 4. Simulate a state change
        let agentState = agent.getStatus();

        // 5. Test Tool Execution
        const toolResult = await executor.executeTool("test_tool", { param: "value" });

        // 6. Test Agent Chat (using dummy provider)
        const chatResult = await agent.chat("Hello Nexus!");

        // 7. Test memory logging (fire and forget for this test)
        await memory.addMessage({
            id: Date.now().toString(),
            role: "system",
            content: "Test message",
            timestamp: new Date()
        });

        const history = agent.getHistory();

        return NextResponse.json({
            success: true,
            status: "Phase 2 Components verified successfully at runtime.",
            details: {
                initialState: agentState,
                currentState: agent.getStatus(),
                toolExecution: toolResult,
                chatResponse: chatResult,
                agentHistory: history,
                toolsRegistered: registry.getAllTools().length
            }
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
