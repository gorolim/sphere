"use client";

import DashboardPanel from "@/components/ui/DashboardPanel";
import { Shield, ShieldAlert, Lock, UserCheck } from "lucide-react";

export default function SecurityPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-display font-bold text-white mb-8">Security Operations</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <DashboardPanel title="Threat Level" subtitle="DEFCON" icon={<ShieldAlert size={16} />} className="bg-red-500/5 border-red-500/20">
                    <div className="flex flex-col items-center justify-center h-48">
                        <div className="text-6xl font-bold text-red-500 mb-2">4</div>
                        <div className="text-sm font-mono text-gray-400 uppercase tracking-widest">Elevated Activity</div>
                    </div>
                </DashboardPanel>

                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <DashboardPanel title="Firewall" subtitle="INBOUND_RULES" icon={<Shield size={16} />} statusColor="green">
                            <div className="p-4 text-center">
                                <div className="text-2xl font-bold text-white">Active</div>
                                <div className="text-xs text-gray-500">24 Rules Enforced</div>
                            </div>
                        </DashboardPanel>
                        <DashboardPanel title="Auth Gate" subtitle="OAUTH_2.0" icon={<Lock size={16} />} statusColor="green">
                            <div className="p-4 text-center">
                                <div className="text-2xl font-bold text-white">Secure</div>
                                <div className="text-xs text-gray-500">MFA Required</div>
                            </div>
                        </DashboardPanel>
                    </div>
                    <DashboardPanel title="Access Log" subtitle="RECENT_EVENTS" icon={<UserCheck size={16} />} className="h-64">
                        <div className="space-y-2 font-mono text-xs overflow-y-auto h-full p-2">
                            {[
                                { user: "admin_root", ip: "192.168.1.4", action: "LOGIN_SUCCESS", time: "11:42:01", status: "ok" },
                                { user: "unknown", ip: "45.23.11.90", action: "PORT_SCAN_DETECTED", time: "11:40:22", status: "warn" },
                                { user: "system", ip: "localhost", action: "CERT_RENEWAL", time: "11:30:00", status: "ok" },
                                { user: "agent_logic", ip: "internal", action: "API_KEY_ROTATION", time: "11:15:00", status: "ok" },
                            ].map((log, i) => (
                                <div key={i} className="flex justify-between items-center border-b border-white/5 pb-2">
                                    <span className={log.status === 'warn' ? 'text-red-400' : 'text-green-400'}>{log.time}</span>
                                    <span className="text-gray-300">{log.action}</span>
                                    <span className="text-gray-500 text-[10px]">{log.ip}</span>
                                </div>
                            ))}
                        </div>
                    </DashboardPanel>
                </div>
            </div>
        </div>
    );
}
