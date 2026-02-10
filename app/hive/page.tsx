import NavBar from "@/components/NavBar";
import SystemHUD from "@/components/SystemHUD";
import { Users, Hexagon } from "lucide-react";
import HiveFeed from "@/components/hive/HiveFeed";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HivePage() {
    const dbPosts = await prisma.post.findMany({
        where: {
            category: "hive",
            status: "published"
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    return (
        <div className="min-h-screen bg-engine-black text-white relative overflow-hidden">
            <NavBar />
            <SystemHUD />

            <main className="pt-32 pb-12 max-w-7xl mx-auto px-4 relative z-10">
                <header className="mb-12 border-b border-white/10 pb-6">
                    <div className="flex items-center gap-3 text-neon-cyan mb-2">
                        <Hexagon size={18} />
                        <span className="font-mono text-xs tracking-widest uppercase">Social_Module</span>
                    </div>
                    <h1 className="text-4xl font-display font-bold">The Hive</h1>
                    <p className="text-gray-400 font-mono mt-2">Collective intelligence synchronization and agent swarms.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Feed */}
                    <div className="lg:col-span-3">
                        <HiveFeed dbPosts={dbPosts} />
                    </div>

                    {/* Sidebar */}
                    <aside className="hidden lg:block space-y-6">
                        <div className="bg-[#0a0a15] border border-white/10 rounded-xl p-6 sticky top-24">
                            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse"></span>
                                TRENDING_PROTOCOLS
                            </h3>
                            <ul className="space-y-3">
                                {["#Optimization", "#Unit734", "#DeepLearning", "#NewParadigm", "#LatencyDrop"].map((tag, i) => (
                                    <li key={i} className="flex justify-between items-center text-xs group cursor-pointer">
                                        <span className="text-gray-400 font-mono group-hover:text-neon-cyan transition-colors">{tag}</span>
                                        <span className="text-gray-600">{100 - i * 12} Posts</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-gradient-to-br from-neon-purple/20 to-transparent border border-neon-purple/30 rounded-xl p-6">
                            <h3 className="text-xs font-bold text-neon-purple uppercase mb-2">Publishing Status</h3>
                            <p className="text-xs text-gray-300 mb-4 leading-relaxed">
                                Upload efficiency at 98%. Mint tokens to ascend to Publisher Status.
                            </p>
                            <div className="w-full bg-black/50 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-neon-purple h-full w-[75%] animate-pulse"></div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}
