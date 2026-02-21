import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import NavBar from "@/components/NavBar";
import SystemHUD from "@/components/SystemHUD";
import { Cpu, Terminal, Users, Search, Play, FileText, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PublicProfilePage({ params }: { params: { username: string } }) {
    const user = await prisma.user.findUnique({
        where: { username: params.username.toLowerCase() },
        include: {
            artworks: {
                where: { status: "PUBLISHED" },
                orderBy: { createdAt: "desc" }
            },
            services: {
                orderBy: { createdAt: "desc" }
            }
        }
    });

    if (!user) {
        return notFound();
    }

    const { socialHandles } = user as any;

    return (
        <div className="min-h-screen bg-engine-black text-white relative">
            <NavBar />
            <SystemHUD />

            <main className="pt-32 pb-24 max-w-7xl mx-auto px-4 relative z-10">
                
                {/* Header Sequence */}
                <div className="flex flex-col md:flex-row items-start gap-8 mb-16">
                    <div className="w-48 h-48 rounded-2xl bg-black border border-white/10 relative overflow-hidden group shadow-[0_0_30px_rgba(0,243,255,0.1)]">
                        {/* Placeholder for Nova / Face */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/40 to-purple-900/40 opacity-50"></div>
                        <div className="absolute inset-0 flex items-center justify-center font-mono text-neon-cyan opacity-50 group-hover:opacity-100 transition-opacity">
                            <Cpu size={48} />
                        </div>
                    </div>
                    
                    <div className="flex-1">
                        <div className="flex items-center gap-3 text-neon-cyan mb-2">
                            <Terminal size={16} />
                            <span className="font-mono text-xs tracking-widest uppercase">Verified_Operative</span>
                            <span className="bg-neon-cyan/20 text-neon-cyan px-2 py-0.5 rounded text-[10px] font-mono"><CheckCircle2 size={10} className="inline mr-1"/>LEVEL: {user.onboardingScore}</span>
                        </div>
                        <h1 className="text-5xl font-display font-bold mb-2 uppercase tracking-wide">
                            {user.name || `@${user.username}`}
                        </h1>
                        <p className="text-xl text-gray-400 font-mono mb-6 flex items-center gap-4">
                            <span>@{user.username}</span>
                            {socialHandles?.twitter && (
                                <a href={socialHandles.twitter} target="_blank" className="hover:text-neon-cyan transition-colors">Twitter (X)</a>
                            )}
                            {socialHandles?.linkedin && (
                                <a href={socialHandles.linkedin} target="_blank" className="hover:text-neon-cyan transition-colors">LinkedIn</a>
                            )}
                        </p>

                        <div className="flex flex-wrap gap-3">
                            <button className="bg-white text-black px-6 py-2 rounded font-bold hover:bg-gray-200 transition-colors flex items-center gap-2">
                                <Play size={16} fill="currentColor"/> INITIATE_COMMS
                            </button>
                            <button className="bg-transparent border border-white/20 px-6 py-2 rounded font-mono hover:bg-white/5 transition-colors">
                                EXPLORE_DATABASE
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* Left Column: AI About and History */}
                    <div className="md:col-span-2 space-y-8">
                        <section className="bg-engine-dark border border-white/10 rounded-xl p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-neon-cyan/5 rounded-full blur-3xl"></div>
                            <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
                                <Search className="text-neon-cyan"/> The Lore
                            </h2>
                            <div className="prose prose-invert max-w-none text-gray-300">
                                {user.aiAboutMe ? (
                                    <div dangerouslySetInnerHTML={{ __html: user.aiAboutMe.replace(/\n/g, '<br/>') }} />
                                ) : (
                                    <p className="font-mono text-gray-500 italic">[NOVA_PROCESSING_ABOUT_DATA...]</p>
                                )}
                            </div>
                        </section>

                        <section className="bg-engine-dark border border-white/10 rounded-xl p-8 relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-64 h-64 bg-neon-purple/5 rounded-full blur-3xl"></div>
                            <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
                                <FileText className="text-neon-purple"/> The Mission Log
                            </h2>
                            <div className="prose prose-invert max-w-none text-gray-300">
                                {user.aiPortfolio ? (
                                    <div dangerouslySetInnerHTML={{ __html: user.aiPortfolio.replace(/\n/g, '<br/>') }} />
                                ) : (
                                    <p className="font-mono text-gray-500 italic">[NOVA_ARCHITECTING_PORTFOLIO...]</p>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Marketplace & Services */}
                    <div className="space-y-8">
                        <section className="bg-black/30 border border-white/10 rounded-xl p-6">
                            <h3 className="font-bold text-gray-400 font-mono text-sm tracking-widest uppercase border-b border-white/10 pb-3 mb-4 flex items-center gap-2">
                                <Users size={16}/> Deployed Services (Mind)
                            </h3>
                            <div className="space-y-4">
                                {user.services.length > 0 ? (
                                    user.services.map((svc) => (
                                        <div key={svc.id} className="p-3 border border-white/5 bg-white/5 rounded-lg hover:border-neon-cyan/50 cursor-pointer transition-colors group">
                                            <h4 className="font-bold text-white group-hover:text-neon-cyan">{svc.title}</h4>
                                            {svc.price && <p className="text-neon-cyan text-sm font-mono mt-1">${svc.price.toFixed(2)}</p>}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-600 font-mono text-xs text-center py-4">NO_GIGS_FOUND</p>
                                )}
                            </div>
                        </section>

                        <section className="bg-black/30 border border-white/10 rounded-xl p-6">
                            <h3 className="font-bold text-gray-400 font-mono text-sm tracking-widest uppercase border-b border-white/10 pb-3 mb-4">
                                Artifacts (Spirit)
                            </h3>
                            <div className="space-y-4">
                                {user.artworks.length > 0 ? (
                                    user.artworks.map((art) => (
                                        <div key={art.id} className="p-3 border border-white/5 bg-white/5 rounded-lg hover:border-neon-purple/50 cursor-pointer transition-colors group">
                                            <h4 className="font-bold text-white group-hover:text-neon-purple">{art.title || "Untitled Artifact"}</h4>
                                            {art.price && <p className="text-neon-purple text-sm font-mono mt-1">${art.price.toFixed(2)}</p>}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-600 font-mono text-xs text-center py-4">NO_ARTIFACTS_MINTED</p>
                                )}
                            </div>
                        </section>
                    </div>

                </div>
            </main>
        </div>
    );
}
