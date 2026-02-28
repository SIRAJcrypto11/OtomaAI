import React from "react";
import {
    BarChart3,
    TrendingUp,
    Bot,
    MessageSquare,
    Zap,
    CreditCard,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react";

export const metadata = {
    title: "Analytics | NEXUS AI",
};

interface StatCardProps {
    title: string;
    value: string;
    trend: string;
    isPositive: boolean;
    icon: React.FC<any>;
}

function StatCard({ title, value, trend, isPositive, icon: Icon }: StatCardProps) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">{title}</span>
                <div className="p-2 bg-slate-50 rounded-md">
                    <Icon className="w-5 h-5 text-slate-600" />
                </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tight text-slate-900">{value}</span>
            </div>
            <div className={`mt-2 flex items-center text-sm font-medium ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                {isPositive ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                {trend}
                <span className="text-slate-500 ml-2 font-normal">from last month</span>
            </div>
        </div>
    );
}

export default function AnalyticsPage() {
    return (
        <div className="flex-1 p-8 overflow-y-auto bg-slate-50">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Analytics Overview</h1>
                    <p className="text-slate-500 mt-1">Track your AI agents performance and resource usage.</p>
                </div>
                <div className="flex items-center gap-3">
                    <select className="bg-white border border-slate-200 text-sm rounded-lg px-4 py-2 text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                        <option>This Year</option>
                    </select>
                    <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-slate-800 transition-colors">
                        Export Report
                    </button>
                </div>
            </div>

            {/* Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Messages" value="124,592" trend="+14.5%" isPositive={true} icon={MessageSquare} />
                <StatCard title="Active Agents" value="12" trend="+2" isPositive={true} icon={Bot} />
                <StatCard title="API Requests" value="1.2M" trend="-5.2%" isPositive={false} icon={Zap} />
                <StatCard title="Est. Revenue" value="Rp 14.5M" trend="+22.4%" isPositive={true} icon={CreditCard} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Activity Graph Placeholder (CSS-based) */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-slate-800">Message Volume</h2>
                        <BarChart3 className="w-5 h-5 text-slate-400" />
                    </div>
                    <div className="flex-1 min-h-[300px] flex items-end gap-2 pt-10">
                        {/* Mock bars */}
                        {[40, 70, 45, 90, 65, 80, 55, 100, 75, 85, 60, 95].map((height, i) => (
                            <div key={i} className="flex-1 flex flex-col justify-end group">
                                <div
                                    className="w-full bg-blue-100 rounded-t-md hover:bg-blue-600 transition-colors relative"
                                    style={{ height: `${height}%` }}
                                >
                                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded shadow-lg pointer-events-none transition-opacity whitespace-nowrap">
                                        {height * 1000} msgs
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 mt-4 font-medium px-1">
                        <span>Jan</span>
                        <span>Feb</span>
                        <span>Mar</span>
                        <span>Apr</span>
                        <span>May</span>
                        <span>Jun</span>
                        <span>Jul</span>
                        <span>Aug</span>
                        <span>Sep</span>
                        <span>Oct</span>
                        <span>Nov</span>
                        <span>Dec</span>
                    </div>
                </div>

                {/* Top Agents List */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-slate-800">Top Performing Agents</h2>
                        <TrendingUp className="w-5 h-5 text-slate-400" />
                    </div>
                    <div className="space-y-6">
                        {[
                            { name: 'CS Bot Tokopedia', msgs: '45.2k', load: '85%' },
                            { name: 'Lead Gen WhatsApp', msgs: '32.1k', load: '62%' },
                            { name: 'Content Creator Assistant', msgs: '18.4k', load: '45%' },
                            { name: 'Invoice Automation', msgs: '12.8k', load: '20%' },
                            { name: 'Internal HR Bot', msgs: '8.4k', load: '12%' },
                        ].map((agent, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs uppercase">
                                        {agent.name.substring(0, 2)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900 line-clamp-1">{agent.name}</p>
                                        <p className="text-xs text-slate-500">{agent.msgs} messages</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                                        {agent.load} load
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
