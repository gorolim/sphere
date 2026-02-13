"use client";

import DashboardPanel from "@/components/ui/DashboardPanel";
import { Settings, Save } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-display font-bold text-white mb-8">System Configuration</h1>

            <div className="max-w-3xl">
                <DashboardPanel title="General Preferences" subtitle="CONFIG_V_2" icon={<Settings size={16} />}>
                    <div className="space-y-6 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-white">Maintenance Mode</h3>
                                <p className="text-xs text-gray-400">Disconnects all public traffic.</p>
                            </div>
                            <div className="w-12 h-6 bg-white/10 rounded-full relative cursor-pointer">
                                <div className="absolute left-1 top-1 w-4 h-4 bg-gray-500 rounded-full"></div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-white">Debug Logging</h3>
                                <p className="text-xs text-gray-400">Verbose output to console.</p>
                            </div>
                            <div className="w-12 h-6 bg-neon-purple/50 rounded-full relative cursor-pointer">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-white">Public Registration</h3>
                                <p className="text-xs text-gray-400">Allow new users to sign up.</p>
                            </div>
                            <div className="w-12 h-6 bg-neon-purple/50 rounded-full relative cursor-pointer">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/10 flex justify-end">
                            <button className="bg-neon-cyan text-black px-6 py-2 rounded font-bold text-sm flex items-center gap-2 hover:bg-white transition-colors">
                                <Save size={16} /> Save Changes
                            </button>
                        </div>
                    </div>
                </DashboardPanel>
            </div>
        </div>
    );
}
