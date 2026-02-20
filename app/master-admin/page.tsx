import Link from "next/link";
import { Activity, Brain, Server, AlertTriangle, Users, FileText } from "lucide-react";
import { getAdminStats } from "@/app/actions/admin";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
    let stats = {
        agents: { total: 0, active: 0 },
        users: { total: 0, pro: 0 },
        posts: { total: 0, published: 0 },
        tokens: { total: 0 }
    };

    try {
        stats = await getAdminStats();
    } catch (e) {
        console.error("Admin stats failed:", e);
        // We will show a degraded UI instead of crashing
    }

    // @ts-ignore - We know stats might have error, simpler than updating type definition everywhere right now
    if (stats.error) {
        if (stats.error === "Unauthorized") {
            return (
                <div className="flex flex-col items-center justify-center h-96 text-red-500">
                    <AlertTriangle size={48} className="mb-4" />
                    <h1 className="text-2xl font-bold">ACCESS DENIED</h1>
                    <p className="text-gray-400 mt-2">Clearance Level Insufficient.</p>

                    <div className="mt-4 p-4 bg-red-500/10 rounded-lg text-sm text-center font-mono border border-red-500/20">
                        <p>REQUIRED_ROLE: admin</p>
                        <p>CURRENT_ROLE: {stats.role || "unknown"}</p>
                        <p className="text-xs text-gray-500 mt-2">{stats.userId}</p>
                    </div>

                    <Link href="/" className="mt-6 px-4 py-2 bg-white/10 rounded hover:bg-white/20 text-white">
                        Return to Base
                    </Link>
                </div>
            )
        }
        return (
            <div className="flex flex-col items-center justify-center h-96 text-yellow-500">
                <AlertTriangle size={48} className="mb-4" />
                <h1 className="text-2xl font-bold">SYSTEM OFFLINE</h1>
                <p className="text-gray-400 mt-2">Unable to retrieve fleet telemetry.</p>
                <p className="text-xs text-yellow-500/50 mt-2 font-mono">ERROR: {JSON.stringify(stats.details) || "Connection Failure"}</p>
            </div>
        )
    }

    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white">Command Center</h1>
                    <p className="text-gray-400 font-mono mt-1">// OVERSEEING_AGENT_FLEET</p>
                </div>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-green-500/10 text-green-500 border border-green-500/20 rounded font-mono text-xs flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        SYSTEM_OPTIMAL
                    </span>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <KPICard
                    title="Active Agents"
                    value={stats.agents.active}
                    total={stats.agents.total}
                    icon={<Brain className="text-neon-cyan" />}
                />
                <KPICard
                    title="Total Users"
                    value={stats.users.total}
                    change={`${stats.users.pro} PRO`}
                    icon={<Users className="text-neon-purple" />}
                />
                <KPICard
                    title="Content Library"
                    value={stats.posts.total}
                    change={`${stats.posts.published} PUB`}
                    icon={<FileText className="text-hologram-blue" />}
                />
                <KPICard
                    title="System Load"
                    value={`${(stats.tokens.total / 1000).toFixed(1)}k`}
                    change="TOKENS"
                    icon={<Activity className="text-neon-purple" />}
                />
                <KPICard title="System Alerts" value="0" status="good" icon={<AlertTriangle className="text-green-500" />} />
            </div>

            {/* Active Agents List */}
            <div className="bg-engine-dark border border-white/10 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <h2 className="font-display font-bold text-lg">Quick Actions</h2>
                    <Link href="/master-admin/agents" className="text-xs font-mono text-neon-cyan hover:text-white">MANAGE_FLEET</Link>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link href="/master-admin/posts" className="block p-4 bg-white/5 border border-white/10 rounded-lg hover:border-neon-cyan/50 hover:bg-white/10 transition-all group">
                        <h3 className="font-bold text-white group-hover:text-neon-cyan">Manage Content</h3>
                        <p className="text-sm text-gray-500">Edit and publish chronicles.</p>
                    </Link>
                    <Link href="/master-admin/agents" className="block p-4 bg-white/5 border border-white/10 rounded-lg hover:border-neon-purple/50 hover:bg-white/10 transition-all group">
                        <h3 className="font-bold text-white group-hover:text-neon-purple">Deploy Agents</h3>
                        <p className="text-sm text-gray-500">Activate or configure units.</p>
                    </Link>
                    <Link href="/master-admin/job-tracker" className="block p-4 bg-white/5 border border-white/10 rounded-lg hover:border-green-500/50 hover:bg-white/10 transition-all group">
                        <h3 className="font-bold text-white group-hover:text-green-500">Job Tracker</h3>
                        <p className="text-sm text-gray-500">Aggregate and manage AI job listings.</p>
                    </Link>
                </div>
            </div>
        </div>
    );
}

const KPICard = ({ title, value, total, change, status, icon }: any) => (
    <div className="bg-engine-dark border border-white/10 p-6 rounded-xl relative overflow-hidden group hover:border-white/20 transition-colors">
        <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-white/5 rounded-lg text-white">{icon}</div>
            {change && <span className={`text-xs font-mono ${change.startsWith('+') ? 'text-yellow-500' : 'text-green-500'}`}>{change}</span>}
        </div>
        <h3 className="text-gray-400 text-sm font-mono uppercase tracking-wider mb-1">{title}</h3>
        <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-white font-display">{value}</span>
            {total && <span className="text-sm text-gray-600">/ {total}</span>}
        </div>
    </div>
)
