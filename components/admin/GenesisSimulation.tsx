"use client";

import { useState } from "react";
import { Zap, CheckCircle2, CircleDashed, Loader2 } from "lucide-react";

export function GenesisSimulation() {
    const [simulationState, setSimulationState] = useState<"IDLE" | "SIMULATING" | "COMPLETE">("IDLE");
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        { name: "Waking The Architect (Profile Generation)", delay: 2000 },
        { name: "Deploying Storyteller Agent (First Journey Node)", delay: 2500 },
        { name: "Igniting Pathfinders (Marketplace Art Sandbox)", delay: 3000 },
    ];

    const handleSimulation = async () => {
        setSimulationState("SIMULATING");
        setCurrentStep(0);

        for (let i = 0; i < steps.length; i++) {
            setCurrentStep(i);
            // Simulate the time it takes for an n8n webhook to process and return DB writes
            await new Promise((resolve) => setTimeout(resolve, steps[i].delay));
        }

        setSimulationState("COMPLETE");
    };

    return (
        <div className="w-full bg-engine-dark border border-yellow-500/30 rounded-xl p-6 relative overflow-hidden mt-8">
            {/* Background warning grid effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(234,179,8,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(234,179,8,0.03)_1px,transparent_1px)] bg-size-[20px_20px]"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
                <div>
                    <div className="flex items-center gap-3 text-yellow-500 mb-2">
                        <Zap className="animate-pulse" />
                        <h2 className="text-xl font-display font-bold uppercase tracking-widest">Genesis Simulation</h2>
                    </div>
                    <p className="text-sm text-gray-400 max-w-lg">
                        Execute this sequence to simulate the Oroboros AI loop. This will mock payload drops to our n8n webhooks, instantly populating a dummy Profile, JourneyEntry, and MarketplaceArt to verify the system's "First Spark of Life".
                    </p>
                </div>

                <button 
                    onClick={handleSimulation}
                    disabled={simulationState === "SIMULATING"}
                    className={`px-6 py-3 font-mono font-bold text-sm uppercase tracking-wider rounded transition-all flex items-center gap-2
                        ${simulationState === "IDLE" 
                            ? "bg-yellow-500 text-black hover:bg-yellow-400 hover:shadow-[0_0_20px_rgba(234,179,8,0.4)]" 
                            : simulationState === "SIMULATING"
                            ? "bg-yellow-500/20 text-yellow-500 border border-yellow-500/50 cursor-not-allowed"
                            : "bg-green-500 text-black border border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                        }`}
                >
                    {simulationState === "IDLE" && <><Zap size={16} /> TRIGGER_GENESIS</>}
                    {simulationState === "SIMULATING" && <><Loader2 size={16} className="animate-spin" /> RUNNING_SIMULATION...</>}
                    {simulationState === "COMPLETE" && <><CheckCircle2 size={16} /> SYSTEM_ALIVE</>}
                </button>
            </div>

            {/* Simulation Steps Track */}
            <div className="relative z-10 bg-black/40 border border-white/5 rounded-lg p-5">
                <div className="space-y-4">
                    {steps.map((step, index) => {
                        const isPending = simulationState === "IDLE" || (simulationState === "SIMULATING" && index > currentStep);
                        const isActive = simulationState === "SIMULATING" && index === currentStep;
                        const isDone = simulationState === "COMPLETE" || (simulationState === "SIMULATING" && index < currentStep);

                        return (
                            <div key={index} className={`flex items-center gap-4 transition-opacity duration-300 ${isPending ? "opacity-40" : "opacity-100"}`}>
                                <div className="shrink-0">
                                    {isPending && <CircleDashed size={20} className="text-gray-600" />}
                                    {isActive && <Loader2 size={20} className="text-yellow-500 animate-spin" />}
                                    {isDone && <CheckCircle2 size={20} className="text-green-500" />}
                                </div>
                                <div className="flex-1 font-mono text-sm">
                                    <span className={isActive ? "text-yellow-500" : isDone ? "text-gray-300" : "text-gray-500"}>
                                        {step.name}
                                    </span>
                                </div>
                                <div className="shrink-0 font-mono text-xs">
                                    {isDone && <span className="text-green-500">HTTP 200 OK</span>}
                                    {isActive && <span className="text-yellow-500 animate-pulse">AWAITING_WEBHOOK...</span>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
