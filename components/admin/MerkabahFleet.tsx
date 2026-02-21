"use client";

import { useState } from "react";
import { Car, Wrench, Shield, Navigation } from "lucide-react";

const INITIAL_FLEET = [
    {
        id: "vessel-1",
        name: "1975 Chevette",
        status: "Archived",
        type: "Car",
        icon: <Car size={24} className="text-gray-500" />,
        color: "border-gray-500",
        description: "The original chariot. Completed its journey.",
        logs: 12
    },
    {
        id: "vessel-2",
        name: "Chevy G20 Van",
        status: "Active",
        type: "Van",
        icon: <Car size={24} className="text-green-500" />,
        color: "border-green-500",
        description: "The mobile headquarters. Fully operational.",
        logs: 45
    },
    {
        id: "vessel-3",
        name: "Triumph Street Triple",
        status: "Active",
        type: "Motorcycle",
        icon: <Navigation size={24} className="text-neon-cyan" />,
        color: "border-neon-cyan",
        description: "The nimble scout. High mobility.",
        logs: 28
    }
];

export function MerkabahFleet() {
    const [fleet, setFleet] = useState(INITIAL_FLEET);

    return (
        <div className="w-full bg-black/40 border border-white/10 rounded-xl p-6 mt-8">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Shield className="text-hologram-blue" size={28} />
                    <div>
                        <h2 className="text-2xl font-display font-bold text-white">The Merkabah</h2>
                        <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">Physical Vessels Tracker</p>
                    </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded font-mono text-xs transition-colors">
                    <Wrench size={14} /> ADD_VESSEL
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {fleet.map((vessel) => (
                    <div key={vessel.id} className={`p-5 rounded-lg border bg-black/50 ${vessel.color}/30 hover:${vessel.color}/60 transition-colors relative overflow-hidden group`}>
                        <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity">
                            {vessel.icon}
                        </div>
                        <h3 className="font-bold text-lg text-white mb-1">{vessel.name}</h3>
                        <div className="flex items-center gap-2 mb-4">
                            <span className={`w-2 h-2 rounded-full ${vessel.status === 'Active' ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                            <span className="text-xs font-mono text-gray-400 uppercase">{vessel.status}</span>
                        </div>
                        <p className="text-sm text-gray-500 mb-4 h-10">{vessel.description}</p>
                        
                        <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-auto">
                            <span className="text-xs font-mono text-gray-400">LOGS: {vessel.logs}</span>
                            <button className="text-xs font-mono text-neon-cyan hover:text-white transition-colors">MANAGE_LOGS</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
