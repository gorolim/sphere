"use client";

import { useState, useEffect, useRef } from "react";
import { AgentProfile } from "@/lib/brain";
import { Send, Terminal, Cpu, User, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AgentChatProps {
    agent: AgentProfile;
}

interface Message {
    role: "user" | "agent";
    content: string;
    timestamp: number;
}

export default function AgentChat({ agent }: AgentChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Load Memory
    useEffect(() => {
        const memoryKey = `chat_memory_${agent.id}`;
        const saved = localStorage.getItem(memoryKey);
        if (saved) {
            setMessages(JSON.parse(saved));
        } else {
            // Initial Greeting if no memory
            const greeting: Message = {
                role: "agent",
                content: `Protocol initiated. I am ${agent.name}. My specialization is ${agent.specs.specialization}. How can I assist your objectives?`,
                timestamp: Date.now()
            };
            setMessages([greeting]);
        }
    }, [agent.id]);

    // Save Memory
    useEffect(() => {
        if (messages.length > 0) {
            const memoryKey = `chat_memory_${agent.id}`;
            localStorage.setItem(memoryKey, JSON.stringify(messages));
            scrollToBottom();
        }
    }, [messages, agent.id]);

    const scrollToBottom = () => {
        setTimeout(() => {
            scrollRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    const handleClearMemory = () => {
        if (confirm("Reset neural pathways for this agent?")) {
            localStorage.removeItem(`chat_memory_${agent.id}`);
            setMessages([]);
            setTimeout(() => {
                setMessages([{
                    role: "agent",
                    content: `System reset complete. Memory cache cleared. Ready for new input.`,
                    timestamp: Date.now()
                }]);
            }, 500);
        }
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = {
            role: "user",
            content: input,
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        // Simulate Thinking / Response
        const processingTime = 1500 + Math.random() * 2000;

        setTimeout(() => {
            const responses = [
                `Analyzing request within the parameters of ${agent.field}...`,
                `My ${agent.specs.manifestation} protocols suggest this is feasible.`,
                `Calculating efficiency gain... Result: Negligible unless we optimize further.`,
                `As a ${agent.role}, I interpret this as a call for evolution.`,
                `The ${agent.specs.specialization} data supports your hypothesis.`,
                `I have updated my internal model based on your input.`,
                `Interesting. This aligns with the mission of ${agent.specs.mission}.`,
            ];

            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            const logicResponse = `[${agent.specs.specialization.toUpperCase()} OUTPUT]: ${randomResponse} (Latency: ${(Math.random() * 10).toFixed(2)}ms)`;

            const agentMsg: Message = {
                role: "agent",
                content: logicResponse,
                timestamp: Date.now()
            };

            setMessages(prev => [...prev, agentMsg]);
            setIsTyping(false);
        }, processingTime);
    };

    return (
        <div className="bg-[#0a0a15] border border-white/10 rounded-xl overflow-hidden flex flex-col h-[500px]">
            {/* Header */}
            <div className="bg-white/5 p-4 border-b border-white/10 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-neon-cyan/10 flex items-center justify-center text-neon-cyan border border-neon-cyan/20">
                        <Terminal size={14} />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm text-white flex items-center gap-2">
                            Direct Link <span className="text-neon-cyan text-[10px] bg-neon-cyan/10 px-1.5 rounded animate-pulse">LIVE</span>
                        </h3>
                        <div className="text-[10px] text-gray-500 font-mono">Channel: {agent.id}</div>
                    </div>
                </div>
                <button
                    onClick={handleClearMemory}
                    className="text-gray-600 hover:text-red-400 transition-colors"
                    title="Clear Memory"
                >
                    <Trash2 size={16} />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-sm scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {messages.map((msg, i) => (
                    <motion.div
                        key={msg.timestamp}
                        initial={{ opacity: 0, x: msg.role === "agent" ? -20 : 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${msg.role === "agent"
                                ? "bg-neon-cyan/5 border-neon-cyan/20 text-neon-cyan"
                                : "bg-white/5 border-white/10 text-white"
                            }`}>
                            {msg.role === "agent" ? <Cpu size={14} /> : <User size={14} />}
                        </div>
                        <div className={`p-3 rounded-lg max-w-[80%] ${msg.role === "agent"
                                ? "bg-neon-cyan/5 border border-neon-cyan/10 text-gray-300"
                                : "bg-white/10 border border-white/10 text-white"
                            }`}>
                            <div className="text-[10px] opacity-30 mb-1 mb-1">
                                {new Date(msg.timestamp).toLocaleTimeString()}
                            </div>
                            {msg.content}
                        </div>
                    </motion.div>
                ))}

                {isTyping && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-3"
                    >
                        <div className="w-8 h-8 rounded-full bg-neon-cyan/5 border border-neon-cyan/20 text-neon-cyan flex items-center justify-center shrink-0 animate-pulse">
                            <Cpu size={14} />
                        </div>
                        <div className="bg-neon-cyan/5 border border-neon-cyan/10 p-3 rounded-lg text-neon-cyan text-xs flex items-center gap-1">
                            <span>Thinking</span>
                            <span className="animate-bounce">.</span>
                            <span className="animate-bounce delay-100">.</span>
                            <span className="animate-bounce delay-200">.</span>
                        </div>
                    </motion.div>
                )}
                <div ref={scrollRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-black/40 border-t border-white/10">
                <div className="flex gap-2">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder={`Query ${agent.name}...`}
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-neon-cyan/50 placeholder-gray-600 transition-colors"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isTyping}
                        className="bg-neon-cyan/10 hover:bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30 rounded-lg px-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
