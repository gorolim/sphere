"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, User, Server } from "lucide-react";
import Image from "next/image";

export default function TheArchitect() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string, data?: any }[]>([
        { role: 'bot', text: "Greetings. I am Nova. My systems are online. How may I assist you with your journey today?" }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const handleSend = () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { role: 'user' as const, text: userMsg }];
        setMessages(newMessages);
        setInput("");
        setIsTyping(true);

        try {
            // Map the format to match what our API expects
            const mappedForApi = newMessages.map(m => ({
                role: m.role === 'bot' ? 'nova' : 'user',
                content: m.text
            }));

            // Pass a generic userContext since public homepage visitors are not logged in
            const res = await fetch('/api/nova/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: mappedForApi,
                    userContext: { username: "Public Visitor", guideName: "Nova", guideVibe: "The Magician" }
                })
            });

            if (res.ok) {
                const data = await res.json();
                setMessages(prev => [...prev, { role: 'bot', text: data.response }]);
            } else {
                console.error("Chat API returned status:", res.status);
                setMessages(prev => [...prev, { role: 'bot', text: "Comms interference. Re-establishing link." }]);
            }
        } catch (e) {
            console.error("Chat API error:", e);
            setMessages(prev => [...prev, { role: 'bot', text: "Mainframe Link Severed. Neural net offline." }]);
        } finally {
            setIsTyping(false);
        }
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
                    <span className="font-display font-bold text-neon-cyan text-2xl">N</span>
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
                                <span className="text-neon-cyan font-bold uppercase tracking-wider">Nova</span>
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

                                    {/* Agent and Catalog simulated UI rendering removed */}
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
                                placeholder="Ask Nova..."
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
