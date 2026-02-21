"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    CircleDollarSign,
    LayoutDashboard,
    Users,
    Settings,
    Activity,
    Shield,
    Globe,
    Workflow,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Clapperboard,
    Briefcase,
    PenTool,
    Brain,
    Sparkles,
    RadioReceiver,
    Hexagon
} from "lucide-react";

interface AdminSidebarProps {
    collapsed: boolean;
    toggleCollapse: () => void;
}

export default function AdminSidebar({ collapsed, toggleCollapse }: AdminSidebarProps) {
    const pathname = usePathname();

    const menuItems = [
        { name: "The Nexus", href: "/master-admin", icon: <LayoutDashboard size={20} /> },
        { name: "The Mind", href: "/master-admin/mind", icon: <Brain size={20} /> },
        { name: "PR & Campaigns", href: "/master-admin/mind/campaigns", icon: <RadioReceiver size={20} /> },
        { name: "World Builder", href: "/master-admin/mind/world-builder", icon: <Hexagon size={20} /> },
        { name: "The Body", href: "/master-admin/body", icon: <Globe size={20} /> },
        { name: "The Spirit", href: "/master-admin/spirit", icon: <Sparkles size={20} /> },
        { name: "The Sri Yantra", href: "/master-admin/sri-yantra", icon: <CircleDollarSign size={20} /> },
        { name: "Studio", href: "/master-admin/studio", icon: <Clapperboard size={20} /> },
        { name: "Global Intel", href: "/master-admin/intelligence", icon: <Shield size={20} /> },
        { name: "The Pulse", href: "/master-admin/system", icon: <Activity size={20} /> },
        { name: "Configuration", href: "/master-admin/settings", icon: <Settings size={20} /> },
        { name: "Profile (Nova)", href: "/master-admin/settings/profile", icon: <Settings size={20} /> },
    ];

    return (
        <aside
            className={`bg-[#050510] border-r border-white/10 fixed h-full flex flex-col z-50 transition-all duration-300 ease-in-out
            ${collapsed ? "w-20" : "w-64"}`}
        >
            <div className={`p-6 border-b border-white/10 flex items-center ${collapsed ? "justify-center" : "justify-between"}`}>
                {!collapsed && (
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-neon-purple animate-pulse"></div>
                        <h1 className="text-xl font-display font-bold text-white tracking-wider">
                            SPHERE<span className="text-neon-purple">ADMIN</span>
                        </h1>
                    </div>
                )}
                <button
                    onClick={toggleCollapse}
                    className="text-gray-500 hover:text-white transition-colors"
                >
                    {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>
            {!collapsed && (
                <div className="px-6 py-2 text-[10px] font-mono text-gray-500">v.2.0.27 [ALPHA]</div>
            )}

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto overflow-x-hidden">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            title={collapsed ? item.name : ""}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group whitespace-nowrap ${isActive
                                ? "bg-neon-purple/10 text-neon-purple border border-neon-purple/20 shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                                } ${collapsed ? "justify-center px-2" : ""}`}
                        >
                            <span className={isActive ? "text-neon-purple" : "text-gray-500 group-hover:text-white transition-colors"}>
                                {item.icon}
                            </span>
                            {!collapsed && <span className="font-mono text-sm">{item.name}</span>}
                            {isActive && !collapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-neon-purple shadow-[0_0_5px_#a855f7]"></div>}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/10">
                <Link
                    href="/"
                    title="Exit Console"
                    className={`flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all whitespace-nowrap ${collapsed ? "justify-center px-2" : ""}`}
                >
                    <LogOut size={20} />
                    {!collapsed && <span className="font-mono text-sm">Exit Console</span>}
                </Link>
            </div>
        </aside>
    );
}
