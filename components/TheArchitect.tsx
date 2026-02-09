"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, User, Server } from "lucide-react";
import Image from "next/image";
import { queryBrain, HARDWARE_CATALOG, SOFTWARE_SPARKS } from "@/lib/brain";

export default function TheArchitect() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string, data?: any }[]>([
        { role: 'bot', text: "Greetings. I am The Architect. I can provision Agent/Robot fleets. Tell me what you need directly. (e.g., 'I want a robot to manage 3d printers')" }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInput("");
        setIsTyping(true);

        // Simulated "Gemini" Response Logic
        setTimeout(() => {
            let botResponse = "";
            let dataPayload = null;
            let type = "chat";

            const brainResult = queryBrain(userMsg);

            if (brainResult) {
                // @ts-ignore
                type = brainResult.type;
                // @ts-ignore
                botResponse = brainResult.message || "I have processed your request.";

                if (type === "provisioning") {
                    botResponse = "I have calculated the optimal provisioning for your request. See below.";
                    dataPayload = brainResult;
                } else if (type === "agent_recommendation") {
                    // @ts-ignore
                    dataPayload = { type: 'agents', items: brainResult.data };
                } else if (type === "catalog") {
                    // @ts-ignore
                    dataPayload = { type: 'catalog', items: brainResult.items };
                }
            } else {
                botResponse = "I am tuning to your frequency. Try asking for specific agent roles (e.g., 'Find a crypto analyst') or hardware.";
            }

            setMessages(prev => [...prev, { role: 'bot', text: botResponse, data: dataPayload }]);
            setIsTyping(false);
        }, 1000);
    };

    return (
        <>
            {/* Floating Trigger */}
            <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
                className="fixed bottom-8 right-8 z-50"
            >
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative group w-16 h-16 rounded-full bg-engine-black border border-neon-cyan/50 hover:border-neon-cyan shadow-[0_0_15px_rgba(0,243,255,0.2)] flex items-center justify-center overflow-hidden transition-all duration-300"
                >
                    <div className="absolute inset-0 bg-neon-cyan/10 group-hover:bg-neon-cyan/20 transition-colors"></div>
                    {/* Placeholder until image gen works */}
                    <span className="font-display font-bold text-neon-cyan text-2xl">A</span>
                </button>
            </motion.div>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-28 right-8 z-50 w-80 md:w-[450px] bg-engine-dark/95 backdrop-blur-xl border border-neon-cyan/30 rounded-xl shadow-2xl overflow-hidden font-mono text-sm max-h-[600px] flex flex-col"
                    >
                        {/* Header */}
                        <div className="bg-engine-black p-4 border-b border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse"></div>
                                <span className="text-neon-cyan font-bold uppercase tracking-wider">The Architect</span>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white">
                                <X size={16} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div className={`max-w-[90%] p-3 rounded-lg ${msg.role === 'user'
                                        ? 'bg-white/10 text-white rounded-br-none'
                                        : 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 rounded-bl-none'
                                        }`}>
                                        {msg.text}
                                    </div>

                                    {/* Data Payload Rendering */}
                                    {msg.data && msg.data.recommendation && (
                                        <div className="mt-2 w-full bg-black/50 border border-white/10 rounded p-3 text-xs">
                                            <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                                                <Server size={14} /> Provisioning Table
                                            </h4>

                                            <div className="grid grid-cols-2 gap-2 mb-3">
                                                <div className="text-gray-500">Hardware Unit</div>
                                                <div className="text-right text-neon-cyan">{msg.data.hardware.name}</div>

                                                <div className="text-gray-500">Hardware Cost</div>
                                                <div className="text-right text-white">${msg.data.hardware.price}</div>

                                                <div className="text-gray-500">Software Spark</div>
                                                <div className="text-right text-neon-purple">{msg.data.software.name}</div>

                                                <div className="text-gray-500">Software Fee</div>
                                                <div className="text-right text-white">${msg.data.software.cost}</div>

                                                <div className="col-span-2 border-t border-white/10 my-1"></div>

                                                <div className="font-bold text-white">Total TCO</div>
                                                <div className="font-bold text-right text-neon-cyan">${msg.data.hardware.price + msg.data.software.cost}</div>
                                            </div>

                                            <div className="bg-[#0a0a10] p-2 rounded border border-white/5 font-mono text-[10px] text-gray-400">
                                                <div className="text-blue-400 mb-1">// agent.json update</div>
                                                {`"hardware_access": ${JSON.stringify(msg.data.manifest_update.hardware_access)}`}
                                            </div>

                                            <button className="w-full mt-3 bg-neon-cyan/20 hover:bg-neon-cyan text-neon-cyan hover:text-black py-2 rounded font-bold transition-all">
                                                CONFIRM & INITIALIZE
                                            </button>
                                        </div>
                                    )}

                                    {/* Catalog Rendering */}
                                    {msg.data && msg.data.type === 'catalog' && (
                                        <div className="mt-2 w-full space-y-2">
                                            {msg.data.items.map((item: any) => (
                                                <div key={item.id} className="bg-black/50 border border-white/10 p-2 rounded flex justify-between items-center">
                                                    <span className="text-white text-xs">{item.name}</span>
                                                    <span className="text-neon-cyan text-xs">${item.price}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Agent List Rendering */}
                                    {msg.data && msg.data.type === 'agents' && (
                                        <div className="mt-2 w-full space-y-2">
                                            {msg.data.items.map((agent: any) => (
                                                <div key={agent.id} className="bg-neon-cyan/5 border border-neon-cyan/20 p-3 rounded flex justify-between items-start group hover:bg-neon-cyan/10 transition-colors cursor-pointer">
                                                    <div>
                                                        <div className="text-white text-xs font-bold">{agent.name}</div>
                                                        <div className="text-[10px] text-gray-500">{agent.role}</div>
                                                    </div>
                                                    <a href={`/agents/${agent.id}`} className="text-neon-cyan text-[10px] border border-neon-cyan/30 px-2 py-1 rounded hover:bg-neon-cyan hover:text-black transition-colors">
                                                        HIRE
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-neon-cyan/10 px-3 py-2 rounded-lg rounded-bl-none flex gap-1">
                                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 h-1 bg-neon-cyan rounded-full"></motion.div>
                                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }} className="w-1 h-1 bg-neon-cyan rounded-full"></motion.div>
                                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }} className="w-1 h-1 bg-neon-cyan rounded-full"></motion.div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <div className="p-3 bg-engine-black border-t border-white/10 flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask the Architect..."
                                className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-neon-cyan/50"
                            />
                            <button
                                onClick={handleSend}
                                className="bg-neon-cyan/20 hover:bg-neon-cyan/40 text-neon-cyan p-2 rounded transition-colors"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
