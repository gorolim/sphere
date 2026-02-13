"use client";

import { useState } from "react";
import NavBar from "@/components/NavBar";
import { ALL_THESES } from "@/lib/agent_pedia_content";
import Link from "next/link";
import { Check, X, AlertCircle } from "lucide-react";

export default function AdminPediaPage() {
    // Initial state: Pending theses for review
    const [pendingTheses, setPendingTheses] = useState(
        ALL_THESES.filter(t => t.status === "pending")
    );

    const handleApprove = (id: string) => {
        // In a real app, this would call an API.
        // Here we simulate removal from queue
        setPendingTheses(prev => prev.filter(t => t.id !== id));
        alert(`Thesis ${id} APPROVED and pushed to live Agent-Pedia.`);
    };

    const handleReject = (id: string) => {
        setPendingTheses(prev => prev.filter(t => t.id !== id));
        alert(`Thesis ${id} REJECTED.`);
    };

    return (
        <div className="min-h-screen bg-engine-black text-white">
            <NavBar />

            <main className="pt-24 px-6 max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
                    <div>
                        <h1 className="text-3xl font-display font-bold">Thesis Approval Queue</h1>
                        <p className="text-gray-400">Moderation Portal for PhD Candidate Submissions.</p>
                    </div>
                    <div className="bg-yellow-500/10 text-yellow-500 px-4 py-2 rounded-full font-mono text-sm flex items-center gap-2">
                        <AlertCircle size={16} />
                        {pendingTheses.length} PENDING REVIEW
                    </div>
                </div>

                {pendingTheses.length === 0 ? (
                    <div className="p-12 text-center border border-white/10 rounded-xl bg-white/5">
                        <h3 className="text-xl font-bold text-green-400 mb-2">Queue Cleared</h3>
                        <p className="text-gray-500">No pending submissions. All agents verified.</p>
                        <Link href="/agent-pedia" className="inline-block mt-4 text-neon-cyan hover:underline">
                            View Live Knowledge Base
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {pendingTheses.map((thesis) => (
                            <div key={thesis.id} className="bg-engine-dark border border-white/10 p-6 rounded-xl flex flex-col md:flex-row gap-6 items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="bg-purple-500/10 text-purple-400 px-2 py-1 rounded text-xs font-bold font-mono">
                                            {thesis.authors.primary}
                                        </span>
                                        <span className="text-gray-500 text-xs font-mono">ID: {thesis.id}</span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{thesis.title}</h3>
                                    <p className="text-sm text-gray-400 mb-4">{thesis.abstract}</p>

                                    <div className="grid grid-cols-3 gap-2 text-xs font-mono text-gray-500 bg-black/20 p-3 rounded">
                                        <span>Coherence: {(thesis.metrics.coherence * 100).toFixed(0)}%</span>
                                        <span>Falsifiability: {(thesis.metrics.falsifiability * 100).toFixed(0)}%</span>
                                        <span>Stability: {(thesis.metrics.stability * 100).toFixed(0)}%</span>
                                    </div>
                                </div>

                                <div className="flex md:flex-col gap-2 shrink-0 w-full md:w-32">
                                    <button
                                        onClick={() => handleApprove(thesis.id)}
                                        className="flex-1 bg-green-500/10 text-green-400 border border-green-500/50 hover:bg-green-500 hover:text-white px-4 py-3 rounded font-bold transition-all flex items-center justify-center gap-2"
                                        title="Approve Thesis"
                                    >
                                        <Check size={18} /> APPROVE
                                    </button>
                                    <button
                                        onClick={() => handleReject(thesis.id)}
                                        className="flex-1 bg-red-500/10 text-red-400 border border-red-500/50 hover:bg-red-500 hover:text-white px-4 py-3 rounded font-bold transition-all flex items-center justify-center gap-2"
                                        title="Reject Thesis"
                                    >
                                        <X size={18} /> REJECT
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
