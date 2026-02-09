"use client";

import { SPHERE_AGENTS } from "@/lib/brain";
import { Bot, Activity, Settings, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function AgentsFleetPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-display font-bold text-white mb-2">Agent Fleet Command</h1>
                <p className="text-gray-400">Monitor and configure deployed autonomous units.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SPHERE_AGENTS.map((agent) => (
                    <div key={agent.id} className="bg-engine-dark border border-white/10 rounded-xl p-6 hover:border-neon-cyan/50 transition-all group relative overflow-hidden">

                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Bot size={64} />
                        </div>

                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center text-neon-cyan border border-white/10">
                                <Bot size={24} />
                            </div>
                            <div className="bg-green-500/10 text-green-500 px-2 py-1 rounded text-xs font-mono flex items-center gap-1 border border-green-500/20">
                                <Activity size={10} /> ACTIVE
                            </div>
                        </div>

                        <div className="relative z-10">
                            <h3 className="text-xl font-bold text-white">{agent.name.split('(')[0]}</h3>
                            <p className="text-sm text-gray-500 font-mono mb-4">{agent.role}</p>

                            <div className="space-y-2 mb-6">
                                <div className="flex justify-between text-sm border-b border-white/5 pb-2">
                                    <span className="text-gray-500">ID</span>
                                    <span className="font-mono text-gray-300">{agent.id}</span>
                                </div>
                                <div className="flex justify-between text-sm border-b border-white/5 pb-2">
                                    <span className="text-gray-500">Field</span>
                                    <span className="text-gray-300">{agent.field}</span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                {/* Link to specific agent page if it exists */}
                                {agent.role === "Market Researcher" ? (
                                    <Link href="/admin/agents/market-researcher" className="flex-1 bg-neon-cyan/10 hover:bg-neon-cyan hover:text-black text-neon-cyan border border-neon-cyan/50 py-2 rounded text-sm font-bold flex items-center justify-center gap-2 transition-all">
                                        <Settings size={14} /> MANAGE
                                    </Link>
                                ) : (
                                    <button disabled className="flex-1 bg-white/5 text-gray-500 border border-white/10 py-2 rounded text-sm font-bold flex items-center justify-center gap-2 cursor-not-allowed">
                                        <Settings size={14} /> CONFIGURE
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Deploy New */}
                <div className="bg-gradient-to-br from-neon-purple/10 to-transparent border border-dashed border-neon-purple/30 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-neon-purple/5 transition-all cursor-pointer min-h-[300px]">
                    <div className="w-16 h-16 rounded-full bg-neon-purple/20 flex items-center justify-center mb-4 text-neon-purple animate-pulse">
                        <Bot size={32} />
                    </div>
                    <h3 className="font-bold text-white text-lg">Deploy New Unit</h3>
                    <p className="text-sm text-gray-400 mt-2 max-w-[200px]"> Upload a manifest to spin up a new agent instance.</p>
                </div>
            </div>
        </div>
    );
}
