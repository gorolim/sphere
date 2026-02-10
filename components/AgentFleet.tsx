"use client";

import { useState } from "react";
import Link from "next/link";
import { SPHERE_AGENTS } from "@/lib/brain";
import { Zap, Briefcase } from "lucide-react";

interface AgentFleetProps {
    limit?: number;
    showFilters?: boolean;
    title?: string;
    subtitle?: string;
    dbAgents?: any[];
}

export default function AgentFleet({
    limit,
    showFilters = false,
    title = "My Agent Fleet",
    subtitle = "// AUTHORIZED_PERSONNEL_ONLY",
    dbAgents = []
}: AgentFleetProps) {
    const [filter, setFilter] = useState("All");

    const filteredAgents = filter === "All"
        ? SPHERE_AGENTS
        : SPHERE_AGENTS.filter(a => a.role.includes(filter) || a.field.includes(filter));

    const displayedAgents = limit ? filteredAgents.slice(0, limit) : filteredAgents;

    return (
        <section id="agent-fleet" className="py-24 max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-white/10 pb-6">
                <div>
                    <h2 className="text-4xl font-display font-bold mb-2">{title}</h2>
                    <p className="text-gray-400 font-mono text-sm">{subtitle}</p>
                </div>

                <div className="flex gap-2 mt-4 md:mt-0">
                    <span className="px-3 py-1 bg-green-500/10 text-green-500 border border-green-500/20 rounded font-mono text-xs flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        ALL_SYSTEMS_NOMINAL
                    </span>
                </div>
            </div>

            {/* Filters */}
            {showFilters && (
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                    {["All", "Hardware", "Market", "Architect", "Logic", "Creative"].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-1 rounded-none border-b-2 font-mono text-xs uppercase transition-colors ${filter === f
                                ? "border-neon-cyan text-neon-cyan font-bold bg-white/5"
                                : "border-transparent text-gray-500 hover:text-white"
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            )}

            {/* Agent List (Admin Style) */}
            <div className="bg-engine-dark border border-white/10 rounded-xl overflow-hidden">
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/10 bg-white/5 text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                    <div className="col-span-6 md:col-span-4">Agent Identity</div>
                    <div className="col-span-3 hidden md:block">Role / Spec</div>
                    <div className="col-span-3 md:col-span-2 text-right md:text-left">Status</div>
                    <div className="col-span-3 text-right">Action</div>
                </div>

                <div className="divide-y divide-white/5">
                    {displayedAgents.map(agent => {
                        // Check DB status
                        const dbAgent = dbAgents.find(dba => dba.slug === agent.id.toLowerCase() || dba.slug === agent.name.toLowerCase().replace(/ /g, '-'));
                        // Ideally we match by ID, but SPHERE_AGENTS uses custom IDs "LOGIC-001".
                        // In seed.ts we created agents. I should check how they map.
                        // Assuming the seed or admin panel created agents with matching IDs or we fallback to 'isActive: false' if not found.
                        // Let's assume passed dbAgents have a matching ID or we just rely on isActive if we can match.

                        // Fix: In seed.ts, agents are created with `slug: agent.id`.
                        const isOnline = dbAgents.find(a => a.slug === agent.id)?.isActive ?? false;

                        return (
                            <div key={agent.id} className={`grid grid-cols-12 gap-4 p-4 items-center transition-colors group ${isOnline ? 'hover:bg-white/5' : 'opacity-70 grayscale hover:grayscale-0'}`}>
                                {/* Identity */}
                                <div className="col-span-6 md:col-span-4 flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-display font-bold transition-colors ${isOnline ? 'bg-white/5 text-gray-500 group-hover:text-neon-cyan group-hover:bg-neon-cyan/10' : 'bg-red-500/10 text-red-500'}`}>
                                        {agent.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className={`font-bold text-sm transition-colors ${isOnline ? 'text-white group-hover:text-neon-cyan' : 'text-gray-500'}`}>{agent.name}</div>
                                        <div className="text-[10px] font-mono text-gray-500">{agent.id}</div>
                                    </div>
                                </div>

                                {/* Role */}
                                <div className="col-span-3 hidden md:block">
                                    <div className="text-xs text-gray-300">{agent.role}</div>
                                    <div className="text-[10px] text-gray-600">{agent.field}</div>
                                </div>

                                {/* Status */}
                                <div className="col-span-3 md:col-span-2 text-right md:text-left">
                                    {isOnline ? (
                                        <div className="inline-flex items-center gap-2 px-2 py-1 rounded bg-green-500/10 border border-green-500/20 text-[10px] font-mono text-green-500">
                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                            ACTIVE
                                        </div>
                                    ) : (
                                        <div className="inline-flex items-center gap-2 px-2 py-1 rounded bg-yellow-500/10 border border-yellow-500/20 text-[10px] font-mono text-yellow-500">
                                            <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></div>
                                            TRAINING
                                        </div>
                                    )}
                                </div>

                                {/* Action */}
                                <div className="col-span-3 text-right">
                                    {isOnline ? (
                                        <Link href={`/agents/${agent.id}`} className="text-xs font-mono font-bold text-gray-400 hover:text-white border border-white/10 hover:border-white px-3 py-2 rounded transition-all">
                                            ACCESS -&gt;
                                        </Link>
                                    ) : (
                                        <span className="text-[10px] font-mono text-gray-600 cursor-not-allowed border border-transparent px-3 py-2">
                                            LOCKED
                                        </span>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Footer depending on context */}
                <div className="p-4 bg-black/20 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-gray-500">
                    <div>SHOWING {displayedAgents.length} UNITS</div>
                    {limit && limit < filteredAgents.length ? (
                        <Link href="/directory" className="hover:text-neon-cyan transition-colors">
                            VIEW FULL MANIFEST ({filteredAgents.length}) -&gt;
                        </Link>
                    ) : (
                        <div>PAGE 1 OF 1</div>
                    )}
                </div>
            </div>

            {!limit && (
                /* Placeholder for "Add Your Agent" - Only show on full directory */
                <div className="mt-6 border border-dashed border-white/20 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors cursor-pointer group">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4 group-hover:bg-neon-cyan group-hover:text-black transition-colors">
                        <Briefcase size={20} />
                    </div>
                    <h3 className="font-bold text-gray-300 group-hover:text-white">Deploy Agent</h3>
                    <p className="text-xs text-gray-500 mt-2">Upload manifest.json to join the swarm.</p>
                </div>
            )}
        </section>
    );
}
