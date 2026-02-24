import NavBar from "@/components/NavBar";
import { SPHERE_AGENTS } from "@/lib/brain";
import Link from "next/link";
import { Shield, AlertTriangle } from "lucide-react";
import { getCurrentUser } from "@/lib/user";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function FleetPage() {
    let user = null;
    try {
        user = await getCurrentUser();
    } catch (e) {
        console.error("Fleet page user fetch error:", e);
    }

    if (!user) {
        // Handle case where user exists in Clerk but not DB (webhook lag?) or not logged in
        // The previous logic for `clerkUser` and `WAITING_FOR_SYNC` is replaced.
        // If user is null here, it means they are not logged in or their profile isn't synced.
        // The new UI directs them to sign up.
        return (
            <div className="min-h-screen bg-engine-black text-white flex flex-col items-center justify-center font-mono p-6 text-center">
                <div className="text-center w-full max-w-md flex flex-col items-center">
                    <h2 className="text-2xl font-bold mb-4 font-display">Unregistered Signal</h2>
                    <p className="mb-6 opacity-70">Your identity was not found in the global registry. Please mint your profile to access the fleet.</p>
                    <Link href="/sign-up" className="bg-neon-cyan text-black px-6 py-2 rounded font-bold hover:bg-neon-cyan/80 transition-colors">
                        MINT IDENTITY
                    </Link>
                </div>
            </div>
        );
    }

    // Connect user agents logic would go here. For now viewing all agents.
    let dbAgents: any[] = [];
    try {
        dbAgents = await prisma.agent.findMany();
    } catch (error) {
        console.error("Fleet Page Agent Fetch Error:", error);
        // Fallback or empty array so page doesn't crash
        dbAgents = [];
    }

    const displayedAgents = SPHERE_AGENTS;

    return (
        <div className="min-h-screen bg-engine-black text-white selection:bg-neon-cyan selection:text-black">
            <NavBar />

            <main className="pt-24 px-6 max-w-7xl mx-auto">
                <div className="border-b border-white/10 pb-6 mb-12">
                    <h1 className="text-4xl font-display font-bold mb-2 flex items-center gap-3">
                        <Shield className="text-neon-cyan" size={32} />
                        COMMAND_CENTER // FLEET
                    </h1>
                    <p className="text-gray-400 font-mono text-sm">
                        OPERATOR: {user.name?.toUpperCase() || "ARCHITECT"} // TIER: {user.isPro ? "PRO" : "OBSERVER"}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayedAgents.map(agent => {
                        const dbAgent = dbAgents.find(a => a.slug === agent.id);
                        const isOnline = dbAgent?.isActive ?? false;

                        return (
                            <div key={agent.id} className={`bg-engine-dark border rounded-xl overflow-hidden shadow-[0_0_20px_rgba(0,243,255,0.05)] transition-all group ${isOnline ? 'border-neon-cyan/30 hover:shadow-[0_0_30px_rgba(0,243,255,0.1)]' : 'border-gray-700 opacity-70 grayscale'}`}>
                                <div className="p-6 border-b border-white/5 relative">
                                    {isOnline && (
                                        <div className="absolute top-4 right-4 text-green-500 animate-pulse">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        </div>
                                    )}
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold transition-colors mb-4 ${isOnline ? 'bg-white/5 text-gray-400 group-hover:text-neon-cyan group-hover:bg-neon-cyan/10' : 'bg-white/5 text-gray-600'}`}>
                                        {agent.name.charAt(0)}
                                    </div>
                                    <h3 className={`font-bold text-xl mb-1 transition-colors ${isOnline ? 'text-white group-hover:text-neon-cyan' : 'text-gray-400'}`}>{agent.name}</h3>
                                    <div className="text-xs font-mono text-gray-500">{agent.id}</div>
                                </div>
                                <div className="p-6 bg-black/20 space-y-4">
                                    <div className="flex justify-between text-xs font-mono">
                                        <span className="text-gray-500">ROLE</span>
                                        <span className="text-white">{agent.role}</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-mono">
                                        <span className="text-gray-500">STATUS</span>
                                        {isOnline ? (
                                            <span className="text-green-400">ONLINE</span>
                                        ) : (
                                            <span className="text-yellow-500">OFFLINE</span>
                                        )}
                                    </div>
                                    {isOnline ? (
                                        <Link
                                            href={`/agents/${agent.id}`}
                                            className="block w-full text-center py-2 border border-white/10 hover:border-white hover:bg-white/5 rounded text-xs font-bold transition-all mt-4"
                                        >
                                            INITIALISE UPLINK
                                        </Link>
                                    ) : (
                                        <button disabled className="block w-full text-center py-2 border border-transparent bg-white/5 text-gray-600 rounded text-xs font-bold mt-4 cursor-not-allowed">
                                            MAINTENANCE_MODE
                                        </button>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </main>
        </div>
    );
}
