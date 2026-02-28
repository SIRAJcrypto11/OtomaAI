import React from "react";
import FlowBuilder from "@/components/workflows/FlowBuilder";
import { Plus, Play, Save } from "lucide-react";

export const metadata = {
    title: "Visual Workflow Builder | NEXUS AI",
};

export default function WorkflowsPage() {
    return (
        <div className="flex flex-col h-full bg-slate-50">
            {/* Header Area */}
            <div className="flex h-16 items-center border-b border-slate-200 bg-white px-6 shadow-sm shrink-0">
                <div className="flex item-center">
                    <h1 className="text-xl font-semibold text-slate-800 tracking-tight">Workflow Builder</h1>
                    <span className="ml-3 inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        Beta
                    </span>
                </div>

                <div className="ml-auto flex items-center space-x-3">
                    <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 h-9 px-4">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Node
                    </button>
                    <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 h-9 px-4">
                        <Save className="mr-2 h-4 w-4" />
                        Save Draft
                    </button>
                    <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none bg-blue-600 text-white hover:bg-blue-700 h-9 px-4 shadow-sm">
                        <Play className="mr-2 h-4 w-4" />
                        Deploy
                    </button>
                </div>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 p-6 relative overflow-hidden">
                <FlowBuilder />
            </div>
        </div>
    );
}
