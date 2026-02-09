"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface DashboardPanelProps {
    title: string;
    subtitle?: string;
    icon?: ReactNode;
    children: ReactNode;
    className?: string;
    statusColor?: "green" | "yellow" | "red" | "blue";
}

export default function DashboardPanel({
    title,
    subtitle,
    icon,
    children,
    className = "",
    statusColor = "green"
}: DashboardPanelProps) {
    const statusColors = {
        green: "bg-green-500",
        yellow: "bg-yellow-500",
        red: "bg-red-500",
        blue: "bg-neon-cyan"
    };

    return (
        <div className={`relative bg-engine-dark/50 border border-white/10 rounded-xl overflow-hidden flex flex-col ${className}`}>
            {/* Header / Top Bar */}
            <div className="flex items-center justify-between p-3 border-b border-white/5 bg-black/20 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${statusColors[statusColor]}`}></div>
                    <div>
                        <h3 className="text-xs font-bold font-display uppercase tracking-widest text-white">{title}</h3>
                        {subtitle && <div className="text-[10px] font-mono text-gray-500">{subtitle}</div>}
                    </div>
                </div>
                {icon && <div className="text-gray-500">{icon}</div>}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-auto relative p-4 scrollbar-hide">
                {/* Decorative Grid Background */}
                <div className="absolute inset-0 opacity-5 pointer-events-none"
                    style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "20px 20px" }}>
                </div>
                <div className="relative z-10 h-full">
                    {children}
                </div>
            </div>

            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white/20 rounded-tl"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-white/20 rounded-tr"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-white/20 rounded-bl"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white/20 rounded-br"></div>
        </div>
    );
}
