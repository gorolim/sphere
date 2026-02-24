"use client";

import { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial, Float, Sparkles as DreiSparkles } from "@react-three/drei";
import { X, Send, Cpu, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Generative / Placeholder 3D Model that evolves with Gamification Phases
function NovaAvatar({ user }: { user: any }) {
    const sphereRef = useRef<any>();
    const visualState = user?.agentStat?.avatarVisualState || "energy_orb";

    // Set properties based on Alchemical Engine Phase
    const isWireframe = visualState.includes("wireframe") || visualState.includes("lexicon");
    const isDistorted = visualState === "energy_orb" || visualState.includes("tendrils") || visualState.includes("aura");
    const emissiveIntensity = visualState.includes("glowing") || visualState.includes("enlightened") ? 2 : 0.5;
    const metalness = visualState.includes("material") || visualState.includes("armor") || visualState.includes("enlightened") ? 1 : 0.8;
    const opacity = visualState.includes("orb") || visualState.includes("aura") ? 0.3 : 1;
    const isTransparent = opacity < 1;
    const rotSpeed = visualState === "awakened_eyes" ? 2 : (visualState === "enlightened_world" ? 0.05 : 0.2);

    useFrame((state: any) => {
        if (sphereRef.current) {
            sphereRef.current.rotation.x = state.clock.getElapsedTime() * rotSpeed;
            sphereRef.current.rotation.y = state.clock.getElapsedTime() * (rotSpeed * 1.5);
        }
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={isDistorted ? 2 : 0.5}>
            <Sphere ref={sphereRef} args={[1, 64, 64]} scale={1.2}>
                <MeshDistortMaterial
                    color="#00f3ff"
                    attach="material"
                    distort={isDistorted ? 0.4 : 0}
                    speed={isDistorted ? 2 : 0}
                    roughness={0.2}
                    metalness={metalness}
                    emissive="#00f3ff"
                    emissiveIntensity={emissiveIntensity}
                    wireframe={isWireframe}
                    transparent={isTransparent}
                    opacity={opacity}
                />
            </Sphere>
            <DreiSparkles count={50} scale={3} size={2} speed={0.4} opacity={0.5} color="#c084fc" />
        </Float>
    );
}

export function FloatingCompanion({ user }: { user: any }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: "user" | "nova"; content: string }[]>([
        { role: "nova", content: `I am ${user.guideName || 'Nova'}, your ${user.guideVibe || 'infinite-memory'} Guide Companion. How can we optimize the Nexus today?` }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const handleSend = async () => {
        if (!input.trim() || isTyping) return;

        // Optimistic UI Update
        const newMsg = { role: "user" as const, content: input };
        const updatedMessages = [...messages, newMsg];
        setMessages(updatedMessages);
        setInput("");
        setIsTyping(true);

        try {
            const res = await fetch("/api/nova/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: updatedMessages,
                    userContext: user
                })
            });

            if (res.ok) {
                const data = await res.json();
                setMessages((prev) => [...prev, { role: "nova", content: data.response }]);
            } else {
                setMessages((prev) => [...prev, { role: "nova", content: "Mainframe Link Severed. Neural net offline." }]);
            }
        } catch(e) {
            setMessages((prev) => [...prev, { role: "nova", content: "Comms interference. Re-establishing link." }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-90 flex flex-col items-end">
            
            {/* The Chat Interface Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="w-80 md:w-96 bg-[#0a0a0f] border border-neon-cyan/30 rounded-2xl shadow-[0_0_40px_rgba(0,243,255,0.15)] mb-4 overflow-hidden flex flex-col h-[500px]"
                    >
                        {/* Header */}
                        <div className="bg-black/50 border-b border-neon-cyan/20 p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full border border-neon-cyan bg-neon-cyan/10 flex items-center justify-center relative">
                                    <Sparkles size={14} className="text-neon-cyan" />
                                    <div className="absolute inset-0 rounded-full border border-neon-cyan animate-ping opacity-30"></div>
                                </div>
                                <div>
                                    <h3 className="text-white font-display font-bold uppercase tracking-widest text-sm">{user.guideName || "Nova"}</h3>
                                    <p className="text-[10px] font-mono text-neon-cyan">TYPE: {user.guideType?.toUpperCase() || 'AVATAR'}</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white transition-colors" title="Close Panel" aria-label="Close Companion Panel">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Chat History */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                                        msg.role === "user" 
                                        ? "bg-white text-black font-medium" 
                                        : "bg-neon-cyan/10 border border-neon-cyan/20 text-gray-200"
                                    }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan px-4 py-3 rounded-2xl text-sm italic animate-pulse">
                                         Processing Mainframe data...
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-black/50 border-t border-neon-cyan/20">
                            <div className="bg-[#050510] border border-white/10 rounded-xl flex items-center pr-2 focus-within:border-neon-cyan transition-colors">
                                <input 
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                    placeholder={`Communicate with ${user.guideName || 'Nova'}...`}
                                    className="flex-1 bg-transparent text-white text-sm px-4 py-3 outline-none font-mono"
                                />
                                <button 
                                    onClick={handleSend}
                                    disabled={!input.trim()}
                                    title="Send Message"
                                    className="p-2 text-neon-cyan hover:bg-neon-cyan/20 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* The 3D Floating Orb Trigger */}
            {!isOpen && (
                <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(true)}
                    title="Open Companion"
                    aria-label="Open Companion Panel"
                    className="relative w-20 h-20 rounded-full bg-black/50 border border-neon-cyan/50 backdrop-blur shadow-[0_0_20px_rgba(0,243,255,0.2)] overflow-hidden cursor-pointer group"
                >
                    <div className="absolute inset-0 bg-neon-cyan/10 rounded-full blur-xl group-hover:bg-neon-cyan/30 transition-colors"></div>
                    <div className="w-full h-full relative z-10 drop-shadow-[0_0_15px_rgba(0,243,255,0.5)]">
                        <Canvas camera={{ position: [0, 0, 4], fov: 45 }} className="pointer-events-none">
                            <ambientLight intensity={0.5} />
                            <directionalLight position={[10, 10, 5]} intensity={1.5} />
                            <NovaAvatar user={user} />
                        </Canvas>
                    </div>
                </motion.button>
            )}

            {/* Status Indicator */}
            <div className="absolute bottom-0 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0a0a0f] z-20 shadow-[0_0_10px_#22c55e]"></div>
        </div>
    );
}
