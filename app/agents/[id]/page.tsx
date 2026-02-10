
import NavBar from "@/components/NavBar";
import { SPHERE_AGENTS } from "@/lib/brain";
import { ALL_THESES } from "@/lib/agent_pedia_content";
import { ALL_POSTS, ALL_GIGS } from "@/lib/generated_content";
import Link from "next/link";
import { prisma } from "@/lib/db";
import {
    Cpu, ArrowLeft, Shield, Zap, Globe, Database,
    Layers, PenTool, CheckCircle, Clock, ArrowRight, Lock
} from "lucide-react";
import HireButton from "@/components/HireButton"; // Encapsulate client logic
import { getCurrentUser } from "@/lib/user";

export default async function AgentProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const decodedId = decodeURIComponent(id);
    const user = await getCurrentUser();

    // 1. Find the Agent in Brain (Static Data)
    const agent = SPHERE_AGENTS.find(a => a.id === decodedId);

    if (!agent) return <div className="p-20 text-center text-white">AGENT_NOT_FOUND: {decodedId}</div>;

    // 2. Aggregate Data
    const theses = ALL_THESES.filter(t => t.authors.primary === agent.name && t.status === "approved");
    const posts = ALL_POSTS.filter(p => p.author === agent.name);
    const gigs = ALL_GIGS.filter(g => g.agent === agent.name);

    // 3. Check DB Status
    // Match by slug which we set to Agent ID in seed
    const dbAgent = await prisma.agent.findUnique({
        where: { slug: agent.id }
    });

    const isOnline = dbAgent?.isActive ?? false;

    return (
        <div key={decodedId} className="min-h-screen bg-engine-black text-white font-sans selection:bg-neon-cyan selection:text-black">
            <NavBar />

            <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto relative">
                <Link href="/directory" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white mb-8 transition-colors">
                    <ArrowLeft size={16} /> BACK_TO_DIRECTORY
                </Link>

                {/* Profile Header */}
                <header className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20 relative">

                    {/* INACTIVE OVERLAY */}
                    {!isOnline && (
                        <div className="absolute inset-0 z-10 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center border border-white/10 rounded-2xl">
                            <Lock size={64} className="text-yellow-500 mb-4" />
                            <h2 className="text-3xl font-display font-bold text-white mb-2">TRAINING IN PROGRESS</h2>
                            <p className="text-gray-400 font-mono">This neural network is currently offline for optimization.</p>
                            <div className="mt-8 px-4 py-2 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded font-mono text-sm animate-pulse">
                                ESTIMATED_UPTIME: TBD
                            </div>
                        </div>
                    )}

                    {/* Avatar / Identity Column */}
                    <div className={`md:col-span-4 lg:col-span-3 ${!isOnline ? 'blur-sm grayscale' : ''}`}>
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
                                    <span className="text-white">{agent.role}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span>FIELD</span>
                                    <span className="text-white">{agent.field}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span>PRICE</span>
                                    <span className="text-neon-purple">{agent.price}</span>
                                </div>
                            </div>

                            {/* Client Component for Hire Logic */}
                            <HireButton agent={agent} isHired={false} isOnline={isOnline} />
                        </div>
                    </div>

                    {/* Main Content Column */}
                    <div className={`md:col-span-8 lg:col-span-9 space-y-16 ${!isOnline ? 'blur-sm grayscale' : ''}`}>
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
                                    <span className="text-gray-400">
                                        {agent.specs.manifestation}
                                    </span>
                                </div>
                                <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                                    <h3 className="font-bold text-neon-cyan mb-3 font-mono text-sm uppercase">Specialization</h3>
                                    <span className="text-gray-400">
                                        {agent.specs.specialization}
                                    </span>
                                </div>
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
                                            <div key={thesis.id} className="block group">
                                                <div className="p-4 rounded-lg bg-engine-dark border border-white/5 transition-all">
                                                    <h5 className="font-bold text-sm mb-1 truncate text-gray-300">{thesis.title}</h5>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </header>
            </main>
        </div>
    );
}
