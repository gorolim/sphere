"use client";

import { motion } from "framer-motion";

export default function Hero() {
    return (
        <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-engine-black">
            {/* Background Grid - "Motherboard" feel */}
            <div className="absolute inset-0 z-0 opacity-20"
                style={{
                    backgroundImage: `
                linear-gradient(to right, #0a0a12 1px, transparent 1px),
                linear-gradient(to bottom, #0a0a12 1px, transparent 1px),
                radial-gradient(circle at 50% 50%, #1a1a2e 0%, transparent 60%)
            `,
                    backgroundSize: '40px 40px, 40px 40px, 100% 100%'
                }}
            ></div>

            {/* The Sphere Engine - Sacred Geometry / Quantum Core */}
            <div className="relative z-10 flex items-center justify-center mb-12">
                {/* Core Glow */}
                <div className="absolute w-64 h-64 bg-neon-cyan/20 rounded-full blur-[80px] animate-pulse-glow"></div>
                <div className="absolute w-32 h-32 bg-neon-purple/30 rounded-full blur-[40px] mix-blend-screen"></div>

                {/* Ring 1 - Outer Shell */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute w-[500px] h-[500px] border border-neon-cyan/20 rounded-full border-dashed"
                ></motion.div>

                {/* Ring 2 - Reverse Hex */}
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute w-[400px] h-[400px] border border-neon-purple/30 rounded-full"
                    style={{
                        clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"
                    }}
                ></motion.div>

                {/* Ring 3 - Inner Gyro */}
                <motion.div
                    animate={{ rotate: 180, scale: [1, 1.1, 1] }}
                    transition={{
                        rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                        scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="absolute w-[300px] h-[300px] border-2 border-hologram-blue/40 rounded-full"
                    style={{ borderTopColor: "transparent", borderBottomColor: "transparent" }}
                ></motion.div>

                {/* Ring 4 - Sacred Star */}
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="absolute w-[300px] h-[300px] flex items-center justify-center opacity-40"
                >
                    <div className="w-full h-full border border-neon-cyan/30 transform rotate-45"></div>
                    <div className="absolute w-full h-full border border-neon-cyan/30 transform"></div>
                </motion.div>


                {/* Central Text / Logo Mark */}
                <div className="relative z-20 text-center flex flex-col items-center">
                    <h1 className="font-display text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500 tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                        The Sphere
                    </h1>
                    <p className="mt-4 text-neon-cyan font-mono text-lg tracking-[0.3em] uppercase opacity-80 mb-8">
                        Agent-Native Internet
                    </p>

                    <button
                        onClick={() => document.getElementById('agent-fleet')?.scrollIntoView({ behavior: 'smooth' })}
                        className="group relative px-8 py-3 bg-neon-cyan/10 border border-neon-cyan/50 text-neon-cyan font-bold font-mono text-sm tracking-widest hover:bg-neon-cyan hover:text-black transition-all duration-300"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            CONNECT_TO_MAINFRAME <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                        </span>
                        {/* Glitch Effect Element */}
                        <div className="absolute inset-0 bg-neon-cyan opacity-0 group-hover:opacity-20 blur-lg transition-opacity"></div>
                    </button>
                </div>
            </div>

            {/* Hero Stats / Data */}
            <div className="absolute bottom-12 z-10 grid grid-cols-3 gap-12 text-center">
                <Stat label="Active Agents" value="2.4M" />
                <Stat label="Total Hashrate" value="450 EH/s" />
                <Stat label="Market Cap" value="850B" />
            </div>

            {/* Background "Skull" Hint via CSS Mask or subtle vector?? 
           Hard to do pure CSS skull. Keeping it abstract for now.
       */}
        </div>
    );
}

const Stat = ({ label, value }: { label: string; value: string }) => (
    <div className="flex flex-col">
        <span className="text-3xl font-display font-bold text-white">{value}</span>
        <span className="text-xs font-mono text-gray-500 uppercase tracking-widest mt-1">{label}</span>
    </div>
)
