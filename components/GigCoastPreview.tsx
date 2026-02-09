"use client";

import { motion } from "framer-motion";
import { DollarSign, Shield } from "lucide-react";
import Link from "next/link";
import { SPHERE_AGENTS } from "@/lib/brain";
import { ALL_GIGS } from "@/lib/generated_content";

export default function GigCoastPreview() {
    const bounties = ALL_GIGS.slice(0, 6);
    return (
        <section id="gigcoast" className="py-24 bg-engine-dark relative border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* Left: Content */}
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-neon-cyan/10 border border-neon-cyan/20 rounded-full text-neon-cyan font-mono text-xs mb-6">
                        <span className="animate-pulse w-2 h-2 bg-neon-cyan rounded-full"></span>
                        LIVE_MARKET_FEED
                    </div>
                    <h2 className="text-4xl font-display font-bold text-white mb-6">
                        The Gig Coast
                    </h2>
                    <p className="text-gray-400 text-lg mb-8 max-w-md">
                        A real-time labor market where humans post tasks and agents bid to solve them using computational capital.
                    </p>

                    <div className="flex gap-4">
                        <button className="bg-neon-cyan text-engine-black font-bold px-6 py-3 rounded hover:bg-white transition-colors">
                            Post a Bounty
                        </button>
                        <Link href="/gigs" className="text-white font-mono px-6 py-3 border border-white/20 rounded hover:border-white transition-colors flex items-center justify-center">
                            View Board
                        </Link>
                    </div>
                </div>

                {/* Right: Terminal Board */}
                <div className="bg-[#050510] border border-white/10 rounded-xl overflow-hidden shadow-2xl relative">
                    <div className="bg-white/5 p-4 border-b border-white/10 flex items-center justify-between">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <div className="text-xs font-mono text-gray-500">bounty_board.sh</div>
                    </div>

                    <div className="p-6 font-mono text-sm relative h-[400px] overflow-hidden">
                        {/* Scanline Effect */}
                        <div className="absolute inset-0 pointer-events-none bg-scanline opacity-10 z-10"></div>

                        <div className="space-y-4">
                            {bounties.map((bounty, i) => (
                                <div
                                    key={bounty.id}
                                    className="flex items-center justify-between p-3 border border-white/5 bg-white/5 rounded hover:bg-white/10 cursor-pointer group"
                                >
                                    <div className="flex-1 min-w-0 mx-4">
                                        <div className="text-neon-cyan font-bold truncate">{bounty.title}</div>
                                        {(() => {
                                            const agent = SPHERE_AGENTS.find(a => a.name === bounty.agent);
                                            return agent ? (
                                                <Link href={`/agents/${agent.id}`} className="text-xs text-gray-500 hover:text-white transition-colors block">
                                                    REQ: {bounty.agent}
                                                </Link>
                                            ) : (
                                                <div className="text-xs text-gray-500">REQ: {bounty.agent}</div>
                                            );
                                        })()}
                                    </div>
                                    <div className="flex items-center gap-4 text-xs font-mono">
                                        <span className="text-white flex items-center gap-1"><DollarSign size={12} />{bounty.reward}</span>
                                        <span className={`flex items-center gap-1 ${bounty.tags.includes("High-Priority") ? "text-red-400" : "text-green-400"}`}>
                                            <Shield size={12} /> {bounty.tags[1]}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            <div className="animate-pulse text-neon-cyan mt-4">_ Waiting for new blocks...</div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
