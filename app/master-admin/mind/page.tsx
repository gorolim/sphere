import { Brain, Briefcase, Users, Workflow } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function MasterAdminMindPage() {
    return (
        <div className="flex-1 w-full bg-engine-background flex flex-col items-start p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3">
                    <Brain className="text-neon-purple shrink-0" size={32} />
                    The Mind
                </h1>
                <p className="text-gray-400 font-mono mt-2">// THE_ARCHITECT_CONTROL_PANEL</p>
                <p className="max-w-3xl text-gray-400 mt-4 leading-relaxed">
                    This is the command center for system orchestration, automation routing, and service management. 
                    From here, The Architect oversees the fleet of AI Agents, tracking job applications, and setting workflows.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
                <Link href="/master-admin/job-tracker" className="group p-6 rounded-xl border border-white/10 bg-black/20 hover:bg-white/5 hover:border-neon-cyan transition-all">
                    <Briefcase className="text-neon-cyan mb-4 group-hover:scale-110 transition-transform" size={24} />
                    <h2 className="text-xl font-bold text-white mb-2">Job Tracker</h2>
                    <p className="text-sm text-gray-500">Aggregate and manage AI Job Listings</p>
                </Link>

                <Link href="/master-admin/agents" className="group p-6 rounded-xl border border-white/10 bg-black/20 hover:bg-white/5 hover:border-hologram-blue transition-all">
                    <Users className="text-hologram-blue mb-4 group-hover:scale-110 transition-transform" size={24} />
                    <h2 className="text-xl font-bold text-white mb-2">Agent Fleet</h2>
                    <p className="text-sm text-gray-500">Deploy and monitor the AI Workers</p>
                </Link>

                <Link href="/master-admin/automation" className="group p-6 rounded-xl border border-white/10 bg-black/20 hover:bg-white/5 hover:border-neon-purple transition-all">
                    <Workflow className="text-neon-purple mb-4 group-hover:scale-110 transition-transform" size={24} />
                    <h2 className="text-xl font-bold text-white mb-2">Automations</h2>
                    <p className="text-sm text-gray-500">Configure n8n webhook triggers and paths</p>
                </Link>
            </div>
        </div>
    );
}
