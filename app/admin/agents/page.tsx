
import { prisma } from "@/lib/db";
import AgentCard from "@/components/admin/AgentCard";
import { Bot, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AgentsFleetPage() {
    const agents = await prisma.agent.findMany({
        orderBy: { name: 'asc' }
    });

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">Agent Fleet Command</h1>
                    <p className="text-gray-400">Monitor and configure deployed autonomous units.</p>
                </div>
                <button className="flex items-center gap-2 bg-neon-purple text-white px-4 py-2 rounded-lg font-bold hover:bg-neon-purple/80 transition-colors shadow-lg shadow-neon-purple/20">
                    <Plus size={18} /> Deploy Unit
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {agents.map((agent) => (
                    <AgentCard key={agent.id} agent={agent} />
                ))}

                {/* Deploy New Placeholder */}
                <div className="bg-gradient-to-br from-white/5 to-transparent border border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-all cursor-pointer min-h-[280px] group">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-gray-500 group-hover:text-white transition-colors">
                        <Plus size={32} />
                    </div>
                    <h3 className="font-bold text-gray-400 group-hover:text-white">Initialize New Core</h3>
                </div>
            </div>
        </div>
    );
}
