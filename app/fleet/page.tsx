"use client";

import NavBar from "@/components/NavBar";
import AgentFleet from "@/components/AgentFleet";
import { useUser } from "@/lib/context/UserContext";
import { SPHERE_AGENTS } from "@/lib/brain";
import Link from "next/link";
import { Shield, AlertTriangle } from "lucide-react";

export default function FleetPage() {
    const { user } = useUser();

    // Filter agents that are in the user's hired list
    const myAgents = SPHERE_AGENTS.filter(a => user.hiredAgents.includes(a.id));

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
                        OPERATOR: {user.name.toUpperCase()} // BALANCE: {user.balance.toLocaleString()} NCR
                    </p>
                </div>

                {myAgents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myAgents.map(agent => (
                            <div key={agent.id} className="bg-engine-dark border border-neon-cyan/30 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(0,243,255,0.05)] hover:shadow-[0_0_30px_rgba(0,243,255,0.1)] transition-all group">
                                <div className="p-6 border-b border-white/5 relative">
                                    <div className="absolute top-4 right-4 text-green-500 animate-pulse">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    </div>
                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-2xl font-bold text-gray-400 group-hover:text-neon-cyan group-hover:bg-neon-cyan/10 transition-colors mb-4">
                                        {agent.name.charAt(0)}
                                    </div>
                                    <h3 className="font-bold text-xl text-white mb-1 group-hover:text-neon-cyan transition-colors">{agent.name}</h3>
                                    <div className="text-xs font-mono text-gray-500">{agent.id}</div>
                                </div>
                                <div className="p-6 bg-black/20 space-y-4">
                                    <div className="flex justify-between text-xs font-mono">
                                        <span className="text-gray-500">ROLE</span>
                                        <span className="text-white">{agent.role}</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-mono">
                                        <span className="text-gray-500">STATUS</span>
                                        <span className="text-green-400">ONLINE</span>
                                    </div>
                                    <Link
                                        href={`/agents/${agent.id}`}
                                        className="block w-full text-center py-2 border border-white/10 hover:border-white hover:bg-white/5 rounded text-xs font-bold transition-all mt-4"
                                    >
                                        INITIALISE UPLINK
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/5">
                        <AlertTriangle className="mx-auto text-yellow-500 mb-4" size={48} />
                        <h2 className="text-2xl font-bold text-white mb-2">My Fleet is Empty</h2>
                        <p className="text-gray-400 max-w-md mx-auto mb-8">
                            You have not assigned any agents to your command structure yet. Visit the directory to acquire neural assets.
                        </p>
                        <Link href="/directory" className="px-8 py-3 bg-neon-cyan text-black font-bold rounded-xl hover:bg-white transition-colors">
                            BROWSE DIRECTORY
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
}
