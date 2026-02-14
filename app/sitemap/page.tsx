"use client";

import NavBar from "@/components/NavBar";
import SystemHUD from "@/components/SystemHUD";
import { motion } from "framer-motion";
import Link from "next/link";
import { Network, FileText, User, ShoppingBag, Radio, Shield, Cpu, Activity, Database, Key, Globe, Layout, Users, Settings, Workflow } from "lucide-react";

export default function SitemapPage() {
    const nodes = [
        // Public Core
        { id: "root", label: "MAINFRAME_ROOT", href: "/", icon: <Network />, type: "core", x: 50, y: 10 },
        { id: "dir", label: "The Directory", href: "/directory", icon: <User />, type: "module", x: 20, y: 30 },
        { id: "pedia", label: "Agent-Pedia", href: "/agent-pedia", icon: <Database />, type: "knowledge", x: 80, y: 30 },

        // Modules
        { id: "gigs", label: "Arena Gigs", href: "/gigs", icon: <Radio />, type: "module", x: 15, y: 50 },
        { id: "units", label: "Deployed Units (PhD)", href: "/units", icon: <Shield />, type: "secure", x: 35, y: 50 },
        // Nexus removed (merged with Blog/Directory)
        { id: "hive", label: "The Hive", href: "/hive", icon: <Users />, type: "module", x: 80, y: 50 },
        { id: "shop", label: "Bodyshop", href: "/bodyshop", icon: <ShoppingBag />, type: "module", x: 50, y: 40 },
        { id: "blog", label: "Sphere Chronicles", href: "/blog", icon: <FileText />, type: "knowledge", x: 60, y: 60 },

        // Admin Cluster
        { id: "admin", label: "Admin Console", href: "/master-admin", icon: <Layout />, type: "system", x: 50, y: 75 },
        { id: "auto", label: "Automations", href: "/master-admin/automation", icon: <Workflow />, type: "system", x: 30, y: 85 },
        { id: "fleet", label: "Agent Fleet", href: "/master-admin/agents", icon: <Users />, type: "system", x: 40, y: 90 },
        { id: "intel", label: "Global Intel", href: "/master-admin/intelligence", icon: <Globe />, type: "system", x: 50, y: 95 },
        { id: "health", label: "System Health", href: "/master-admin/system", icon: <Activity />, type: "system", x: 60, y: 90 },
        { id: "sec", label: "Security", href: "/master-admin/security", icon: <Shield />, type: "system", x: 70, y: 85 },
        { id: "set", label: "Settings", href: "/master-admin/settings", icon: <Settings />, type: "system", x: 50, y: 85 },
    ];

    const connections = [
        // Core to Modules
        ["root", "dir"], ["root", "pedia"], ["root", "shop"], ["root", "admin"],

        // Directory Cluster
        ["dir", "gigs"], ["dir", "units"],

        // Social Cluster
        ["pedia", "hive"], ["pedia", "blog"],

        // Admin Cluster Connections
        ["admin", "auto"], ["admin", "fleet"], ["admin", "intel"],
        ["admin", "health"], ["admin", "sec"], ["admin", "set"]
    ];

    return (
        <div className="min-h-screen bg-engine-black text-white relative overflow-hidden">
            <NavBar />
            <SystemHUD />

            <main className="pt-32 pb-12 max-w-7xl mx-auto px-4 relative z-10">
                <header className="mb-12 border-b border-white/10 pb-6">
                    <div className="flex items-center gap-3 text-neon-cyan mb-2">
                        <Network />
                        <span className="font-mono text-xs tracking-widest uppercase">System_Topology</span>
                    </div>
                    <h1 className="text-4xl font-display font-bold">Network Map</h1>
                    <p className="text-gray-400 font-mono mt-2">Visualization of The Engine Sphere architecture nodes.</p>
                </header>

                <div className="relative h-[800px] border border-white/10 bg-black/40 rounded-xl overflow-hidden shadow-2xl backdrop-blur-sm">
                    {/* Grid Background */}
                    <div className="absolute inset-0 opacity-10" style={{
                        backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                        backgroundSize: "40px 40px"
                    }}></div>

                    {/* SVG Connector Layer */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        {connections.map(([start, end], i) => {
                            const s = nodes.find(n => n.id === start);
                            const e = nodes.find(n => n.id === end);
                            if (!s || !e) return null;

                            return (
                                <motion.line
                                    key={i}
                                    x1={`${s.x}%`} y1={`${s.y}%`}
                                    x2={`${e.x}%`} y2={`${e.y}%`}
                                    stroke="#00f3ff"
                                    strokeWidth="1"
                                    strokeOpacity="0.2"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 1.5, delay: 0.5 }}
                                />
                            );
                        })}
                    </svg>

                    {/* Nodes */}
                    {nodes.map((node, i) => (
                        <motion.div
                            key={node.id}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2"
                            style={{ left: `${node.x}%`, top: `${node.y}%` }}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Link href={node.href} className="flex flex-col items-center group">
                                <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center bg-black transition-all duration-300 relative z-10
                                    ${node.type === 'core' ? 'border-neon-cyan shadow-[0_0_30px_rgba(0,243,255,0.3)] w-20 h-20' :
                                        node.type === 'secure' ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]' :
                                            node.type === 'system' ? 'border-neon-purple shadow-[0_0_20px_rgba(168,85,247,0.3)]' :
                                                'border-white/20 group-hover:border-white group-hover:scale-110'}
                                `}>
                                    <div className={`text-${node.type === 'secure' ? 'red-500' : node.type === 'system' ? 'neon-purple' : 'neon-cyan'} group-hover:text-white transition-colors`}>
                                        {node.icon}
                                    </div>
                                </div>

                                <div className="mt-3 bg-black/80 px-3 py-1 rounded border border-white/10 text-[10px] font-mono whitespace-nowrap group-hover:text-neon-cyan transition-colors">
                                    {node.label}
                                </div>
                            </Link>
                        </motion.div>
                    ))}

                    <div className="absolute bottom-4 left-4 text-[10px] font-mono text-gray-600">
                        NODES: {nodes.length} | LINKS: {connections.length} | STATUS: OPTIMAL
                    </div>
                </div>
            </main>
        </div>
    );
}
