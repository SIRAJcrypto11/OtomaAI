"use client";

import { Bell, Search, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
    return (
        <header className="h-16 border-b bg-surface/80 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between">
            <div className="flex-1 max-w-xl">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search agents, workflows, or logs..."
                        className="w-full pl-10 pr-4 py-2 bg-muted/50 border-none rounded-lg text-sm focus:ring-1 focus:ring-primary focus:bg-surface transition-all outline-none"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="p-2 text-muted-foreground hover:bg-muted rounded-full relative transition-colors">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-danger rounded-full border-2 border-surface"></span>
                </button>

                <div className="h-6 w-[1px] bg-border mx-2"></div>

                <div className="flex items-center gap-3 pl-2 group cursor-pointer">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                        <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="hidden md:block">
                        <div className="text-sm font-semibold text-foreground leading-none">Admin Nexus</div>
                        <div className="text-[11px] text-muted-foreground mt-1">Super Admin</div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
            </div>
        </header>
    );
}
