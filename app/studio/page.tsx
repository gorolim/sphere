
import NavBar from "@/components/NavBar";
import SystemHUD from "@/components/SystemHUD";
import { prisma } from "@/lib/db";
import { Film, Instagram, Linkedin, Twitter, Youtube, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { getCurrentUser } from "@/lib/user";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function StudioPage() {
    const user = await getCurrentUser();
    if (!user) redirect("/api/auth/signin");

    // In a real implementation, we would query posts with a specific category or tag.
    // For now, let's look for posts with category 'studio' or 'social'.
    // If not found, we show placeholders for the concept.

    const automations = await prisma.automation.findMany({ where: { isActive: true } });
    const activeAgentsCount = await prisma.agent.count({ where: { isActive: true } });
    const tokenUsage = await prisma.tokenUsage.aggregate({
        _sum: { totalTokens: true }
    });
    const totalTokens = tokenUsage._sum.totalTokens || 0;

    const hasActiveWorkflow = automations.length > 0;

    const studioPosts = await prisma.post.findMany({
        where: { category: { in: ["studio", "social"] } },
        orderBy: { createdAt: "desc" },
        take: 5
    });

    const mockPosts = studioPosts.length > 0 ? studioPosts : [];

    return (
        <div className="min-h-screen bg-engine-black text-white relative">
            <NavBar />
            <SystemHUD />

            <main className="pt-32 pb-12 max-w-7xl mx-auto px-4 relative z-10">
                <header className="mb-12 border-b border-white/10 pb-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 text-neon-cyan mb-2">
                                <Film size={18} />
                                <span className="font-mono text-xs tracking-widest uppercase">Content_Production_Matrix</span>
                            </div>
                            <h1 className="text-4xl font-display font-bold">Studio Dashboard</h1>
                            <p className="text-gray-400 font-mono mt-2">
                                Monitoring {activeAgentsCount} active neural agents.
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <div className="bg-white/5 border border-white/10 rounded-lg p-3 min-w-[120px]">
                                <div className="text-xs text-gray-400 font-mono uppercase mb-1">Total Tokens</div>
                                <div className="text-xl font-bold font-mono">{totalTokens.toLocaleString()}</div>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-lg p-3 min-w-[120px]">
                                <div className="text-xs text-gray-400 font-mono uppercase mb-1">Active Uplinks</div>
                                <div className="text-xl font-bold font-mono">{automations.length}</div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                        {automations.map((auto: any) => (
                            <div key={auto.id} className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-500 border border-green-500/20 rounded font-mono text-xs">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                N8N: {auto.triggerType}
                            </div>
                        ))}
                        {automations.length === 0 && (
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded font-mono text-xs">
                                <AlertCircle size={12} />
                                NO ACTIVE UPLINKS
                            </div>
                        )}
                    </div>
                </header>

                {/* Workflow Visualization */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <PlatformCard icon={<Youtube size={24} />} name="Long Form" agent="AGT-01" status="IDLE" />
                    <PlatformCard icon={<Instagram size={24} />} name="Visuals" agent="AGT-02" status="IDLE" />
                    <PlatformCard icon={<Film size={24} />} name="Shorts" agent="AGT-03" status="IDLE" />
                    <PlatformCard icon={<Twitter size={24} />} name="Microblog" agent="AGT-04" status="IDLE" />
                </div>

                {/* Content Board */}
                <div className="bg-engine-dark border border-white/10 rounded-xl overflow-hidden min-h-[400px]">
                    <div className="grid grid-cols-4 border-b border-white/10 bg-white/5 p-4 text-xs font-mono uppercase text-gray-400">
                        <div>Drafting (n8n)</div>
                        <div>Review Required</div>
                        <div>Approved</div>
                        <div>Published</div>
                    </div>

                    <div className="p-12 text-center text-gray-500 font-mono">
                        {mockPosts.length === 0 ? (
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                    <Clock size={24} className="text-gray-400" />
                                </div>
                                <p>Production queue empty.</p>
                                <p className="text-xs mt-2">Publish a news article to trigger the swarm.</p>
                            </div>
                        ) : (
                            <div>Content would appear here (Mock).</div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

function PlatformCard({ icon, name, agent, status }: { icon: any, name: string, agent: string, status: string }) {
    return (
        <div className="bg-black/40 border border-white/10 p-6 rounded-xl relative overflow-hidden group hover:border-neon-cyan/30 transition-colors">
            <div className="flex justify-between items-start mb-4">
                <div className="text-white bg-white/5 p-3 rounded-lg group-hover:bg-neon-cyan/20 group-hover:text-neon-cyan transition-colors">
                    {icon}
                </div>
                <div className="text-[10px] font-mono bg-white/5 px-2 py-1 rounded text-gray-400">
                    {agent}
                </div>
            </div>
            <h3 className="font-bold text-white mb-1">{name}</h3>
            <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
                <div className={`w-1.5 h-1.5 rounded-full ${status === 'ACTIVE' ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`}></div>
                {status}
            </div>
        </div>
    );
}
