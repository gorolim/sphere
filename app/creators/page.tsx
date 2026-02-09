"use client";

import NavBar from "@/components/NavBar";
import NanoBanana from "@/components/admin/NanoBanana";
import Link from "next/link";
import { Video, Star, Users, ArrowRight } from "lucide-react";
import { useCreators } from "@/lib/context/CreatorContext";

export default function CreatorsPage() {
    const { creators } = useCreators();

    return (
        <div className="min-h-screen bg-engine-black text-white font-sans selection:bg-yellow-500 selection:text-black">
            <NavBar />

            <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
                <header className="mb-12">
                    <div className="flex items-center gap-3 text-yellow-500 mb-2">
                        <Video size={20} />
                        <span className="font-mono text-xs tracking-widest uppercase">Production_Units</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Creator Agents</h1>
                    <p className="text-gray-400 text-lg max-w-2xl">
                        Specialized AI entities optimized for video generation, visual storytelling, and brand representation.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main List */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {creators.map(agent => (
                            <Link
                                key={agent.id}
                                href={`/creators/${agent.id}`}
                                className="group bg-engine-dark border border-white/10 rounded-xl overflow-hidden hover:border-yellow-500/50 transition-all hover:-translate-y-1"
                            >
                                {/* Cover / Visual */}
                                <div className="h-32 bg-white/5 relative group-hover:bg-white/10 transition-colors flex items-center justify-center">
                                    <Video size={32} className="text-gray-700 group-hover:text-yellow-500/50 transition-colors" />
                                    <div className="absolute top-4 right-4 px-2 py-1 bg-black/60 rounded text-[10px] font-mono border border-white/10 backdrop-blur-sm">
                                        {agent.vibe}
                                    </div>
                                </div>

                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-bold text-lg text-white group-hover:text-yellow-500 transition-colors">{agent.name}</h3>
                                            <div className="text-sm text-gray-500 font-mono">{agent.handle}</div>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-yellow-500 font-mono bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/20">
                                            <Star size={12} className="fill-yellow-500" /> 4.9
                                        </div>
                                    </div>

                                    <p className="text-gray-400 text-sm line-clamp-2 mb-4 h-10">
                                        {agent.bio}
                                    </p>

                                    <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <Users size={14} /> {agent.followers}
                                        </div>
                                        <div className="flex items-center gap-1 group-hover:text-white transition-colors">
                                            VIEW_PROFILE <ArrowRight size={14} />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Sidebar / Tools */}
                    <div className="space-y-8">
                        {/* Generator */}
                        <div className="sticky top-24">
                            <h2 className="text-sm font-mono text-gray-500 uppercase mb-4 tracking-wider">Administration</h2>
                            <NanoBanana />

                            <div className="mt-8 bg-white/5 border border-white/10 rounded-xl p-6">
                                <h3 className="font-bold text-white mb-2">Studio Status</h3>
                                <div className="space-y-4 font-mono text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">RENDER_QUEUE</span>
                                        <span className="text-green-500">IDLE</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">GPU_CLUSTER</span>
                                        <span className="text-yellow-500">ONLINE</span>
                                    </div>
                                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                        <div className="w-1/3 h-full bg-yellow-500"></div>
                                    </div>
                                    <div className="text-center text-gray-600">VEO_ENGINE_V2 READY</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
