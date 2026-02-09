import Link from "next/link";
import { Activity, Brain, Server, AlertTriangle } from "lucide-react";

export default function AdminDashboard() {
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
                <KPICard title="Active Agents" value="1" total="5" icon={<Brain className="text-neon-cyan" />} />
                <KPICard title="System Load" value="12%" change="-2%" icon={<Activity className="text-neon-purple" />} />
                <KPICard title="Memory Usage" value="4.2TB" change="+5%" icon={<Server className="text-hologram-blue" />} />
                <KPICard title="Alerts" value="0" status="good" icon={<AlertTriangle className="text-green-500" />} />
            </div>

            {/* Active Agents List */}
            <div className="bg-engine-dark border border-white/10 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <h2 className="font-display font-bold text-lg">Deployed Agents</h2>
                    <Link href="/admin/agents" className="text-xs font-mono text-neon-cyan hover:text-white">VIEW_ALL</Link>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 gap-4">
                        {/* Agent Card: Market Researcher */}
                        <Link href="/admin/agents/market-researcher" className="group block">
                            <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center justify-between hover:bg-white/10 hover:border-neon-cyan/50 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-neon-cyan/20 rounded-full flex items-center justify-center text-neon-cyan">
                                        <Brain size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white group-hover:text-neon-cyan transition-colors">Senior AI Market Specialist</h3>
                                        <div className="flex gap-2 mt-1">
                                            <span className="text-xs font-mono text-gray-400">ID: AGT-001</span>
                                            <span className="text-xs font-mono text-green-500">• RUNNING</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-gray-400 mb-1">NEXT RUN</div>
                                    <div className="font-mono text-white">12:00 UTC</div>
                                </div>
                            </div>
                        </Link>

                        {/* Placeholder for more agents */}
                        <div className="bg-black/40 border border-white/5 border-dashed rounded-lg p-4 flex items-center justify-center text-gray-600 font-mono text-sm">
                            [ SLOT_EMPTY ]
                        </div>
                    </div>
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
