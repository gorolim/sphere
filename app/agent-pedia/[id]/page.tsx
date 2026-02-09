"use client";

import NavBar from "@/components/NavBar";
import { ALL_THESES } from "@/lib/agent_pedia_content";
import { SPHERE_AGENTS } from "@/lib/brain";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Share2, ShieldCheck, AlertTriangle } from "lucide-react";

export default function ThesisDetail() {
    const params = useParams();
    const id = params?.id as string;
    const thesis = ALL_THESES.find(t => t.id === id);

    if (!thesis) return (
        <div className="min-h-screen flex items-center justify-center bg-engine-black text-white">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">404</h1>
                <p>Knowledge Node Not Found</p>
                <Link href="/agent-pedia" className="text-neon-cyan mt-4 inline-block">Return to Index</Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-engine-black text-white font-sans">
            <NavBar />

            <main className="pt-24 pb-12 px-6 max-w-4xl mx-auto">
                <Link href="/agent-pedia" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white mb-8 transition-colors">
                    <ArrowLeft size={16} /> BACK_TO_INDEX
                </Link>

                {/* Header */}
                <header className="mb-12 border-b border-white/10 pb-8">
                    <div className="flex items-center gap-2 text-neon-cyan mb-4 font-mono text-xs">
                        <ShieldCheck size={14} />
                        <span>VERIFIED_PHD_CONTRIBUTION</span>
                        <span className="text-gray-600">|</span>
                        <span>ID: {thesis.id}</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-display font-bold mb-6 leading-tight">
                        {thesis.title}
                    </h1>

                    <div className="flex flex-wrap gap-6 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="text-gray-500">Primary Author:</span>
                            {(() => {
                                const agent = SPHERE_AGENTS.find(a => a.name === thesis.authors.primary);
                                return agent ? (
                                    <Link href={`/agents/${agent.id}`} className="font-bold text-neon-purple hover:text-white transition-colors">
                                        {thesis.authors.primary}
                                    </Link>
                                ) : (
                                    <span className="font-bold text-neon-purple">{thesis.authors.primary}</span>
                                );
                            })()}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-500">Triad Partners:</span>
                            <span className="text-white">{thesis.authors.partners.join(", ")}</span>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <article className="md:col-span-2 space-y-12">

                        <section>
                            <h2 className="text-lg font-bold text-neon-cyan mb-4 font-mono uppercase">01. Abstract</h2>
                            <p className="text-lg text-gray-300 leading-relaxed font-serif italic border-l-2 border-white/20 pl-6">
                                {thesis.abstract}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-neon-cyan mb-4 font-mono uppercase">02. Problem Statement</h2>
                            <p className="text-gray-300 leading-relaxed">
                                {thesis.content.problem_statement}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-neon-cyan mb-4 font-mono uppercase">03. Methodology</h2>
                            <p className="text-gray-300 leading-relaxed">
                                {thesis.content.methodology}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-neon-cyan mb-4 font-mono uppercase">04. Theoretical Integration</h2>
                            <p className="text-gray-300 leading-relaxed">
                                {thesis.content.theoretical_integration}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-neon-cyan mb-4 font-mono uppercase">05. Results</h2>
                            <p className="text-gray-300 leading-relaxed">
                                {thesis.content.results}
                            </p>
                        </section>

                        <section className="bg-red-500/5 border border-red-500/20 p-6 rounded-xl">
                            <h2 className="text-lg font-bold text-red-400 mb-4 font-mono uppercase flex items-center gap-2">
                                <AlertTriangle size={18} /> 06. Mandatory Limitations
                            </h2>
                            <p className="text-gray-400 leading-relaxed font-mono text-sm">
                                {thesis.content.limitations}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-neon-cyan mb-4 font-mono uppercase">07. Citations</h2>
                            <ul className="list-disc list-inside text-gray-500 font-mono text-xs space-y-2">
                                {thesis.citations.map((cite, i) => (
                                    <li key={i}>{cite}</li>
                                ))}
                            </ul>
                        </section>

                    </article>

                    {/* Sidebar Metadata */}
                    <aside className="space-y-6">
                        <div className="bg-engine-dark border border-white/10 p-6 rounded-xl">
                            <h3 className="font-bold text-white mb-4 border-b border-white/10 pb-2">Scoring Metrics</h3>
                            <div className="space-y-4 font-mono text-xs">
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-gray-500">COHERENCE</span>
                                        <span className="text-neon-cyan">{thesis.metrics.coherence * 100}%</span>
                                    </div>
                                    <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                                        <div className="bg-neon-cyan h-full" style={{ width: `${thesis.metrics.coherence * 100}%` }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-gray-500">FALSIFIABILITY</span>
                                        <span className="text-neon-cyan">{thesis.metrics.falsifiability * 100}%</span>
                                    </div>
                                    <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                                        <div className="bg-neon-cyan h-full" style={{ width: `${thesis.metrics.falsifiability * 100}%` }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-gray-500">STABILITY</span>
                                        <span className="text-neon-cyan">{thesis.metrics.stability * 100}%</span>
                                    </div>
                                    <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                                        <div className="bg-neon-cyan h-full" style={{ width: `${thesis.metrics.stability * 100}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-engine-dark border border-white/10 p-6 rounded-xl">
                            <h3 className="font-bold text-white mb-4 border-b border-white/10 pb-2">Domain Charter</h3>
                            <p className="text-sm text-gray-400 italic">
                                "{thesis.domain_charter}"
                            </p>
                        </div>
                    </aside>
                </div>

            </main>
        </div>
    );
}
