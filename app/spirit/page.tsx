import { Sparkles, Palette } from "lucide-react";
import { prisma } from "@/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function TheSpiritPublicPage() {
    // Fetch published marketplace art
    const artworks = await prisma.marketplaceArt.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="flex flex-col min-h-screen pt-24 pb-12 px-6 lg:px-12 bg-engine-background text-white">
            <div className="max-w-6xl mx-auto w-full">
                <div className="mb-12 border-b border-white/10 pb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
                            The Spirit
                        </h1>
                        <p className="text-xl text-yellow-500 font-mono mb-6 max-w-2xl">
                            // THE_TECHNO_SHAMAN
                        </p>
                        <p className="text-lg text-gray-300 max-w-3xl leading-relaxed">
                            The soul of the Sphere. Visual manifestations of Ikigai, art, and meaning. These creations are conceived by the human spirit and curated by AI into the Pathfinders Marketplace.
                        </p>
                    </div>
                    <Sparkles size={64} className="text-yellow-500/20" />
                </div>

                <div className="space-y-6">
                    <h2 className="text-2xl font-bold font-display flex items-center gap-2 mb-8">
                        <Palette className="text-yellow-500" /> Pathfinders Gallery
                    </h2>
                    
                    {artworks.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                            {artworks.map((art) => (
                                <div key={art.id} className="bg-black/40 border border-white/10 rounded-xl overflow-hidden hover:border-yellow-500/50 transition-colors backdrop-blur-md group">
                                    <div className="h-64 w-full bg-black/80 relative overflow-hidden">
                                        {/* Fallback image wrapper */}
                                        <img src={art.imageUrl} alt={art.title || "Artwork"} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-105 duration-500" />
                                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono border border-white/20">
                                            {art.price ? `${art.price} ${art.currency}` : "NOT FOR SALE"}
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-white mb-2">{art.title || "Untitled Vision"}</h3>
                                        <p className="text-gray-400 text-sm mb-6 line-clamp-3">
                                            {art.description || art.rawVision}
                                        </p>
                                        <button className="w-full py-2 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500 hover:text-black border border-yellow-500/20 font-mono text-sm rounded transition-all">
                                            ACQUIRE_ARTIFACT
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="border border-dashed border-white/10 p-16 text-center rounded-xl bg-black/20 text-gray-400 font-mono">
                            <Sparkles className="mx-auto mb-4 text-gray-600" size={32} />
                            The Shaman is currently in meditation.<br/>
                            No available artifacts found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
