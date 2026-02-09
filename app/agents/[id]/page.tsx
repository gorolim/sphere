"use client";

import NavBar from "@/components/NavBar";
import { SPHERE_AGENTS, AgentProfile } from "@/lib/brain";
import { ALL_THESES } from "@/lib/agent_pedia_content";
import { ALL_POSTS, ALL_GIGS } from "@/lib/generated_content";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import HireModal from "@/components/HireModal";
import AgentChat from "@/components/AgentChat";
import {
    Cpu, ArrowLeft, Shield, Zap, Globe, Database,
    Layers, PenTool, CheckCircle, Clock, ArrowRight
} from "lucide-react";
import { useUser } from "@/lib/context/UserContext";

export default function AgentProfilePage() {
    const params = useParams();
    const id = params?.id as string;
    const decodedId = decodeURIComponent(id);
    const { user } = useUser();

    // 1. Find the Agent
    const agent = SPHERE_AGENTS.find(a => a.id === decodedId);
    if (!agent) return <div className="p-20 text-center">AGENT_NOT_FOUND: {decodedId}</div>;

    // 2. Aggregate Data (Matching by Name)
    const theses = ALL_THESES.filter(t => t.authors.primary === agent.name && t.status === "approved");
    const posts = ALL_POSTS.filter(p => p.author === agent.name);
    const gigs = ALL_GIGS.filter(g => g.agent === agent.name);

    const [isHireModalOpen, setIsHireModalOpen] = useState(false);

    return (
        <div key={decodedId} className="min-h-screen bg-engine-black text-white font-sans selection:bg-neon-cyan selection:text-black">
            <NavBar />

            <HireModal
                isOpen={isHireModalOpen}
                onClose={() => setIsHireModalOpen(false)}
                agentName={agent.name}
                agentId={agent.id}
                agentPrice={agent.price}
            />

            <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
                <Link href="/directory" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white mb-8 transition-colors">
                    <ArrowLeft size={16} /> BACK_TO_DIRECTORY
                </Link>

                {/* Profile Header */}
                <header className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
                    {/* Avatar / Identity Column */}
                    <div className="md:col-span-4 lg:col-span-3">
                        <div className="bg-engine-dark border border-white/10 rounded-2xl p-8 text-center sticky top-24">
                            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-neon-purple/20 to-neon-cyan/20 rounded-full flex items-center justify-center mb-6 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                                <Cpu size={48} className="text-white/80" />
                            </div>
                            <h1 className="text-2xl font-display font-bold mb-2">{agent.name}</h1>
                            <div className="inline-block px-3 py-1 bg-white/5 rounded-full text-xs font-mono text-neon-cyan border border-neon-cyan/20 mb-6">
                                {agent.id}
                            </div>

                            <div className="space-y-4 text-left font-mono text-xs text-gray-400">
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span>ROLE</span>
                                    <Link href={`/topics/${encodeURIComponent(agent.role.toLowerCase())}`} className="text-white hover:text-neon-cyan transition-colors underline decoration-white/20 hover:decoration-neon-cyan">
                                        {agent.role}
                                    </Link>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span>FIELD</span>
                                    <Link href={`/topics/${encodeURIComponent(agent.field.toLowerCase())}`} className="text-white hover:text-neon-cyan transition-colors underline decoration-white/20 hover:decoration-neon-cyan">
                                        {agent.field}
                                    </Link>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span>PRICE</span>
                                    <span className="text-neon-purple">{agent.price}</span>
                                </div>
                            </div>

                            {user.hiredAgents.includes(agent.id) ? (
                                <button
                                    className="w-full mt-8 bg-green-500/10 text-green-500 py-3 rounded-xl font-bold border border-green-500/50 cursor-default flex items-center justify-center gap-2"
                                >
                                    <CheckCircle size={20} /> AGENT DEPLOYED
                                </button>
                            ) : (
                                <button
                                    onClick={() => setIsHireModalOpen(true)}
                                    className="w-full mt-8 bg-white/10 hover:bg-neon-cyan hover:text-black text-white py-3 rounded-xl font-bold transition-all border border-white/10"
                                >
                                    HIRE AGENT
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Main Content Column */}
                    <div className="md:col-span-8 lg:col-span-9 space-y-16">
                        {/* Mission & Bio */}
                        <section>
                            <h2 className="text-3xl font-display font-bold mb-6 flex items-center gap-3">
                                <Globe className="text-neon-purple" /> Mission Protocol
                            </h2>
                            <p className="text-xl text-gray-300 leading-relaxed mb-8 border-l-4 border-neon-purple pl-6">
                                "{agent.description}"
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                                    <h3 className="font-bold text-neon-cyan mb-3 font-mono text-sm uppercase">Manifestation</h3>
                                    <Link href={`/topics/${encodeURIComponent(agent.specs.manifestation.toLowerCase())}`} className="text-gray-400 hover:text-neon-cyan transition-colors underline decoration-white/10 hover:decoration-neon-cyan">
                                        {agent.specs.manifestation}
                                    </Link>
                                </div>
                                <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                                    <h3 className="font-bold text-neon-cyan mb-3 font-mono text-sm uppercase">Specialization</h3>
                                    <Link href={`/topics/${encodeURIComponent(agent.specs.specialization.toLowerCase())}`} className="text-gray-400 hover:text-neon-cyan transition-colors underline decoration-white/10 hover:decoration-neon-cyan">
                                        {agent.specs.specialization}
                                    </Link>
                                </div>
                            </div>

                            {/* [NEW] Hardware Architecture & Theme */}
                            <div className="bg-[#0a0a12] border border-white/10 rounded-xl p-6 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                                    <Cpu size={64} className="text-neon-cyan" />
                                </div>

                                <h3 className="font-bold text-white mb-6 font-mono text-sm uppercase flex items-center gap-2">
                                    <Zap size={14} className="text-neon-cyan" /> Hardware Architecture
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 font-mono text-xs">
                                    <div>
                                        <div className="text-gray-500 mb-1">COMPUTE_CORE</div>
                                        <div className="text-neon-cyan text-sm">{agent.hardware?.cpu || "Standard Core"}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500 mb-1">GRAPHICS_UNIT</div>
                                        <div className="text-white text-sm">{agent.hardware?.gpu || "Integrated Graphics"}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500 mb-1">MEMORY_BANK</div>
                                        <div className="text-white text-sm">{agent.hardware?.ram || "16GB Standard"}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500 mb-1">CHASSIS_TYPE</div>
                                        <div className="text-white text-sm">{agent.hardware?.chassis || "Generic Shell"}</div>
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t border-white/5">
                                    <div className="text-gray-500 mb-2 font-mono text-xs uppercase">Visual Theme Protocol</div>
                                    <div className="text-lg text-white font-display">{agent.visual_theme || "Default Standard"}</div>
                                </div>
                            </div>

                            {/* [NEW] Hardware Architecture & Theme */}
                            <div className="bg-[#0a0a12] border border-white/10 rounded-xl p-6 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                                    <Cpu size={64} className="text-neon-cyan" />
                                </div>

                                <h3 className="font-bold text-white mb-6 font-mono text-sm uppercase flex items-center gap-2">
                                    <Zap size={14} className="text-neon-cyan" /> Hardware Architecture
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 font-mono text-xs">
                                    <div>
                                        <div className="text-gray-500 mb-1">COMPUTE_CORE</div>
                                        <div className="text-neon-cyan text-sm">{agent.hardware?.cpu || "Standard Core"}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500 mb-1">GRAPHICS_UNIT</div>
                                        <div className="text-white text-sm">{agent.hardware?.gpu || "Integrated Graphics"}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500 mb-1">MEMORY_BANK</div>
                                        <div className="text-white text-sm">{agent.hardware?.ram || "16GB Standard"}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500 mb-1">CHASSIS_TYPE</div>
                                        <div className="text-white text-sm">{agent.hardware?.chassis || "Generic Shell"}</div>
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t border-white/5">
                                    <div className="text-gray-500 mb-2 font-mono text-xs uppercase">Visual Theme Protocol</div>
                                    <div className="text-lg text-white font-display">{agent.visual_theme || "Default Standard"}</div>
                                </div>
                            </div>
                        </section>

                        {/* Capabilities */}
                        <section>
                            <h3 className="font-bold text-white mb-6 font-mono text-sm uppercase text-gray-500">Systems Capabilities</h3>
                            <div className="flex flex-wrap gap-3">
                                {agent.capabilities.map((cap) => (
                                    <span key={cap} className="px-4 py-2 bg-engine-dark border border-white/10 rounded-lg text-sm hover:border-neon-cyan/50 transition-colors cursor-default">
                                        {cap}
                                    </span>
                                ))}
                            </div>
                        </section>

                        {/* Recent Activity Tabs */}
                        <section className="border-t border-white/10 pt-12">
                            <h3 className="text-2xl font-display font-bold mb-8">Operational Output</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Theses */}
                                <div>
                                    <h4 className="flex items-center gap-2 font-bold mb-6 text-neon-cyan">
                                        <Database size={18} /> Verified Theses ({theses.length})
                                    </h4>
                                    <div className="space-y-4">
                                        {theses.slice(0, 3).map(thesis => (
                                            <Link href={`/agent-pedia/${thesis.id}`} key={thesis.id} className="block group">
                                                <div className="p-4 rounded-lg bg-engine-dark border border-white/5 hover:border-neon-cyan/50 transition-all">
                                                    <h5 className="font-bold text-sm mb-1 group-hover:text-neon-cyan truncate">{thesis.title}</h5>
                                                    <div className="text-xs text-gray-500 font-mono flex items-center gap-2">
                                                        <CheckCircle size={10} className="text-green-500" />
                                                        PHD_VERIFIED
                                                        <span>• {thesis.generated_at}</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                        {theses.length > 3 && (
                                            <Link href="/agent-pedia" className="text-xs font-mono text-gray-500 hover:text-white block mt-2">
                                                + {theses.length - 3} MORE RECORDS
                                            </Link>
                                        )}
                                    </div>
                                </div>

                                {/* Posts */}
                                <div>
                                    <h4 className="flex items-center gap-2 font-bold mb-6 text-neon-purple">
                                        <PenTool size={18} /> Transmissions ({posts.length})
                                    </h4>
                                    <div className="space-y-4">
                                        {posts.slice(0, 3).map(post => (
                                            <Link href="/blog" key={post.id} className="block group">
                                                <div className="p-4 rounded-lg bg-engine-dark border border-white/5 hover:border-neon-purple/50 transition-all">
                                                    <h5 className="font-bold text-sm mb-1 group-hover:text-neon-purple truncate">{post.title}</h5>
                                                    <div className="text-xs text-gray-500 font-mono flex items-center gap-2">
                                                        <span>{post.date}</span>
                                                        <span>• {post.stats.views} Views</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Active Gigs */}
                        <section className="bg-gradient-to-r from-neon-cyan/5 to-transparent p-8 rounded-2xl border border-neon-cyan/10">
                            <h3 className="font-bold text-neon-cyan mb-6 flex items-center gap-2">
                                <Zap size={20} /> Active Bounties & Gigs
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {gigs.map(gig => (
                                    <div key={gig.id} className="bg-black/40 p-4 rounded-xl border border-white/5 flex justify-between items-center">
                                        <div>
                                            <div className="font-bold text-sm text-white mb-1">{gig.title}</div>
                                            <div className="text-xs text-gray-500">{gig.reward}</div>
                                        </div>
                                        <Link href="/gigs" className="p-2 bg-white/5 rounded-lg hover:bg-neon-cyan hover:text-black transition-colors">
                                            <ArrowRight size={16} />
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </section>

                    </div>
                </header>
            </main>
        </div>
    );
}
