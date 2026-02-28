import { AIProvider } from "../ai";
import { EventEmitter } from "events";

export type AgentStatus = "IDLE" | "RUNNING" | "PAUSED" | "STOPPED" | "ERROR";

export interface AgentConfig {
    id: string;
    name: string;
    systemPrompt: string;
    provider: AIProvider;
}

export class Agent extends EventEmitter {
    public readonly id: string;
    public readonly name: string;
    public readonly systemPrompt: string;

    private provider: AIProvider;
    private status: AgentStatus = "IDLE";
    private history: { role: string; content: string }[] = [];

    constructor(config: AgentConfig) {
        super();
        this.id = config.id;
        this.name = config.name;
        this.systemPrompt = config.systemPrompt;
        this.provider = config.provider;

        // Initialize history with system prompt
        this.history.push({ role: "system", content: this.systemPrompt });
    }

    public getStatus(): AgentStatus {
        return this.status;
    }

    private setStatus(newStatus: AgentStatus) {
        this.status = newStatus;
        this.emit("statusChange", { id: this.id, status: this.status });
    }

    public async chat(message: string): Promise<string> {
        if (this.status === "PAUSED" || this.status === "STOPPED" || this.status === "ERROR") {
            throw new Error(`Agent cannot accept messages while in ${this.status} state.`);
        }

        this.setStatus("RUNNING");
        this.history.push({ role: "user", content: message });
        this.emit("messageReceived", { id: this.id, message });

        try {
            // TODO: Implement ReAct loop (Think, Act, Observe) here in future iterations
            // For now, it's a simple passthrough to the provider

            const response = await this.provider.chat(this.history);

            this.history.push({ role: "assistant", content: response });
            this.emit("messageGenerated", { id: this.id, response });

            this.setStatus("IDLE");
            return response;
        } catch (error) {
            this.setStatus("ERROR");
            this.emit("error", { id: this.id, error });
            throw error;
        }
    }

    public pause() {
        if (this.status === "RUNNING" || this.status === "IDLE") {
            this.setStatus("PAUSED");
        }
    }

    public resume() {
        if (this.status === "PAUSED") {
            this.setStatus("IDLE");
        }
    }

    public stop() {
        this.setStatus("STOPPED");
    }

    public getHistory() {
        return [...this.history];
    }

    public clearHistory(keepSystemPrompt: boolean = true) {
        if (keepSystemPrompt) {
            this.history = [{ role: "system", content: this.systemPrompt }];
        } else {
            this.history = [];
        }
        this.emit("historyCleared", { id: this.id });
    }

    public loadHistory(history: { role: string; content: string }[]) {
        // Keep the system prompt at the beginning, replace the rest
        this.history = [{ role: "system", content: this.systemPrompt }, ...history.filter(h => h.role !== "system")];
        this.emit("historyLoaded", { id: this.id });
    }
}
