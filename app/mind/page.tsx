import { FileText, OrbitIcon, Users } from "lucide-react";
import Link from "next/link";
import { JobTracker } from "@/components/JobTracker/JobTracker";
import { getJobs } from "@/app/actions/job";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function TheMindPublicPage() {
    // Fetch active agents and public jobs using safe server-side queries
    const activeAgents = await prisma.agent.findMany({
        where: { isActive: true, isPublic: true },
        take: 3,
    });
    
    const services = await prisma.serviceGig.findMany({
        take: 3,
    });

    return (
        <div className="flex flex-col min-h-screen pt-24 pb-12 px-6 lg:px-12 bg-engine-background text-white">
            <div className="max-w-6xl mx-auto w-full">
                <div className="mb-12 border-b border-white/10 pb-8">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
                        The Mind
                    </h1>
                    <p className="text-xl text-gray-400 font-mono mb-6 max-w-2xl">
                        // THE_ARCHITECT
                    </p>
                    <p className="text-lg text-gray-300 max-w-3xl leading-relaxed">
                        The logical foundation of the Sphere. Here lies the orchestration of AI Agents, system architectures, and the services I provide as a Vibecode Specialist. This is where automation meets human intention.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                    {/* Services Section */}
                    <div className="bg-black/20 border border-white/10 rounded-2xl p-8 hover:border-hologram-blue/50 transition-colors">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-hologram-blue/20 p-3 rounded-xl border border-hologram-blue/30 text-hologram-blue">
                                <FileText size={24} />
                            </div>
                            <h2 className="text-2xl font-bold font-display">Services</h2>
                        </div>
                        <p className="text-gray-400 mb-6">
                            Specialized AI architectures, Web3 integration, and platform scaling built upon years of full-stack engineering.
                        </p>
                        {services.length > 0 ? (
                            <div className="space-y-4">
                                {services.map(s => (
                                    <div key={s.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                                        <h3 className="font-bold text-lg">{s.title}</h3>
                                        <p className="text-sm text-gray-400 mt-2">{s.description}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-gray-500 font-mono text-sm border border-dashed border-gray-700 p-6 rounded-lg text-center">
                                No active services listed yet.
                            </div>
                        )}
                        <Link href="/contact" className="inline-block mt-6 text-neon-cyan hover:text-white font-mono text-sm border-b border-neon-cyan/30 hover:border-white transition-colors">
                            REQUEST_DEPLOYMENT &rarr;
                        </Link>
                    </div>

                    {/* Agents Section */}
                    <div className="bg-black/20 border border-white/10 rounded-2xl p-8 hover:border-neon-purple/50 transition-colors">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-neon-purple/20 p-3 rounded-xl border border-neon-purple/30 text-neon-purple">
                                <Users size={24} />
                            </div>
                            <h2 className="text-2xl font-bold font-display">Agent Fleet</h2>
                        </div>
                        <p className="text-gray-400 mb-6">
                            The automated entities that maintain and expand the Hub. Fully integrated with n8n workflow systems.
                        </p>
                        {activeAgents.length > 0 ? (
                            <div className="space-y-4">
                                {activeAgents.map(a => (
                                    <div key={a.id} className="p-4 bg-white/5 rounded-lg border border-white/10 flex items-center gap-4">
                                        <div className="w-12 h-12 bg-neon-purple/20 rounded-full flex items-center justify-center border border-neon-purple/50 shrink-0 text-neon-purple">
                                            {a.avatar ? <img src={a.avatar} alt={a.name} className="w-full h-full object-cover rounded-full" /> : <OrbitIcon size={20} />}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white">{a.name}</h3>
                                            <span className="text-xs text-neon-purple font-mono uppercase border border-neon-purple/30 px-2 py-0.5 rounded-full">{a.role}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-gray-500 font-mono text-sm border border-dashed border-gray-700 p-6 rounded-lg text-center">
                                All agents are currently operating in stealth.
                            </div>
                        )}
                        <Link href="/fleet" className="inline-block mt-6 text-neon-purple hover:text-white font-mono text-sm border-b border-neon-purple/30 hover:border-white transition-colors">
                            VIEW_FULL_ROSTER &rarr;
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
