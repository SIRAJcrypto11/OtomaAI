import { getDashboardMetrics } from "@/app/actions/dashboard";
import {
    MessageSquare,
    Bot,
    Zap,
    TrendingUp,
    Plus,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";

export const metadata = {
    title: "Dashboard Overview | NEXUS AI"
};

export default async function DashboardOverview() {
    // Server-side fetching
    const session = await auth();
    const role = session?.user?.role || "Operator";
    const metrics = await getDashboardMetrics();

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard Overview</h1>
                        {role === "Super Admin" && (
                            <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                                Global View
                            </span>
                        )}
                    </div>
                    <p className="text-muted-foreground">
                        Selamat datang kembali, <span className="font-semibold text-slate-700">{session?.user?.name}</span>. Berikut ringkasan aktivitas {role === "Super Admin" ? "platform" : "agent"} Anda.
                    </p>
                </div>

                {role !== "Operator" && (
                    <div className="flex gap-3">
                        <Button variant="outline">Download Report</Button>
                        <Button className="bg-primary hover:bg-primary/90">
                            <Plus className="h-4 w-4 mr-2" />
                            Create New Agent
                        </Button>
                    </div>
                )}
            </div>

            {/* Stats Cards (Role Specific) */}
            <div className={`grid grid-cols-1 md:grid-cols-2 ${role === "Operator" ? 'lg:grid-cols-2' : 'lg:grid-cols-4'} gap-6`}>
                <StatsCard
                    title={role === "Super Admin" ? "Global Messages Computed" : "Total Workspace Messages"}
                    value={metrics.totalMessages.toLocaleString()}
                    change="+12.5%"
                    trend="up"
                    icon={<MessageSquare className="h-5 w-5 text-primary" />}
                />
                <StatsCard
                    title={role === "Super Admin" ? "Global Active Agents" : "Workspace Active Agents"}
                    value={metrics.activeAgents.toString()}
                    change="0.0%"
                    trend="neutral"
                    icon={<Bot className="h-5 w-5 text-success" />}
                />
                {role !== "Operator" && (
                    <>
                        <StatsCard
                            title="Avg. Response Time"
                            value={metrics.avgResponseTime}
                            change="-0.4s"
                            trend="up"
                            icon={<Zap className="h-5 w-5 text-warning" />}
                        />
                        <StatsCard
                            title={role === "Super Admin" ? "Global Platform Revenue (Est)" : "Billing Cost Estimate"}
                            value={`Rp ${(metrics.revenue).toLocaleString()}`}
                            change="+8.2%"
                            trend="up"
                            icon={<TrendingUp className="h-5 w-5 text-primary" />}
                        />
                    </>
                )}
            </div>

            {/* Main Grid: Charts & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Visual Area for Admins/Owners */}
                {role !== "Operator" && (
                    <div className="lg:col-span-2 p-6 rounded-2xl border bg-surface flex flex-col justify-center items-center text-center">
                        <ShieldCheck className="w-12 h-12 text-slate-300 mb-4" />
                        <h3 className="font-bold text-foreground mb-2">Live Activity Monitor is active</h3>
                        <p className="text-sm text-slate-500 max-w-sm">
                            Vercel Postgres is securely storing your conversation histories and metrics. Activity graphs will construct as more agents are deployed.
                        </p>
                    </div>
                )}

                {/* Recent Activity Logs */}
                <div className={`${role === "Operator" ? 'lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6' : 'p-6 rounded-2xl border bg-surface'}`}>
                    {role === "Operator" && (
                        <div className="col-span-full mb-2">
                            <h3 className="font-bold text-xl text-foreground">Recent Activities</h3>
                            <p className="text-sm text-slate-500">Log sink for agent operations.</p>
                        </div>
                    )}
                    {role !== "Operator" && (
                        <h3 className="font-bold text-foreground mb-6">Recent Activities</h3>
                    )}

                    <div className="space-y-6">
                        {metrics.activities.length > 0 ? (
                            metrics.activities.map((log: any, idx: number) => (
                                <ActivityItem
                                    key={idx}
                                    title={log.title}
                                    time={log.time}
                                    status={log.status}
                                />
                            ))
                        ) : (
                            <div className="text-sm text-slate-500 py-4 text-center border border-dashed rounded-lg border-slate-200">
                                No recent activity found in the database.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatsCard({ title, value, change, trend, icon }: { title: string, value: string, change: string, trend: 'up' | 'down' | 'neutral', icon: React.ReactNode }) {
    return (
        <div className="p-6 rounded-2xl border bg-surface hover:shadow-sm transition-all group">
            <div className="flex justify-between items-start mb-4">
                <div className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    {icon}
                </div>
                <div className={cn(
                    "flex items-center text-xs font-bold px-2 py-1 rounded-full",
                    trend === 'up' ? "text-success bg-success/10" :
                        trend === 'down' ? "text-danger bg-danger/10" :
                            "text-muted-foreground bg-muted"
                )}>
                    {trend === 'up' && <ArrowUpRight className="h-3 w-3 mr-1" />}
                    {trend === 'down' && <ArrowDownRight className="h-3 w-3 mr-1" />}
                    {change}
                </div>
            </div>
            <div>
                <div className="text-sm font-medium text-muted-foreground">{title}</div>
                <div className="text-2xl font-bold text-foreground mt-1">{value}</div>
            </div>
        </div>
    );
}

function ActivityItem({ title, time, status }: { title: string, time: string, status: 'success' | 'error' | 'pending' | 'warning' }) {
    return (
        <div className="flex gap-4">
            <div className="mt-1">
                <div className={cn(
                    "h-2 w-2 rounded-full",
                    status === 'success' ? "bg-success" :
                        status === 'error' ? "bg-danger" :
                            "bg-warning"
                )}></div>
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{title}</p>
                <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-[11px] text-muted-foreground">{time}</span>
                </div>
            </div>
        </div>
    );
}

function cn(...inputs: (string | boolean | undefined | null | { [key: string]: boolean })[]) {
    return inputs.filter(Boolean).map(input => {
        if (typeof input === 'string') return input;
        if (typeof input === 'object' && input !== null) {
            return Object.entries(input).filter(([, value]) => value).map(([key]) => key).join(" ");
        }
        return "";
    }).join(" ");
}

