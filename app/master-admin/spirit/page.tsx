import { Sparkles, UploadCloud } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { SyndicationHub } from "@/components/admin/SyndicationHub";

export const dynamic = "force-dynamic";

export default async function MasterAdminSpiritPage() {
    const artworks = await prisma.marketplaceArt.findMany({
        orderBy: { updatedAt: "desc" }
    });
    return (
        <div className="flex-1 w-full bg-engine-background flex flex-col items-start p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3">
                    <Sparkles className="text-yellow-500 shrink-0" size={32} />
                    The Spirit
                </h1>
                <p className="text-gray-400 font-mono mt-2">// THE_TECHNO_SHAMAN_MARKETPLACE</p>
                <p className="max-w-3xl text-gray-400 mt-4 leading-relaxed">
                    This defines your artistry, Ikigai, and connection to the energetic realms. 
                    Upload raw images or visions here, and let the AI Agents generate the lore, price it, and sync it to the Pathfinders marketplace.
                </p>
            </div>

            {/* Placeholder for rapid upload block */}
            <div className="w-full max-w-2xl mb-8">
                <div className="border-2 border-dashed border-white/20 hover:border-yellow-500/50 transition-colors rounded-2xl p-12 text-center bg-black/20 cursor-pointer">
                    <UploadCloud className="mx-auto text-gray-400 mb-4" size={48} />
                    <h3 className="text-lg font-bold text-white">Upload Raw Vision</h3>
                    <p className="text-gray-500 text-sm mt-2">
                        Drop an image or paste your raw notes. Our agents will generate a MarketplaceArt draft.
                    </p>
                </div>
            </div>

            {/* The Syndication Engine */}
            <div className="w-full max-w-6xl">
                <SyndicationHub artworks={artworks} />
            </div>
        </div>
    );
}
