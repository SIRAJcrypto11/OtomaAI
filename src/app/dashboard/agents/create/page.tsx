import React from "react";
import { ArrowLeft, Save, Play, Bot, Zap, MessageSquare, Database } from "lucide-react";
import Link from "next/link";
import { createAgent } from "@/app/actions/agents";

export const metadata = {
    title: "Create Agent | NEXUS AI",
};

export default function CreateAgentPage() {
    return (
        <div className="flex flex-col h-full bg-slate-50">
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 shadow-sm shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/agents" className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Deploy New Agent</h1>
                        <p className="text-xs text-slate-500">Draft Mode</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button type="button" className="flex items-center px-4 py-2 border border-slate-300 bg-white text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                        <Save className="w-4 h-4 mr-2" />
                        Save Draft
                    </button>
                    <button type="submit" form="create-agent-form" className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm transition-colors">
                        <Play className="w-4 h-4 mr-2" />
                        Deploy to Production
                    </button>
                </div>
            </div>

            {/* Content Form */}
            <div className="flex-1 overflow-y-auto p-8">
                <form id="create-agent-form" action={async (formData) => {
                    "use server";
                    await createAgent(formData);
                }} className="max-w-4xl mx-auto space-y-8">

                    {/* Basic Info */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                            <Bot className="w-5 h-5 text-blue-600" />
                            <h2 className="text-lg font-semibold text-slate-800">1. Identity & Role</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Agent Name</label>
                                <input name="name" required type="text" placeholder="e.g. Tokopedia Customer Success Bot" className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm" />
                            </div>
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">System Prompt (The Brain)</label>
                                <p className="text-xs text-slate-500 mb-2">Define the instructions, personality, and operational boundaries.</p>
                                <textarea name="systemPrompt" required rows={6} placeholder="You are an expert customer service representative for a fashion brand..." className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm font-mono text-slate-700"></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Capabilities & Brain */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* LLM Engine */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                                <Zap className="w-5 h-5 text-amber-500" />
                                <h2 className="text-lg font-semibold text-slate-800">2. Engine (LLM)</h2>
                            </div>
                            <div className="space-y-4">
                                <label className="flex items-center justify-between p-4 border border-blue-200 rounded-lg bg-blue-50 cursor-pointer">
                                    <div>
                                        <p className="font-semibold text-slate-900 text-sm">Google Gemini 1.5 Pro</p>
                                        <p className="text-xs text-slate-500">Best for complex reasoning and function calling.</p>
                                    </div>
                                    <input type="radio" name="llmEngine" defaultChecked className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                                </label>
                                <label className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                                    <div>
                                        <p className="font-semibold text-slate-900 text-sm">Groq Mixtral 8x7B</p>
                                        <p className="text-xs text-slate-500">Ultra-fast inference for rapid chat responses.</p>
                                    </div>
                                    <input type="radio" name="llmEngine" className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                                </label>
                            </div>
                        </div>

                        {/* Channels */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                                <MessageSquare className="w-5 h-5 text-emerald-500" />
                                <h2 className="text-lg font-semibold text-slate-800">3. Connect Channels</h2>
                            </div>
                            <div className="space-y-4">
                                <label className="flex items-center p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                                    <input type="checkbox" name="channelWhatsApp" value="true" className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                                    <span className="ml-3 text-sm font-medium text-slate-900">WhatsApp (Baileys)</span>
                                </label>
                                <label className="flex items-center p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                                    <input type="checkbox" name="channelTelegram" value="true" className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                                    <span className="ml-3 text-sm font-medium text-slate-900">Telegram Bot Webhook</span>
                                </label>
                                <label className="flex items-center p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                                    <input type="checkbox" name="channelWebChat" value="true" className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                                    <span className="ml-3 text-sm font-medium text-slate-900">NEXUS Web Chat Widget</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Memory Systems */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                            <div className="flex items-center gap-2">
                                <Database className="w-5 h-5 text-purple-600" />
                                <h2 className="text-lg font-semibold text-slate-800">4. Memory & Knowledge Base</h2>
                            </div>
                            <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">Premium Feature</span>
                        </div>
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="flex-1 space-y-4">
                                <div className="p-4 border border-slate-200 rounded-lg">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-sm font-bold text-slate-900">Short-term Memory (Upstash Redis)</h3>
                                        <div className="w-10 h-5 bg-blue-600 rounded-full relative cursor-pointer">
                                            <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm"></div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-500">Enable session tracking to remember users inside a continuous conversation loop (Default Context Window: 20 messages).</p>
                                </div>
                                <div className="p-4 border border-slate-200 rounded-lg">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-sm font-bold text-slate-900">Vector Knowledge (RAG)</h3>
                                        <button className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-3 py-1 rounded">Upload Source</button>
                                    </div>
                                    <p className="text-xs text-slate-500">Inject custom PDFs or company documents (SOPs, Catalogs) that the agent can read via semantic search.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
