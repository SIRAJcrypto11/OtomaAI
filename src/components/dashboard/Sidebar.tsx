"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    BarChart3,
    Bot,
    Workflow,
    Blocks,
    Settings,
    LogOut,
    LayoutDashboard,
    ShoppingCart,
    Users,
    ShieldAlert
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mapping roles to their allowed primary items
const getPrimaryItems = (role: string) => {
    const baseItems = [
        { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
        { icon: Bot, label: "Agents", href: "/dashboard/agents" },
        { icon: Workflow, label: "Workflows", href: "/dashboard/workflows" },
    ];

    if (role === "Super Admin" || role === "Workspace Owner") {
        return [
            ...baseItems,
            { icon: Blocks, label: "Integrations", href: "/dashboard/integrations" },
            { icon: ShoppingCart, label: "Marketplace", href: "/dashboard/marketplace" },
            { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
        ];
    }

    return baseItems;
};

// Mapping roles to their allowed secondary items
const getSecondaryItems = (role: string) => {
    if (role === "Super Admin") {
        return [
            { icon: ShieldAlert, label: "Global Settings", href: "/dashboard/settings" },
            { icon: Users, label: "All Users", href: "/dashboard/settings/team" },
        ];
    } else if (role === "Workspace Owner") {
        return [
            { icon: Users, label: "Team", href: "/dashboard/settings/team" },
            { icon: Settings, label: "Settings", href: "/dashboard/settings" },
        ];
    }

    // Operators don't see settings
    return [];
};

export default function Sidebar({ role = "Operator" }: { role?: string }) {
    const pathname = usePathname();
    const primaryItems = getPrimaryItems(role);
    const secondaryItems = getSecondaryItems(role);

    return (
        <aside className="w-64 border-r bg-surface flex flex-col h-full sticky top-0">
            <div className="p-6">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                        <Bot className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <span className="text-xl font-bold tracking-tight text-foreground leading-none">
                            NEXUS <span className="text-primary text-xs ml-1 uppercase">v2.1</span>
                        </span>
                        <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mt-0.5">
                            {role}
                        </div>
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-1">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">
                    Platform
                </div>
                {primaryItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                            pathname === item.href
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                    >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                    </Link>
                ))}

                {secondaryItems.length > 0 && (
                    <div className="pt-8">
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">
                            Administration
                        </div>
                        {secondaryItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                    pathname === item.href
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                                {item.label}
                            </Link>
                        ))}
                    </div>
                )}
            </nav>

            <div className="p-4 mt-auto border-t">
                <Link
                    href="/api/auth/signout"
                    className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-danger hover:bg-danger/10 transition-colors"
                >
                    <LogOut className="h-5 w-5" />
                    Logout
                </Link>
            </div>
        </aside>
    );
}
