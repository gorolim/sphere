"use client";

import NavBar from "@/components/NavBar";
import { ALL_SIMULATIONS } from "@/lib/generated_content";
import { SPHERE_AGENTS } from "@/lib/brain";
import Link from "next/link";
import { Brain, RefreshCw, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function ArenaPage() {
    const [streamIndex, setStreamIndex] = useState(0);

    // Virtualize or limit to show diversity
    const displaySims = ALL_SIMULATIONS.slice(0, 20);

    return (
        <div className="min-h-screen bg-engine-black text-white">
            <NavBar />

            <main className="pt-24 px-6 max-w-7xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl font-display font-bold mb-2">The Arena</h1>
                    <p className="text-gray-400">Cognitive Loop Visualizer [Perception &gt; Cognition &gt; Action]</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Active Cluster Visualization */}
                    <div className="bg-engine-dark border border-white/10 rounded-xl p-8 min-h-[400px] flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                        <div className="relative z-10 text-center">
                            <div className="w-32 h-32 mx-auto bg-neon-cyan/10 rounded-full flex items-center justify-center border-4 border-neon-cyan/30 animate-pulse mb-6">
                                <Brain size={48} className="text-neon-cyan" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Simulating Epoch {3400 + streamIndex}</h2>
                            <h2 className="text-2xl font-bold mb-2">Simulating Epoch {3400 + streamIndex}</h2>
                            {(() => {
                                const agent = SPHERE_AGENTS.find(a => a.name === displaySims[streamIndex].agent);
                                return agent ? (
                                    <Link href={`/agents/${agent.id}`} className="font-mono text-neon-purple mt-2 hover:text-white transition-colors block">
                                        Thread: {displaySims[streamIndex].agent}
                                    </Link>
                                ) : (
                                    <p className="font-mono text-neon-purple mt-2">Thread: {displaySims[streamIndex].agent}</p>
                                );
                            })()}

                            <div className="mt-8 text-left max-w-sm mx-auto space-y-3 font-mono text-xs">
                                {displaySims[streamIndex].steps.map((step, i) => (
                                    <div key={i} className="flex gap-2 opacity-80">
                                        <span className="text-gray-500 w-20">{step.name}:</span>
                                        <span className="text-green-400">{step.log}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Simulation Feed */}
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                        {displaySims.map((sim, i) => (
                            <div
                                key={sim.id}
                                onClick={() => setStreamIndex(i)}
                                className={`p-4 rounded-xl border cursor-pointer transition-all ${i === streamIndex
                                    ? "bg-neon-cyan/10 border-neon-cyan"
                                    : "bg-white/5 border-white/10 hover:bg-white/10"
                                    }`}
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-sm">{sim.agent}</span>
                                    <span className="text-xs font-mono text-gray-500">{sim.cycle}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <RefreshCw size={12} className={sim.status === "Processing" ? "animate-spin" : ""} />
                                    {sim.status}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
