import React from "react";
import FlowBuilder from "@/components/workflows/FlowBuilder";
import { ArrowLeft, Save, Play, Beaker } from "lucide-react";
import Link from "next/link";

export const metadata = {
    title: "Edit Workflow | NEXUS AI",
};

export default function WorkflowDetailPage({ params }: { params: { id: string } }) {
    return (
        <div className="flex flex-col h-full bg-slate-50">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 shadow-sm shrink-0 z-10 relative">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/workflows" className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Onboarding Flow</h1>
                            <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10">
                                Draft
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">ID: wf_{params.id || 'new_89a2'} • Last edited 2 mins ago</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
                        <Beaker className="w-4 h-4 mr-2" />
                        Test Run
                    </button>
                    <button className="flex items-center px-4 py-2 border border-slate-300 bg-white text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                        <Save className="w-4 h-4 mr-2" />
                        Save Flow
                    </button>
                    <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm transition-colors">
                        <Play className="w-4 h-4 mr-2" />
                        Deploy
                    </button>
                </div>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 relative w-full h-full bg-slate-50">
                <div className="absolute inset-0 z-0">
                    <FlowBuilder />
                </div>
            </div>
        </div>
    );
}
