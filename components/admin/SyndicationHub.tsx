"use client";

import { useState } from "react";
import { Sparkles, ShoppingBag, Palette, Shirt, UploadCloud, CheckCircle2, Loader2, Package } from "lucide-react";
import { MarketplaceArt } from "@prisma/client";

interface SyndicationHubProps {
    artworks: MarketplaceArt[];
}

export function SyndicationHub({ artworks }: SyndicationHubProps) {
    const [isDeploying, setIsDeploying] = useState<string | null>(null);

    const handleSyndicate = async (artworkId: string, platforms: string[]) => {
        setIsDeploying(artworkId);

        try {
            await fetch("/api/webhooks/syndicate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ artworkId, platforms })
            });

            // Simulate the delay for UI feedback
            await new Promise(resolve => setTimeout(resolve, 1500));
            
        } catch (error) {
            console.error("Syndication failed", error);
        } finally {
            setIsDeploying(null);
            // In a real app, you'd want to refresh the Server Action data here
        }
    };

    return (
        <div className="w-full bg-engine-background border border-yellow-500/20 rounded-xl p-6 mt-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-lg bg-yellow-500/10 text-yellow-500">
                    <UploadCloud size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-display font-bold text-white uppercase tracking-widest">
                        The Omnipresence Engine
                    </h2>
                    <p className="text-sm font-mono text-gray-500 uppercase">
                        Marketplace Syndication Hub
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {artworks.map((art) => (
                    <div key={art.id} className="bg-black/40 border border-white/10 hover:border-white/20 transition-colors rounded-xl overflow-hidden group flex flex-col">
                        <div className="h-40 bg-zinc-900 border-b border-white/10 relative overflow-hidden flex items-center justify-center">
                            {art.imageUrl ? (
                                <img src={art.imageUrl} alt={art.title || 'Artwork'} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                            ) : (
                                <Package size={40} className="text-gray-600" />
                            )}
                            <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-xs font-mono text-gray-300 backdrop-blur-sm">
                                {art.price ? `$${art.price}` : 'TBD'}
                            </div>
                        </div>

                        <div className="p-4 flex-1 flex flex-col">
                            <h3 className="font-bold text-white text-lg truncate mb-1">{art.title || "Untitled Vision"}</h3>
                            <p className="text-xs text-gray-500 font-mono mb-4 line-clamp-2">{art.description || art.rawVision}</p>

                            <div className="mt-auto space-y-3">
                                <div className="text-xs font-mono text-gray-400 mb-2 border-b border-white/5 pb-1">SYNDICATION TARGETS:</div>
                                
                                {/* Gumroad Toggle/Status */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm text-gray-300">
                                        <ShoppingBag size={14} className="text-pink-500" /> Gumroad
                                    </div>
                                    {art.gumroadId ? (
                                        <span className="text-xs text-green-500 flex items-center gap-1"><CheckCircle2 size={12}/> LIVE</span>
                                    ) : (
                                        <button 
                                            onClick={() => handleSyndicate(art.id, ['gumroad'])}
                                            disabled={isDeploying === art.id}
                                            className="text-xs font-mono text-yellow-500 hover:text-white transition-colors"
                                        >
                                            [ DEPLOY ]
                                        </button>
                                    )}
                                </div>

                                {/* OpenSea Toggle/Status */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm text-gray-300">
                                        <Palette size={14} className="text-blue-500" /> OpenSea (NFT)
                                    </div>
                                    {art.openSeaUrl ? (
                                        <span className="text-xs text-green-500 flex items-center gap-1"><CheckCircle2 size={12}/> LIVE</span>
                                    ) : (
                                        <button 
                                            onClick={() => handleSyndicate(art.id, ['opensea'])}
                                            disabled={isDeploying === art.id}
                                            className="text-xs font-mono text-yellow-500 hover:text-white transition-colors"
                                        >
                                            [ DEPLOY ]
                                        </button>
                                    )}
                                </div>

                                {/* Printful Toggle/Status */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm text-gray-300">
                                        <Shirt size={14} className="text-red-500" /> Printful (Merch)
                                    </div>
                                    {art.printfulSyncStatus === "SYNCED" ? (
                                        <span className="text-xs text-green-500 flex items-center gap-1"><CheckCircle2 size={12}/> LIVE</span>
                                    ) : (
                                        <button 
                                            onClick={() => handleSyndicate(art.id, ['printful'])}
                                            disabled={isDeploying === art.id}
                                            className="text-xs font-mono text-yellow-500 hover:text-white transition-colors"
                                        >
                                            [ DEPLOY ]
                                        </button>
                                    )}
                                </div>

                                {/* Master Deploy Button */}
                                {(!art.gumroadId || !art.openSeaUrl || art.printfulSyncStatus !== "SYNCED") && (
                                    <button 
                                        onClick={() => handleSyndicate(art.id, ['gumroad', 'opensea', 'printful'])}
                                        disabled={isDeploying === art.id}
                                        className="w-full mt-4 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 rounded text-xs font-mono transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {isDeploying === art.id ? <><Loader2 size={14} className="animate-spin" /> SYNDICATING...</> : <><Sparkles size={14} /> DEPLOY ALL</>}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {artworks.length === 0 && (
                    <div className="col-span-full py-12 text-center text-gray-500 font-mono border border-dashed border-white/10 rounded-xl">
                        No artifacts currently held in the Spirit vault.
                    </div>
                )}
            </div>
        </div>
    );
}
