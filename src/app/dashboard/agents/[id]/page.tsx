import React from "react";
import { ArrowLeft, Play, Pause, Power, MessageSquare, Clock, Zap, Target } from "lucide-react";
import Link from "next/link";

export const metadata = {
    title: "Agent Detail | NEXUS AI",
};

export default function AgentDetailPage({ params }: { params: { id: string } }) {
    // In production, fetch specific agent by params.id

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
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">CS Bot Tokopedia</h1>
                            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                                <Power className="w-3 h-3 mr-1" /> Active
                            </span>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">ID: agt_toko_xs892m • Generated via Gemini 1.5 Pro</p>
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
                                <div className="text-2xl font-bold text-slate-900">12.4K</div>
                                <div className="text-xs text-emerald-600 font-medium mt-1">+12% this week</div>
                            </div>
                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                <div className="text-slate-500 text-sm font-medium flex items-center gap-2 mb-2"><Zap className="w-4 h-4" /> Avg Latency</div>
                                <div className="text-2xl font-bold text-slate-900">1.2s</div>
                                <div className="text-xs text-emerald-600 font-medium mt-1">-0.3s overall</div>
                            </div>
                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                <div className="text-slate-500 text-sm font-medium flex items-center gap-2 mb-2"><Clock className="w-4 h-4" /> Uptime</div>
                                <div className="text-2xl font-bold text-slate-900">99.9%</div>
                                <div className="text-xs text-slate-500 font-medium mt-1">Last incident: 14d ago</div>
                            </div>
                        </div>

                        {/* Recent Activity Logs */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
                            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                                <h2 className="text-lg font-bold text-slate-900">Real-time Activity Logs</h2>
                                <button className="text-sm text-blue-600 font-medium hover:underline">View All</button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-5 space-y-4">
                                {[
                                    { time: '10:42:05', user: 'wa-628112345', msg: 'Kapan barang saya dikirim?', ai: 'Halo kak, barang sedang diproses dan dijemput kurir sore ini. Resi: JP88291.', stat: 'success' },
                                    { time: '10:39:12', user: 'tg-siraj', msg: 'Cek stok warna merah', ai: 'Untuk warna merah saat ini tersisa 5 pcs ya kak di gudang.', stat: 'success' },
                                    { time: '10:30:00', user: 'SYSTEM', msg: 'Trigger Memory Snapshot', ai: '[Upstash] 42 context tokens saved.', stat: 'info' },
                                    { time: '10:25:11', user: 'wa-62899988', msg: 'Bisa COD?', ai: 'Tentu bisa kak, silakan checkout menggunakan opsi pembayaran COD.', stat: 'success' },
                                ].map((log, i) => (
                                    <div key={i} className="flex gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100">
                                        <div className="text-xs font-mono text-slate-400 mt-1 whitespace-nowrap">{log.time}</div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-bold font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded">{log.user}</span>
                                                {log.stat === 'info' && <span className="text-xs text-slate-500 font-medium">System Action</span>}
                                            </div>
                                            <p className="text-sm text-slate-700 italic border-l-2 border-slate-300 pl-3 mb-2">{log.msg}</p>
                                            <p className="text-sm text-slate-900 font-medium break-words leading-relaxed">🤖 {log.ai}</p>
                                        </div>
                                    </div>
                                ))}
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
