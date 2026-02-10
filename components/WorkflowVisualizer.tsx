"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Globe, Brain, Film, Youtube, Instagram, Twitter, ArrowRight, Zap } from "lucide-react";

export default function WorkflowVisualizer() {
    const [activeStep, setActiveStep] = useState(0);

    const steps = [
        {
            id: 0,
            title: "Global Intel",
            icon: <Globe size={24} />,
            description: "Analyst agents scan 50k+ sources for emerging trends.",
            color: "text-blue-400",
            bg: "bg-blue-500/10",
            border: "border-blue-500/20"
        },
        {
            id: 1,
            title: "Neural Synergy",
            icon: <Brain size={24} />,
            description: "The Core synthesizes data into a cohesive narrative strategy.",
            color: "text-purple-400",
            bg: "bg-purple-500/10",
            border: "border-purple-500/20"
        },
        {
            id: 2,
            title: "Studio Production",
            icon: <Film size={24} />,
            description: "Specialized agents craft tailored content for each platform.",
            color: "text-neon-cyan",
            bg: "bg-neon-cyan/10",
            border: "border-neon-cyan/20"
        },
        {
            id: 3,
            title: "Multi-Cast",
            icon: <Zap size={24} />,
            description: "Simultaneous publishing to YouTube, Instagram, and X.",
            color: "text-green-400",
            bg: "bg-green-500/10",
            border: "border-green-500/20"
        }
    ];

    return (
        <div className="w-full max-w-5xl mx-auto p-4 md:p-8">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-center mb-12">
                FROM <span className="text-neon-cyan">SIGNAL</span> TO <span className="text-neon-purple">STORY</span>
            </h2>

            {/* Desktop Visualization */}
            <div className="hidden md:flex justify-between items-center relative">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-white/5 -translate-y-1/2 z-0">
                    <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-500"
                        initial={{ width: "0%" }}
                        whileInView={{ width: "100%" }}
                        transition={{ duration: 2, ease: "linear" }}
                    />
                </div>

                {steps.map((step, index) => (
                    <motion.div
                        key={step.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.3 }}
                        className={`relative z-10 flex flex-col items-center cursor-pointer group`}
                        onHoverStart={() => setActiveStep(index)}
                    >
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border ${step.border} ${step.bg} ${step.color} shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(0,0,0,0.5)]`}>
                            {step.icon}
                        </div>
                        <div className="mt-4 text-center">
                            <h3 className={`font-bold font-display ${activeStep === index ? 'text-white' : 'text-gray-500'} transition-colors`}>{step.title}</h3>
                        </div>

                        {/* Active Indicator */}
                        {activeStep === index && (
                            <motion.div
                                layoutId="active-glow"
                                className={`absolute inset-0 bg-${step.color.split('-')[1]}-500/20 blur-xl -z-10 rounded-full`}
                            />
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Mobile Vertical Flow */}
            <div className="md:hidden space-y-8 relative">
                <div className="absolute left-8 top-0 bottom-0 w-1 bg-white/5 z-0" />
                {steps.map((step, index) => (
                    <div key={step.id} className="relative z-10 flex items-center gap-6">
                        <div className={`w-16 h-16 rounded-2xl flex-shrink-0 flex items-center justify-center border ${step.border} ${step.bg} ${step.color}`}>
                            {step.icon}
                        </div>
                        <div>
                            <h3 className="font-bold font-display text-white text-lg">{step.title}</h3>
                            <p className="text-gray-400 text-sm mt-1">{step.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Detail Card - Desktop Only */}
            <div className="hidden md:block mt-12 bg-engine-dark border border-white/10 rounded-2xl p-8 min-h-[160px] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-gradient-to-br from-neon-purple/5 to-transparent rounded-full blur-3xl" />

                <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative z-10 grid grid-cols-12 gap-8 items-center"
                >
                    <div className="col-span-8">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono mb-4 border ${steps[activeStep].border} ${steps[activeStep].bg} ${steps[activeStep].color}`}>
                            STEP 0{activeStep + 1} // {steps[activeStep].title.toUpperCase()}
                        </div>
                        <p className="text-xl text-gray-300 leading-relaxed">
                            {steps[activeStep].description}
                        </p>
                    </div>
                    <div className="col-span-4 flex justify-end opacity-50">
                        {/* Contextual Icon based on step */}
                        {activeStep === 0 && <Globe size={80} className="text-blue-500" />}
                        {activeStep === 1 && <Brain size={80} className="text-purple-500" />}
                        {activeStep === 2 && <Film size={80} className="text-neon-cyan" />}
                        {activeStep === 3 && (
                            <div className="flex gap-2">
                                <Youtube size={40} className="text-red-500" />
                                <Twitter size={40} className="text-blue-400" />
                                <Instagram size={40} className="text-pink-500" />
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
