import { Pickaxe, Hexagon } from "lucide-react";
import { prisma } from "@/lib/db";
import { WorldBuilderForm } from "@/components/admin/WorldBuilderForm";

export const dynamic = "force-dynamic";

export default async function WorldBuilderPage() {
    const badges = await prisma.badge.findMany({
        orderBy: { createdAt: "desc" }
    });

    return (
        <div className="flex-1 w-full bg-engine-background flex flex-col items-start p-8">
            <div className="mb-8 flex items-center justify-between w-full">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3">
                        <Pickaxe className="text-neon-purple shrink-0" size={32} />
                        World Builder
                    </h1>
                    <p className="text-neon-purple/80 font-mono mt-2">// MOLTGAME_ENVIRONMENT_ENGINE</p>
                    <p className="max-w-3xl text-gray-400 mt-4 leading-relaxed">
                        The Gamification layer. Mint Digital Stickers, Achievements, and Artifacts here. 
                        As users explore your Chronicles or purchase your Art, the system will automatically 
                        award these items to their personal vaults, turning the platform into an RPG experience.
                    </p>
                </div>
            </div>

            {/* Agent Health / Moltgame Status Overview widget could go here in the future */}
            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                 <div className="bg-black/40 border border-white/10 rounded-xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Hexagon size={64} className="text-neon-purple" />
                    </div>
                    <p className="text-sm font-mono text-gray-400 uppercase tracking-widest mb-2">Total Artifacts</p>
                    <h2 className="text-4xl font-display font-bold text-white mb-2">
                        {badges.length}
                    </h2>
                    <p className="text-xs text-neon-purple font-mono">AVAILABLE FOR DISTRO</p>
                </div>
            </div>

            <div className="w-full max-w-6xl">
                <WorldBuilderForm badges={badges} />
            </div>
        </div>
    );
}
