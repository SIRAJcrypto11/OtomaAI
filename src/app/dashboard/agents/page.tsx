import React from "react";
import { Plus, Bot, Power, Activity } from "lucide-react";
import Link from "next/link";
import { getAgents } from "@/app/actions/agents";

export const metadata = {
    title: "Agents | NEXUS AI",
};

export default async function AgentsPage() {
    const { data: agents, error } = await getAgents();

    const agentList = agents || [];

    return (
        <div className="flex-1 p-8 overflow-y-auto bg-slate-50">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Agent Management Hub</h1>
                    <p className="text-slate-500 mt-1">Create, monitor, and configure your AI workforce.</p>
                </div>
                <Link href="/dashboard/agents/create" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-blue-700 transition-colors flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Agent
                </Link>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {agentList.map((agent) => (
                    <div key={agent.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                <Bot className="w-5 h-5" />
                            </div>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${agent.status === 'Active' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20' : 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20'
                                }`}>
                                {agent.status === 'Active' ? <Activity className="w-3 h-3 mr-1" /> : <Power className="w-3 h-3 mr-1" />}
                                {agent.status}
                            </span>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 line-clamp-1">{agent.name}</h3>
                        <p className="text-sm text-slate-500 mt-1">{agent.type}</p>

                        <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between text-sm">
                            <div className="text-slate-500">
                                <span className="font-medium text-slate-900">{agent.messages}</span> msgs
                            </div>
                            <div className="text-slate-400 text-xs">
                                Active {agent.lastActive}
                            </div>
                        </div>

                        <div className="mt-4 flex gap-2">
                            <Link href={`/dashboard/workflows/${agent.id}`} className="flex-1 bg-white border border-slate-200 text-slate-700 text-center py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                                Edit Workflow
                            </Link>
                            <Link href={`/dashboard/agents/${agent.id}`} className="flex-1 bg-slate-900 text-white py-2 rounded-lg text-sm font-medium text-center hover:bg-slate-800 transition-colors">
                                View Logs
                            </Link>
                        </div>
                    </div>
                ))}

                {/* Create New Card */}
                <Link href="/dashboard/agents/create" className="bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 p-6 flex flex-col items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50 transition-all min-h-[280px]">
                    <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-4 shadow-sm">
                        <Plus className="w-6 h-6" />
                    </div>
                    <span className="font-medium">Deploy New Agent</span>
                    <span className="text-sm mt-1 text-slate-400 text-center px-4">Create an autonomous agent from scratch or use a template.</span>
                </Link>
            </div>
        </div>
    );
}
