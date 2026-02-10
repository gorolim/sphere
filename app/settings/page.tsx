
import { getCurrentUser } from "@/lib/user";
import { prisma } from "@/lib/db";
import { checkSubscription } from "@/lib/subscription";
import { redirect } from "next/navigation";
import { Cpu, Zap, Activity, CreditCard } from "lucide-react";
import Link from "next/link";

export default async function SettingsPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/api/auth/signin");
    }

    const isPro = await checkSubscription();

    // Fetch Token Usage
    const usage = await prisma.tokenUsage.groupBy({
        by: ['agentId'],
        where: { userId: user.id },
        _sum: {
            totalTokens: true,
            inputTokens: true,
            outputTokens: true
        }
    });

    const totalTokensUsed = usage.reduce((acc, curr) => acc + (curr._sum.totalTokens || 0), 0);
    const totalInput = usage.reduce((acc, curr) => acc + (curr._sum.inputTokens || 0), 0);
    const totalOutput = usage.reduce((acc, curr) => acc + (curr._sum.outputTokens || 0), 0);

    return (
        <div className="min-h-screen bg-engine-black text-white pt-24 px-6">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-display font-bold">Neural Interface Settings</h1>
                        <p className="text-gray-400 font-mono">Welcome back, {user.name || "Architect"}.</p>
                    </div>
                    <div className="p-2 bg-white/5 rounded-full border border-white/10">
                        <div className="w-12 h-12 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-full"></div>
                    </div>
                </div>

                {/* Subscription Status */}
                <div className="bg-engine-dark border border-white/10 rounded-xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-all">
                        <CreditCard size={120} />
                    </div>

                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Zap className="text-yellow-400" /> Subscription Tier
                    </h2>

                    <div className="flex items-center gap-4 mb-6">
                        <div className={`px-4 py-2 rounded-lg font-bold border ${isPro ? 'bg-neon-cyan/20 border-neon-cyan text-neon-cyan' : 'bg-gray-700/50 border-gray-600 text-gray-300'}`}>
                            {isPro ? "ARCHITECT (PRO)" : "OBSERVER (FREE)"}
                        </div>
                        {!isPro && (
                            <Link href="/pricing" className="text-sm text-neon-cyan hover:underline hover:text-white transition-colors">
                                Upgrade to unlock full potential &rarr;
                            </Link>
                        )}
                    </div>
                </div>

                {/* Token Usage Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatsCard title="Total Tokens" value={totalTokensUsed.toLocaleString()} icon={<Cpu />} color="text-neon-purple" />
                    <StatsCard title="Input Processed" value={totalInput.toLocaleString()} icon={<Activity />} color="text-blue-400" />
                    <StatsCard title="Output Generated" value={totalOutput.toLocaleString()} icon={<Zap />} color="text-yellow-400" />
                </div>

                {/* Detailed Usage by Agent (Placeholder or Simple List) */}
                <div className="bg-engine-dark border border-white/10 rounded-xl p-6">
                    <h2 className="text-xl font-bold mb-4">Agent Utilization</h2>
                    {usage.length > 0 ? (
                        <div className="space-y-3">
                            {usage.map((u) => (
                                <div key={u.agentId} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                                    <span className="font-mono text-gray-300">Agent ID: {u.agentId}</span>
                                    <span className="font-bold text-white">{u._sum.totalTokens?.toLocaleString()} tokens</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">No agent activity recorded yet.</p>
                    )}
                </div>

            </div>
        </div>
    );
}

function StatsCard({ title, value, icon, color }: any) {
    return (
        <div className="bg-engine-dark border border-white/10 p-6 rounded-xl hover:border-white/20 transition-all">
            <div className={`mb-2 ${color}`}>{icon}</div>
            <p className="text-gray-400 text-sm uppercase tracking-wider">{title}</p>
            <p className="text-2xl font-bold font-display">{value}</p>
        </div>
    );
}
