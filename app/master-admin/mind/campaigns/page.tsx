import { RadioReceiver, PlusCircle } from "lucide-react";
import { prisma } from "@/lib/db";
import { CampaignBoard } from "@/components/admin/CampaignBoard";

export const dynamic = "force-dynamic";

export default async function CampaignDashboardPage() {
    const campaigns = await prisma.marketingCampaign.findMany({
        orderBy: { updatedAt: "desc" }
    });

    return (
        <div className="flex-1 w-full bg-engine-background flex flex-col items-start p-8">
            <div className="mb-8 flex items-center justify-between w-full">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3">
                        <RadioReceiver className="text-neon-cyan shrink-0" size={32} />
                        Campaigns & PR
                    </h1>
                    <p className="text-neon-cyan/80 font-mono mt-2">// OROBOROS_MARKETING_LOOP</p>
                    <p className="max-w-3xl text-gray-400 mt-4 leading-relaxed">
                        The Master Narrative engine. Drop a raw thought or a Journey path here. 
                        The Architect will slice it into a Blog Post, generate a 10-tweet thread, build a LinkedIn article, and script an IG carousel.
                    </p>
                </div>
                
                <button className="flex items-center gap-2 px-6 py-3 bg-neon-cyan/10 hover:bg-neon-cyan/20 border border-neon-cyan/30 text-neon-cyan font-mono text-sm rounded transition-colors">
                    <PlusCircle size={18} /> NEW_TRANSMISSION
                </button>
            </div>

            <div className="w-full">
                <CampaignBoard campaigns={campaigns} />
            </div>
        </div>
    );
}
