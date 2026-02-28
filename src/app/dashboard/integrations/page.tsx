import React from "react";
import { KeyRound, Webhook, MessageCircle, Mail, Database, ExternalLink, CheckCircle } from "lucide-react";

export const metadata = {
    title: "Integrations | NEXUS AI",
};

export default function IntegrationsPage() {
    return (
        <div className="flex-1 p-8 overflow-y-auto bg-slate-50">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Integrations Hub</h1>
                <p className="text-slate-500 mt-1">Connect your workspace with external channels, databases, and BYOK AI models.</p>
            </div>

            <div className="space-y-10">
                {/* AI Models (BYOK) */}
                <section>
                    <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                        <KeyRound className="w-5 h-5 mr-2 text-slate-400" />
                        AI Models (Bring Your Own Key)
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-start gap-4">
                            <div className="w-12 h-12 flex-shrink-0 bg-blue-50 rounded-xl flex items-center justify-center">
                                {/* Simulated Google Logo space */}
                                <span className="text-blue-600 font-bold text-xl">G</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-slate-900">Google Gemini</h3>
                                        <p className="text-sm text-slate-500 mt-1">Power your agents with Gemini 1.5 Pro.</p>
                                    </div>
                                    <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                                        <CheckCircle className="w-3 h-3 mr-1" /> Connected
                                    </span>
                                </div>
                                <div className="mt-4">
                                    <button className="text-sm text-blue-600 font-medium hover:text-blue-700">Manage API Key</button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-start gap-4">
                            <div className="w-12 h-12 flex-shrink-0 bg-orange-50 rounded-xl flex items-center justify-center">
                                <span className="text-orange-600 font-bold text-xl">Q</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-slate-900">Groq Fast Inference</h3>
                                        <p className="text-sm text-slate-500 mt-1">Llama 3 execution at ~800 tokens/sec.</p>
                                    </div>
                                    <span className="flex items-center text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                                        Not Configured
                                    </span>
                                </div>
                                <div className="mt-4">
                                    <button className="text-sm text-slate-600 font-medium hover:text-slate-900 bg-slate-100 px-3 py-1.5 rounded-lg">Add API Key</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Communication Channels */}
                <section>
                    <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                        <MessageCircle className="w-5 h-5 mr-2 text-slate-400" />
                        Communication Channels
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { name: 'WhatsApp', desc: 'Connect via real device scanning (Baileys).', icon: MessageCircle, stat: 'Connected' },
                            { name: 'Telegram', desc: 'Connect bot via secure webhook.', icon: Webhook, stat: 'Connected' },
                            { name: 'Email (SMTP)', desc: 'Send automated outreach emails.', icon: Mail, stat: 'Connect' },
                        ].map((item, i) => (
                            <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col h-full">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-slate-50 text-slate-600 rounded-lg">
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-semibold text-slate-900">{item.name}</h3>
                                </div>
                                <p className="text-sm text-slate-500 flex-1">{item.desc}</p>
                                <button className={`mt-4 w-full py-2 rounded-lg text-sm font-medium transition-colors ${item.stat === 'Connected' ? 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100' : 'bg-slate-900 text-white hover:bg-slate-800'
                                    }`}>
                                    {item.stat}
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Data & Storage */}
                <section>
                    <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                        <Database className="w-5 h-5 mr-2 text-slate-400" />
                        Data & Storage
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Database className="w-5 h-5" /></div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">Vercel Postgres</h3>
                                    <p className="text-sm text-slate-500">System Database & Vector Memory</p>
                                </div>
                            </div>
                            <span className="text-sm text-emerald-600 font-medium">Active</span>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><ExternalLink className="w-5 h-5" /></div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">Cloudinary</h3>
                                    <p className="text-sm text-slate-500">Media Pipeline Storage</p>
                                </div>
                            </div>
                            <span className="text-sm text-emerald-600 font-medium">Active</span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
