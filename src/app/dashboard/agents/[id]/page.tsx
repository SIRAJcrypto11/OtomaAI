import React from "react";
import { ArrowLeft, Play, Pause, Power, MessageSquare, Clock, Zap, Target, Bot } from "lucide-react";
import Link from "next/link";
import { getAgentById } from "@/app/actions/agents";

export const metadata = {
    title: "Agent Detail | NEXUS AI",
};

export default async function AgentDetailPage({ params }: { params: { id: string } }) {
    const { data: agent, error } = await getAgentById(params.id);

    if (error || !agent) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-slate-50">
                <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 max-w-md w-full">
                    <Bot className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Agent Not Found</h2>
                    <p className="text-sm text-slate-500 mb-6">The agent you are looking for does not exist or you don't have permission to view it.</p>
                    <Link href="/dashboard/agents" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Agents
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-slate-50">
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 bg-white border-b border-slate-200 shadow-sm shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/agents" className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{agent.name}</h1>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${agent.status === 'Active' ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' :
                                    agent.status === 'Draft' ? 'bg-amber-50 text-amber-700 ring-amber-600/20' :
                                        'bg-slate-50 text-slate-700 ring-slate-600/20'
                                }`}>
                                <Power className="w-3 h-3 mr-1" /> {agent.status}
                            </span>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">ID: {agent.id} • Type: {agent.type}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center px-4 py-2 bg-amber-100 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-200 transition-colors">
                        <Pause className="w-4 h-4 mr-2" />
                        Pause Agent
                    </button>
                    <Link href={`/dashboard/workflows`} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm transition-colors">
                        <Target className="w-4 h-4 mr-2" />
                        Edit Workflow
                    </Link>
                </div>
            </div>

            {/* Dashboard Content */}
            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Metrics & Config */}
                    <div className="space-y-8 col-span-1 lg:col-span-2">
                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                <div className="text-slate-500 text-sm font-medium flex items-center gap-2 mb-2"><MessageSquare className="w-4 h-4" /> Messages</div>
                                <div className="text-2xl font-bold text-slate-900">{agent.metrics.totalMessages.toLocaleString()}</div>
                                <div className="text-xs text-emerald-600 font-medium mt-1">Total volume</div>
                            </div>
                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                <div className="text-slate-500 text-sm font-medium flex items-center gap-2 mb-2"><Zap className="w-4 h-4" /> Avg Latency</div>
                                <div className="text-2xl font-bold text-slate-900">{agent.metrics.avgResponseTime}</div>
                                <div className="text-xs text-emerald-600 font-medium mt-1">Estimated</div>
                            </div>
                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                <div className="text-slate-500 text-sm font-medium flex items-center gap-2 mb-2"><Clock className="w-4 h-4" /> Success Rate</div>
                                <div className="text-2xl font-bold text-slate-900">{agent.metrics.successRate}</div>
                                <div className="text-xs text-slate-500 font-medium mt-1">Goal vs Completion</div>
                            </div>
                        </div>

                        {/* Recent Activity Logs */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
                            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                                <h2 className="text-lg font-bold text-slate-900">Real-time Activity Logs</h2>
                                <button className="text-sm text-blue-600 font-medium hover:underline">View All</button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-5 space-y-4">
                                {agent.recentLogs.map((log) => (
                                    <div key={log.id} className="flex gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100">
                                        <div className="text-xs font-mono text-slate-400 mt-1 whitespace-nowrap">{log.timestamp}</div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-bold font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded">{log.action}</span>
                                            </div>
                                            <p className="text-sm text-slate-900 font-medium break-words leading-relaxed">{log.details}</p>
                                        </div>
                                    </div>
                                ))}
                                {agent.recentLogs.length === 0 && (
                                    <div className="text-center text-slate-500 py-8 text-sm flex flex-col items-center">
                                        <MessageSquare className="w-8 h-8 text-slate-300 mb-2" />
                                        No recent activity logged for this agent.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Configuration Summary */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                            <h3 className="font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Configuration Details</h3>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">Engine</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                        <p className="text-sm font-semibold text-slate-800">Google Gemini 1.5 Pro</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">Active Channels</p>
                                    <div className="flex gap-2 mt-2">
                                        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10">WhatsApp</span>
                                        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10">Telegram</span>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">System Prompt Sneak Peek</p>
                                    <div className="bg-slate-900 text-slate-300 font-mono text-xs p-3 rounded-lg leading-relaxed h-32 overflow-hidden relative">
                                        Anda adalah asisten cerdas dari platform NEXUS AI untuk Tokopedia. Tugas Anda adalah menjawab pertanyaan pelanggan dengan sopan, memeriksa resi, dan memandu checkout.
                                        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-slate-900 to-transparent"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-600 rounded-xl shadow-md p-6 text-white relative overflow-hidden">
                            <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                            <div className="relative z-10">
                                <h3 className="font-bold text-lg mb-2">Deploy Web Widget</h3>
                                <p className="text-blue-100 text-sm leading-relaxed mb-4">Embed this agent directly into your website with a single line of scripts.</p>
                                <button className="w-full bg-white text-blue-600 font-semibold py-2 rounded-lg text-sm hover:bg-blue-50 transition-colors">
                                    Get Embed Code
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
