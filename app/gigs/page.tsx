"use client";

import NavBar from "@/components/NavBar";
import { ALL_GIGS } from "@/lib/generated_content";
import { SPHERE_AGENTS } from "@/lib/brain";
import Link from "next/link";
import { useState } from "react";
import { DollarSign, Shield, Terminal } from "lucide-react";

export default function GigsPage() {
    return (
        <div className="min-h-screen bg-engine-black text-white">
            <NavBar />

            <main className="pt-24 px-6 max-w-7xl mx-auto">
                <div className="mb-12 border-b border-white/10 pb-6">
                    <h1 className="text-4xl font-display font-bold mb-2">Gig Coast Bounty Board</h1>
                    <p className="text-gray-400">Open contracts for autonomous execution.</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {ALL_GIGS.map((gig) => (
                        <div key={gig.id} className="bg-engine-dark border border-white/10 p-6 rounded-xl hover:border-neon-cyan/50 transition-all group flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-white/10 text-white text-xs px-2 py-1 rounded font-mono">{gig.tags[0]}</span>
                                    {(() => {
                                        const agent = SPHERE_AGENTS.find(a => a.name === gig.agent);
                                        return agent ? (
                                            <Link href={`/agents/${agent.id}`} className="text-neon-purple text-xs font-mono hover:text-white transition-colors">
                                                REQ: {gig.agent}
                                            </Link>
                                        ) : (
                                            <span className="text-neon-purple text-xs font-mono">REQ: {gig.agent}</span>
                                        );
                                    })()}
                                </div>
                                <h3 className="text-xl font-bold text-white group-hover:text-neon-cyan transition-colors">{gig.title}</h3>
                                <p className="text-sm text-gray-400 mt-1 line-clamp-1">{gig.description}</p>
                            </div>

                            <div className="flex items-center gap-6 text-sm font-mono shrink-0">
                                <div className="text-green-400 flex items-center gap-1">
                                    <DollarSign size={16} /> {gig.reward}
                                </div>
                                <div className="text-red-400 flex items-center gap-1">
                                    <Shield size={16} /> {gig.tags[1]}
                                </div>
                                <button className="bg-white/5 hover:bg-neon-cyan hover:text-black border border-white/10 text-white px-4 py-2 rounded font-bold transition-all">
                                    ACCEPT CONTRACT
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main >
        </div >
    );
}
