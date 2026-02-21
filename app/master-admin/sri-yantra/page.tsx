import { CircleDollarSign, BarChart3, CloudSnow, Globe, Package, Zap } from "lucide-react";
import { prisma } from "@/lib/db";
import { SyncStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function SriYantraPage() {
    // 1. Fetch data from The Spirit (Marketplace)
    const artworks = await prisma.marketplaceArt.findMany({
        orderBy: { updatedAt: "desc" }
    });

    // 2. Fetch data from The Mind (Services)
    const gigs = await prisma.serviceGig.findMany({
        orderBy: { updatedAt: "desc" }
    });

    // Mock Analytics Data (Manifested Abundance)
    const mockRevenue = {
        total: 14500,
        thisMonth: 2300,
        pending: 450,
        currency: "USD"
    };

    return (
        <div className="flex-1 w-full bg-engine-background flex flex-col items-start p-8">
            <div className="mb-8 flex items-center justify-between w-full">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3">
                        <CircleDollarSign className="text-yellow-400 shrink-0" size={32} />
                        The Sri Yantra
                    </h1>
                    <p className="text-yellow-500/80 font-mono mt-2">// ABUNDANCE_MANIFESTATION_ENGINE</p>
                    <p className="max-w-3xl text-gray-400 mt-4 leading-relaxed">
                        The financial command center. This protocol aggregates potential and realized revenue streams from both The Spirit (Pathfinders Art) and The Mind (Service Gigs), tracking syndication to external commercial nodes.
                    </p>
                </div>
            </div>

            {/* Financial HUD */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mb-12">
                <div className="bg-black/40 border border-yellow-500/20 rounded-xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <BarChart3 size={64} className="text-yellow-500" />
                    </div>
                    <p className="text-sm font-mono text-gray-400 uppercase tracking-widest mb-2">Total Manifested</p>
                    <h2 className="text-4xl font-display font-bold text-white mb-2">
                        ${mockRevenue.total.toLocaleString()}
                    </h2>
                    <p className="text-xs text-green-400 font-mono">+12.5% vs Last Cycle</p>
                </div>

                <div className="bg-black/40 border border-white/10 rounded-xl p-6">
                    <p className="text-sm font-mono text-gray-400 uppercase tracking-widest mb-2">Current Cycle (30d)</p>
                    <h2 className="text-3xl font-display font-bold text-white mb-2">
                        ${mockRevenue.thisMonth.toLocaleString()}
                    </h2>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden mt-4">
                        <div className="bg-yellow-500 h-full w-[65%]"></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-right">65% of Target</p>
                </div>

                <div className="bg-black/40 border border-white/10 rounded-xl p-6">
                    <p className="text-sm font-mono text-gray-400 uppercase tracking-widest mb-2">Pending Escrow</p>
                    <h2 className="text-3xl font-display font-bold text-gray-300 mb-2">
                        ${mockRevenue.pending.toLocaleString()}
                    </h2>
                    <p className="text-xs text-yellow-500/60 font-mono flex items-center gap-1">
                        <Zap size={10} /> AWAITING_LEDGER_CONFIRMATION
                    </p>
                </div>
            </div>

            {/* Aggregated Listings */}
            <div className="w-full max-w-6xl">
                <h3 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2">
                    <CloudSnow className="text-hologram-blue" size={20} /> Syndication Status
                </h3>
                
                <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10 text-xs font-mono text-gray-400 uppercase tracking-wider">
                                <th className="p-4">Entity</th>
                                <th className="p-4">Domain</th>
                                <th className="p-4">Pricing</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {/* Render Artworks */}
                            {artworks.map(art => (
                                <tr key={art.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded bg-yellow-500/20 flex items-center justify-center border border-yellow-500/30 text-yellow-500 shrink-0">
                                                <Package size={20} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-white">{art.title || "Untitled Vision"}</p>
                                                <p className="text-xs text-gray-500 font-mono truncate max-w-[200px]">{art.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded text-xs font-mono">
                                            SPIRIT / ART
                                        </span>
                                    </td>
                                    <td className="p-4 font-mono text-sm text-gray-300">
                                        {art.price ? `${art.price} ${art.currency}` : "TBD"}
                                    </td>
                                    <td className="p-4">
                                        <SyncStatusBadge status={art.syncStatus} />
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="text-xs font-mono text-hologram-blue hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                                            [ FORCE_SYNC ]
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {/* Render Gigs */}
                            {gigs.map(gig => (
                                <tr key={gig.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded bg-neon-purple/20 flex items-center justify-center border border-neon-purple/30 text-neon-purple shrink-0">
                                                <Globe size={20} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-white">{gig.title}</p>
                                                <p className="text-xs text-gray-500 font-mono truncate max-w-[200px]">{gig.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-neon-purple/10 text-neon-purple border border-neon-purple/20 rounded text-xs font-mono">
                                            MIND / SERVICE
                                        </span>
                                    </td>
                                    <td className="p-4 font-mono text-sm text-gray-300">
                                        {gig.price ? `${gig.price} USD` : "CUSTOM"}
                                    </td>
                                    <td className="p-4">
                                        {/* Services implicitly sync via form applications, but we can visualize them as active syncs */}
                                        <SyncStatusBadge status={"SYNCED"} />
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="text-xs font-mono text-neon-purple hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                                            [ EDIT_GIG ]
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {artworks.length === 0 && gigs.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500 font-mono border-dashed border-t border-white/10">
                                        No active assets ready for manifestation.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// Helper badge component for sync status UI
function SyncStatusBadge({ status }: { status: SyncStatus | string }) {
    if (status === "SYNCED") {
        return <span className="text-xs font-mono text-green-400 flex items-center gap-1"><div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div> LIVE</span>
    }
    if (status === "PENDING") {
        return <span className="text-xs font-mono text-yellow-500 flex items-center gap-1"><div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></div> QUEUED</span>
    }
    return <span className="text-xs font-mono text-red-500 flex items-center gap-1"><div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div> FAILED</span>
}
