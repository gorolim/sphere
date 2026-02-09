"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, Bot, Terminal, Cpu, CheckCircle, AlertCircle, Loader } from "lucide-react";

interface OrchestratorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (nodes: any[]) => void;
}

type Message = {
    role: 'ai' | 'user';
    text: string;
    type?: 'text' | 'plan' | 'check';
    data?: any;
};

export default function OrchestratorModal({ isOpen, onClose, onGenerate }: OrchestratorModalProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [stage, setStage] = useState<'GREETING' | 'CLARIFYING' | 'PLANNING' | 'CONFIRMING' | 'BUILDING'>('GREETING');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            setMessages([{ role: 'ai', text: "Greetings, Administrator. I am The Orchestrator. What would you like to automate today?" }]);
            setStage('GREETING');
        }
    }, [isOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const simulateTyping = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userMsg = inputValue;
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInputValue("");
        setIsTyping(true);

        // INTELLIGENCE LOGIC SIMULATION
        if (stage === 'GREETING') {
            await simulateTyping(1000);
            if (userMsg.toLowerCase().includes("trend") || userMsg.toLowerCase().includes("social")) {
                setMessages(prev => [...prev, { role: 'ai', text: "I understand you want to build a Social Trend Pipeline. <br/><br/>To ensure I build the correct flow:<br/>1. Are we targeting specific platforms (X, IG, YT)?<br/>2. Do you want to review the content before posting?" }]);
                setStage('CLARIFYING');
            } else {
                setMessages(prev => [...prev, { role: 'ai', text: "I can help with that. Could you provide more specific details on the triggers and actions you need?" }]);
            }
        }
        else if (stage === 'CLARIFYING') {
            await simulateTyping(1200);
            setMessages(prev => [...prev, { role: 'ai', text: "Understood. Analyzing requirements... Checking app connectivity..." }]);

            // Capability Check Simulation
            await simulateTyping(800);
            setMessages(prev => [...prev, {
                role: 'ai',
                text: "Capabilities Verified:",
                type: "check",
                data: [
                    { name: "X (Twitter) API", status: "ready" },
                    { name: "Instagram Business", status: "ready" },
                    { name: "YouTube Studio", status: "ready" },
                    { name: "Content Engine", status: "ready" }
                ]
            }]);

            await simulateTyping(1000);
            setMessages(prev => [...prev, {
                role: 'ai',
                text: "<b>Proposed Workflow Plan:</b><br/>1. <b>Trigger</b>: Search 'Trending Topics' on X & IG.<br/>2. <b>Process</b>: Draft Blog Post (Content Engine).<br/>3. <b>Action</b>: Create IG Post (Image + Caption).<br/>4. <b>Action</b>: Create YT Short (Video from Text).<br/><br/>Shall I proceed with construction?"
            }]);
            setStage('CONFIRMING');
        }
        else if (stage === 'CONFIRMING') {
            if (userMsg.toLowerCase().includes("yes") || userMsg.toLowerCase().includes("proceed") || userMsg.toLowerCase().includes("go")) {
                await simulateTyping(800);
                setMessages(prev => [...prev, { role: 'ai', text: "Initiating construction sequence..." }]);
                await simulateTyping(1500);

                // GENERATE NODES
                const newNodes = [
                    { id: Date.now(), name: "Search Trends (X/IG)", slug: "x", x: 100, y: 200 },
                    { id: Date.now() + 1, name: "Content Engine", slug: "robot", type: "agent", x: 400, y: 200 },
                    { id: Date.now() + 2, name: "Create IG Post", slug: "instagram", x: 750, y: 100 },
                    { id: Date.now() + 3, name: "Create YT Short", slug: "youtube", x: 750, y: 300 },
                ];
                onGenerate(newNodes);
                onClose();
            } else {
                setMessages(prev => [...prev, { role: 'ai', text: "Standing by. What adjustments would you like to make to the plan?" }]);
            }
        }

        setIsTyping(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-[600px] h-[600px] bg-[#0a0a15] border border-neon-purple/50 rounded-2xl shadow-[0_0_50px_rgba(168,85,247,0.2)] flex flex-col overflow-hidden relative"
            >
                {/* Header */}
                <div className="p-4 border-b border-neon-purple/20 bg-neon-purple/5 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-neon-purple/20 grid place-items-center border border-neon-purple/50 text-neon-purple">
                            <Cpu size={18} />
                        </div>
                        <div>
                            <h2 className="font-display font-bold text-white tracking-wide">THE ORCHESTRATOR</h2>
                            <p className="text-[10px] text-neon-purple font-mono">v.9.0.2 // INTERACTIVE MODE</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/40">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                            <div className={`max-w-[85%] p-4 rounded-lg text-sm ${msg.role === 'ai'
                                    ? 'bg-neon-purple/10 border border-neon-purple/20 text-gray-200 rounded-tl-none'
                                    : 'bg-white/10 border border-white/10 text-white rounded-tr-none'
                                }`}>
                                {msg.type === 'check' ? (
                                    <div className="space-y-2">
                                        <p className="font-bold text-neon-purple mb-2 text-xs uppercase tracking-widest">System Check</p>
                                        {msg.data.map((item: any, i: number) => (
                                            <div key={i} className="flex items-center justify-between gap-4 bg-black/20 p-2 rounded border border-white/5">
                                                <span className="font-mono text-xs">{item.name}</span>
                                                <div className="flex items-center gap-1 text-green-400 text-[10px] uppercase font-bold">
                                                    <CheckCircle size={12} /> {item.status}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="leading-relaxed" dangerouslySetInnerHTML={{ __html: msg.text }} />
                                )}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-neon-purple/10 border border-neon-purple/20 p-3 rounded-lg rounded-tl-none flex gap-1 items-center">
                                <span className="w-1.5 h-1.5 bg-neon-purple rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-neon-purple rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                <span className="w-1.5 h-1.5 bg-neon-purple rounded-full animate-bounce [animation-delay:0.4s]"></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-white/10 bg-[#0a0a15] relative">
                    <div className="relative flex items-center gap-2">
                        <div className="absolute left-3 text-neon-purple">
                            <Terminal size={16} />
                        </div>
                        <input
                            type="text"
                            className="w-full bg-black border border-white/20 rounded-lg pl-10 pr-12 py-3 text-sm text-white focus:outline-none focus:border-neon-purple focus:shadow-[0_0_15px_rgba(168,85,247,0.1)] font-mono"
                            placeholder="Type your response..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            autoFocus
                        />
                        <button
                            onClick={handleSend}
                            className="absolute right-2 p-1.5 bg-neon-purple hover:bg-neon-purple/80 text-white rounded-md transition-colors"
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
