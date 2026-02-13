import Link from "next/link";
import { Zap, Bot, Activity, Box } from "lucide-react";
import { getCurrentUser } from "@/lib/user";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/sign-in");
    }

    return (
        <div className="min-h-screen bg-engine-black text-white font-sans pt-24 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
                            OPERATOR DASHBOARD
                        </h1>
                        <p className="text-gray-400 font-mono text-sm uppercase tracking-wider">
                            // WELCOME_OPERATOR: {user.name || "UNKNOWN"}
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <span className={`px-4 py-2 rounded-lg font-mono text-xs font-bold border ${user.isPro ? 'bg-neon-cyan/10 border-neon-cyan/50 text-neon-cyan' : 'bg-gray-800 border-gray-700 text-gray-400'}`}>
                            STATUS: {user.isPro ? "ARCHITECT" : "OBSERVER"}
                        </span>
                    </div>
                </div>

                {/* Workflow / Automation Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {/* Automation Card */}
                    <div className="col-span-1 lg:col-span-2 bg-engine-dark border border-white/10 rounded-2xl p-8 relative overflow-hidden group hover:border-neon-cyan/50 transition-all">
                        <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                            <Bot className="text-neon-cyan w-16 h-16 opacity-20" />
                        </div>

                        <h2 className="text-2xl font-bold font-display text-white mb-4 flex items-center gap-3">
                            <Zap className="text-yellow-500" />
                            Automation Protocols
                        </h2>
                        <p className="text-gray-400 mb-8 max-w-lg">
                            Configure your n8n webhooks and autonomous agent triggers. Manage how your content pipelines flow.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 bg-black/40 border border-white/5 rounded-xl">
                                <h3 className="text-sm font-bold text-gray-300 mb-1">Active Webhooks</h3>
                                <p className="text-2xl font-mono text-white">0</p>
                            </div>
                            <div className="p-4 bg-black/40 border border-white/5 rounded-xl">
                                <h3 className="text-sm font-bold text-gray-300 mb-1">Triggers Fired</h3>
                                <p className="text-2xl font-mono text-neon-cyan">0</p>
                            </div>
                        </div>

                        <div className="mt-8">
                            <button className="bg-neon-cyan text-black font-bold py-3 px-6 rounded-xl hover:bg-neon-cyan/80 transition-colors flex items-center gap-2">
                                <Bot size={18} />
                                CONFIGURE AUTOMATION
                            </button>
                        </div>
                    </div>

                    {/* Quick Stats / Resource Usage */}
                    <div className="bg-engine-dark border border-white/10 rounded-2xl p-8 flex flex-col justify-between">
                        <div>
                            <h2 className="text-xl font-bold font-display text-white mb-4 flex items-center gap-2">
                                <Activity className="text-purple-500" />
                                Resource Usage
                            </h2>
                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-400">Token Limit</span>
                                        <span className="text-white font-mono">2%</span>
                                    </div>
                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-purple-500 w-[2%]"></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-400">Storage</span>
                                        <span className="text-white font-mono">0%</span>
                                    </div>
                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 w-[0%]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Agent Fleet Preview (for User) */}
                <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-2">
                    <Box className="text-hologram-blue" />
                    Deployed Units
                </h2>

                <div className="bg-engine-dark border border-white/10 rounded-xl p-12 text-center">
                    <p className="text-gray-500 mb-4">No agents deployed yet.</p>
                    <Link href="/directory" className="text-neon-cyan hover:underline font-mono text-sm">
                        BROWSE THE DIRECTORY {">"}
                    </Link>
                </div>
            </div>
        </div>
    );
}
