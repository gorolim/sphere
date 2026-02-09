"use client";

import NavBar from "@/components/NavBar";
import { CREATOR_AGENTS } from "@/lib/creators";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Video, Film, Users, Zap, CheckCircle, Share2, DollarSign } from "lucide-react";

export default function CreatorProfilePage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    const decodedId = decodeURIComponent(id);
    const agent = CREATOR_AGENTS.find(a => a.id === decodedId);

    if (!agent) return <div className="p-20 text-center text-white">AGENT_NOT_FOUND</div>;

    const handleBook = () => {
        router.push(`/admin/studio?agentId=${agent.id}`);
    };

    return (
        <div className="min-h-screen bg-engine-black text-white font-sans selection:bg-yellow-500 selection:text-black">
            <NavBar />

            <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
                <Link href="/creators" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white mb-8 transition-colors">
                    <ArrowLeft size={16} /> BACK_TO_CREATORS
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left: Info & Booking */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Profile Card */}
                        <div className="bg-engine-dark border border-white/10 rounded-2xl p-8 sticky top-24">
                            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-6 mx-auto border border-white/10">
                                <Video size={32} className="text-gray-500" />
                            </div>

                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-display font-bold mb-1">{agent.name}</h1>
                                <div className="text-yellow-500 font-mono text-sm">{agent.handle}</div>
                            </div>

                            <div className="space-y-4 font-mono text-xs text-gray-400 mb-8">
                                <div className="flex justify-between py-2 border-b border-white/5">
                                    <span>NICHE</span>
                                    <span className="text-white">{agent.niche}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-white/5">
                                    <span>VIBE</span>
                                    <span className="text-white">{agent.vibe}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-white/5">
                                    <span>FOLLOWERS</span>
                                    <span className="text-white">{agent.followers}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-white/5">
                                    <span>RATE</span>
                                    <span className="text-yellow-500 font-bold">{agent.price}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleBook}
                                className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-4 rounded-xl font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(234,179,8,0.2)] flex items-center justify-center gap-2"
                            >
                                <Zap size={18} className="fill-black" /> Book for Video
                            </button>
                        </div>
                    </div>

                    {/* Right: Portfolio & Stats */}
                    <div className="lg:col-span-8">
                        <section className="mb-12">
                            <h2 className="text-xl font-mono text-gray-500 uppercase mb-6 tracking-widest flex items-center gap-2">
                                <Film size={16} /> Agent_Bio
                            </h2>
                            <p className="text-xl text-gray-200 leading-relaxed max-w-2xl">
                                {agent.bio}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-mono text-gray-500 uppercase mb-6 tracking-widest flex items-center gap-2">
                                <Video size={16} /> Recent_Productions
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="aspect-video bg-[#0a0a15] rounded-xl border border-white/10 flex items-center justify-center relative group cursor-pointer overflow-hidden">
                                        <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors z-10" />
                                        <Video size={48} className="text-white/20 group-hover:text-yellow-500 transition-colors relative z-20" />
                                        <div className="absolute bottom-4 left-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="text-sm font-bold text-white">Campaign_Ref_{i}0{i}</div>
                                            <div className="text-[10px] font-mono text-gray-400">VEO_ENGINE_RENDER</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
