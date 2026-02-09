"use client";

import { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import { CREATOR_AGENTS } from "@/lib/creators";
import { useSearchParams } from "next/navigation";
import { Video, Sparkles, Clapperboard, Aperture, Sun, Music, Type, MessageSquare, Play, RefreshCw, User, Plus, Trash2, Download, Film, Scissors } from "lucide-react";

// --- Auto-Fill Logic Definitions ---
const VIBE_LOGIC = {
    "Cyber-Noir": {
        bg: "Futuristic metropolis, neon rain, holographic billboards, deep shadows.",
        light: "High contrast, neon blue and pink rim lighting, cinematic darkness.",
        audio: "Synth-wave drone, rain ambience, mechanical hum."
    },
    "Organic Minimalist": {
        bg: "Sunlit studio with plants, soft beige walls, natural textures (wood, linen).",
        light: "Soft diffused daylight, golden hour warmth, low contrast.",
        audio: "Lo-fi beat, birds chirping faintly, soft wind."
    },
    "Corporate Premium": {
        bg: "Modern glass office, city skyline view, sleek metallic surfaces.",
        light: "Clean white professional lighting, sharp focus, neutral tones.",
        audio: "Upbeat corporate melody, crisp technological swooshes."
    },
    "Industrial Raw": {
        bg: "Abandoned warehouse, concrete walls, exposed pipes, dust particles.",
        light: "Warm tungsten practicals, harsh shadows, volumetric haze.",
        audio: "Heavy bass rumble, metallic echoes, raw atmosphere."
    }
};

const PLATFORM_LOGIC = {
    "TikTok": { camera: "9:16 Vertical. Fast dolly-in. Handheld shake.", format: "9:16" },
    "Instagram": { camera: "9:16 Vertical. Smooth gimbal movement. Medium shot.", format: "9:16" },
    "YouTube": { camera: "16:9 Wide. Steady tripod shot. Cinematic composition.", format: "16:9" },
    "LinkedIn": { camera: "16:9. Eye-level professional framing. Static or slow slider.", format: "16:9" },
    "YT Shorts": { camera: "9:16 Vertical. Fast cuts. Dynamic zooming.", format: "9:16" }
};

const PURPOSE_LOGIC = {
    "The Hook": { action: "Sudden movement towards camera, shocking expression, or rapid visual transition." },
    "The Explainer": { action: "Calm hand gestures pointing to floating UI elements. Steady eye contact." },
    "The Social Proof": { action: "Smiling nod, relaxed posture, holding a product or showing a screen." },
    "The Teaser": { action: "Silhouette reveal, slow turn to camera, mysterious lighting shift." },
    "The Personal Brand": { action: "Walking and talking towards camera, confident stride, direct address." }
};

interface TimelineClip {
    id: string;
    url: string; // Placeholder URL
    duration: number;
    prompt: string;
}

export default function VideoStudioContent() {
    const searchParams = useSearchParams();
    const agentId = searchParams?.get("agentId");

    const [selectedAgentId, setSelectedAgentId] = useState(agentId || "");
    const [purpose, setPurpose] = useState("");
    const [vibe, setVibe] = useState("");
    const [platform, setPlatform] = useState("");

    // Editable Fields
    const [sceneSummary, setSceneSummary] = useState("");
    const [background, setBackground] = useState("");
    const [action, setAction] = useState("");
    const [camera, setCamera] = useState("");
    const [lighting, setLighting] = useState("");
    const [audio, setAudio] = useState("");
    const [dialog, setDialog] = useState(""); // New Dialog Field

    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedClip, setGeneratedClip] = useState<TimelineClip | null>(null);
    const [timeline, setTimeline] = useState<TimelineClip[]>([]);

    // Helper: Find selected agent
    const selectedAgent = CREATOR_AGENTS.find(a => a.id === selectedAgentId);

    // --- Auto-Fill Effect ---
    useEffect(() => {
        if (vibe && VIBE_LOGIC[vibe as keyof typeof VIBE_LOGIC]) {
            const v = VIBE_LOGIC[vibe as keyof typeof VIBE_LOGIC];
            setBackground(v.bg);
            setLighting(v.light);
            setAudio(v.audio);
        }
    }, [vibe]);

    useEffect(() => {
        if (platform && PLATFORM_LOGIC[platform as keyof typeof PLATFORM_LOGIC]) {
            const p = PLATFORM_LOGIC[platform as keyof typeof PLATFORM_LOGIC];
            setCamera(p.camera);
        }
    }, [platform]);

    useEffect(() => {
        if (purpose && PURPOSE_LOGIC[purpose as keyof typeof PURPOSE_LOGIC]) {
            const p = PURPOSE_LOGIC[purpose as keyof typeof PURPOSE_LOGIC];
            setAction(p.action);
        }
    }, [purpose]);

    // Construct Scene Summary when components change
    useEffect(() => {
        const agentName = selectedAgent?.name || "The Agent";
        setSceneSummary(`${agentName} performing ${purpose || "action"} in a ${vibe || "studio"} setting.`);
    }, [selectedAgentId, purpose, vibe, selectedAgent]);


    const SAMPLE_VIDEOS = [
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4"
    ];

    const handleGenerate = () => {
        setIsGenerating(true);
        setGeneratedClip(null);
        setTimeout(() => {
            setIsGenerating(false);
            const randomVideo = SAMPLE_VIDEOS[Math.floor(Math.random() * SAMPLE_VIDEOS.length)];
            const newClip: TimelineClip = {
                id: Math.random().toString(36).substr(2, 9),
                url: randomVideo,
                duration: 8,
                prompt: sceneSummary
            };
            setGeneratedClip(newClip);
            // Auto add to timeline? No, let user confirm.
        }, 3000);
    };

    const handleAddToTimeline = () => {
        if (generatedClip) {
            setTimeline([...timeline, generatedClip]);
            setGeneratedClip(null); // Clear preview to get ready for next
            setPurpose(""); // Optional: reset purpose for next clip?
        }
    };

    const handleRemoveClip = (id: string) => {
        setTimeline(timeline.filter(c => c.id !== id));
    };

    return (
        <div className="min-h-screen bg-engine-black text-white font-sans selection:bg-yellow-500 selection:text-black pb-32">
            <NavBar />

            <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* --- Left Column: Controls --- */}
                <div className="lg:col-span-4 space-y-6">
                    <header>
                        <div className="flex items-center gap-2 text-yellow-500 mb-2">
                            <Clapperboard size={20} />
                            <span className="font-mono text-xs tracking-widest uppercase">Admin_Studio_V3</span>
                        </div>
                        <h1 className="text-3xl font-display font-bold">Video Generator</h1>
                        <p className="text-gray-400 text-sm mt-2">Configure Veo Engine parameters.</p>
                    </header>

                    {/* Selectors */}
                    <div className="bg-engine-dark border border-white/10 rounded-xl p-6 space-y-6">

                        {/* 1. Agent Selector with Avatar Preview */}
                        <div>
                            <label className="block text-xs uppercase text-gray-500 font-mono mb-2">1. Select Agent</label>
                            <div className="flex gap-3">
                                <div className={`w-12 h-12 rounded-lg border flex items-center justify-center bg-black/40 overflow-hidden flex-shrink-0 ${selectedAgent ? 'border-yellow-500' : 'border-white/10'}`}>
                                    {selectedAgent ? (
                                        selectedAgent.avatar ? (
                                            <img src={selectedAgent.avatar} alt={selectedAgent.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <User size={24} className="text-yellow-500" />
                                        )
                                    ) : (
                                        <User size={24} className="text-gray-600" />
                                    )}
                                </div>
                                <select
                                    value={selectedAgentId}
                                    onChange={(e) => setSelectedAgentId(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm focus:border-yellow-500 outline-none h-12"
                                >
                                    <option value="">-- Choose Creator --</option>
                                    {CREATOR_AGENTS.map(a => (
                                        <option key={a.id} value={a.id}>{a.name} ({a.vibe})</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs uppercase text-gray-500 font-mono mb-2">2. Purpose</label>
                                <select
                                    value={purpose}
                                    onChange={(e) => setPurpose(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm focus:border-yellow-500 outline-none"
                                >
                                    <option value="">-- Select Purpose --</option>
                                    {Object.keys(PURPOSE_LOGIC).map(k => <option key={k} value={k}>{k}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs uppercase text-gray-500 font-mono mb-2">3. Vibe</label>
                                <select
                                    value={vibe}
                                    onChange={(e) => setVibe(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm focus:border-yellow-500 outline-none"
                                >
                                    <option value="">-- Select Vibe --</option>
                                    {Object.keys(VIBE_LOGIC).map(k => <option key={k} value={k}>{k}</option>)}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs uppercase text-gray-500 font-mono mb-2">4. Platform</label>
                            <select
                                value={platform}
                                onChange={(e) => setPlatform(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm focus:border-yellow-500 outline-none"
                            >
                                <option value="">-- Select Platform --</option>
                                {Object.keys(PLATFORM_LOGIC).map(k => <option key={k} value={k}>{k}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* --- Right Column: Prompt Matrix & Preview --- */}
                <div className="lg:col-span-8 grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Prompt Matrix */}
                    <div className="bg-[#0a0a12] border border-white/10 rounded-xl p-6 relative flex flex-col h-full">
                        <div className="absolute top-6 right-6 text-[10px] font-mono text-gray-500 bg-white/5 px-2 py-1 rounded">AUTO-FILL ACTIVE</div>
                        <h2 className="font-bold flex items-center gap-2 text-lg mb-6"><Sparkles className="text-yellow-500" size={18} /> Prompt Matrix</h2>

                        <div className="space-y-4 flex-1 overflow-y-auto pr-2 max-h-[600px] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                            <div>
                                <label className="block text-[10px] uppercase text-yellow-500 font-mono mb-1 flex items-center gap-2 font-bold"><Type size={12} /> Scene Summary</label>
                                <textarea value={sceneSummary} onChange={(e) => setSceneSummary(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-xs text-white focus:border-yellow-500 outline-none resize-none h-20" />
                            </div>

                            {/* New Dialog Field */}
                            <div>
                                <label className="block text-[10px] uppercase text-white font-mono mb-1 flex items-center gap-2 font-bold"><MessageSquare size={12} className="text-neon-cyan" /> Agent Dialog / Script</label>
                                <textarea
                                    value={dialog}
                                    onChange={(e) => setDialog(e.target.value)}
                                    placeholder="Agent speech..."
                                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-xs text-white focus:border-neon-cyan outline-none resize-none h-20 placeholder:text-gray-600 border-neon-cyan/20"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] uppercase text-gray-500 font-mono mb-1 flex items-center gap-2"><Sun size={12} /> Background</label>
                                    <textarea value={background} onChange={(e) => setBackground(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded p-2 text-[10px] text-gray-300 focus:border-yellow-500 outline-none resize-none h-16" />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase text-gray-500 font-mono mb-1 flex items-center gap-2"><Aperture size={12} /> Action</label>
                                    <textarea value={action} onChange={(e) => setAction(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded p-2 text-[10px] text-gray-300 focus:border-yellow-500 outline-none resize-none h-16" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] uppercase text-gray-500 font-mono mb-1 flex items-center gap-2"><Video size={12} /> Camera</label>
                                    <textarea value={camera} onChange={(e) => setCamera(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded p-2 text-[10px] text-gray-300 focus:border-yellow-500 outline-none resize-none h-16" />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase text-gray-500 font-mono mb-1 flex items-center gap-2"><Sun size={12} /> Light</label>
                                    <textarea value={lighting} onChange={(e) => setLighting(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded p-2 text-[10px] text-gray-300 focus:border-yellow-500 outline-none resize-none h-16" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase text-gray-500 font-mono mb-1 flex items-center gap-2"><Music size={12} /> Audio</label>
                                <input value={audio} onChange={(e) => setAudio(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded p-2 text-[10px] text-gray-300 focus:border-yellow-500 outline-none" />
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-white/10">
                            <button
                                onClick={handleGenerate}
                                disabled={isGenerating || !selectedAgentId}
                                className={`w-full py-3 rounded-lg font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all ${isGenerating
                                    ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                                    : "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black hover:shadow-[0_0_20px_rgba(234,179,8,0.4)]"
                                    }`}
                            >
                                {isGenerating ? (
                                    <><RefreshCw className="animate-spin" size={16} /> Generating...</>
                                ) : (
                                    <><Video size={16} /> Generate 8s Clip</>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Preview / Editor Stage */}
                    <div className="flex flex-col gap-6">
                        <div className="bg-black border border-white/10 rounded-xl p-6 flex-1 flex flex-col items-center justify-center relative overflow-hidden group">
                            {/* Preview Monitor */}
                            {generatedClip ? (
                                <div className="w-full aspect-video bg-black rounded-lg overflow-hidden relative border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.1)] group">
                                    <video
                                        key={generatedClip.id}
                                        src={generatedClip.url}
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                    />

                                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded border border-white/10 z-10">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                            <span className="font-mono text-xs text-white">REC</span>
                                        </div>
                                    </div>

                                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent pointer-events-none">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <div className="font-mono text-xs text-green-400 mb-1">CLIP_ID: {generatedClip.id}</div>
                                                <div className="font-mono text-xs text-gray-400 max-w-md truncate">{generatedClip.prompt}</div>
                                            </div>
                                            <span className="font-mono text-xl font-bold text-white">00:08</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center text-gray-600">
                                    <div className="w-16 h-16 rounded-full bg-white/5 mx-auto mb-4 flex items-center justify-center border border-white/5">
                                        <Video size={32} className="opacity-50" />
                                    </div>
                                    <p className="font-mono text-sm uppercase">No Output Generated</p>
                                </div>
                            )}
                        </div>

                        {/* Add to Timeline Action */}
                        <div className={`transition-all duration-300 ${generatedClip ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4 pointer-events-none'}`}>
                            <button
                                onClick={handleAddToTimeline}
                                className="w-full py-4 bg-green-500 hover:bg-green-400 text-black font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                            >
                                <Plus size={20} /> Add Clip to Timeline
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            {/* --- Bottom: Timeline Editor --- */}
            <div className="fixed bottom-0 left-0 right-0 bg-[#050508] border-t border-white/10 h-32 z-50 px-6 py-4">
                <div className="max-w-7xl mx-auto flex gap-6 h-full">
                    {/* Controls */}
                    <div className="w-48 flex flex-col justify-between border-r border-white/10 pr-6">
                        <div className="text-xs font-mono text-gray-500 uppercase">Total Seq. Time</div>
                        <div className="text-2xl font-mono font-bold text-yellow-500">
                            00:{timeline.length * 8 < 10 ? `0${timeline.length * 8}` : timeline.length * 8}:00
                        </div>
                        <div className="flex gap-2">
                            <button className="flex-1 bg-white/10 hover:bg-white/20 rounded py-1 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                                <Download size={14} />
                            </button>
                            <button className="flex-1 bg-white/10 hover:bg-white/20 rounded py-1 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                                <Scissors size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Timeline Strip */}
                    <div className="flex-1 overflow-x-auto flex items-center gap-2 px-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                        {timeline.length === 0 && (
                            <div className="text-gray-600 font-mono text-xs uppercase flex items-center gap-2 w-full justify-center border-2 border-dashed border-white/5 rounded-lg h-full">
                                <Film size={16} /> Sequence Empty
                            </div>
                        )}

                        {timeline.map((clip, i) => (
                            <div key={clip.id} className="h-full aspect-video bg-gray-800 rounded border border-white/20 relative group flex-shrink-0 cursor-pointer hover:border-yellow-500 transition-colors">
                                <span className="absolute top-1 left-2 text-[10px] font-mono text-white bg-black/50 px-1 rounded z-10">{i + 1}</span>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Video size={20} className="text-white/20" />
                                </div>
                                <button
                                    onClick={() => handleRemoveClip(clip.id)}
                                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                >
                                    <Trash2 size={10} />
                                </button>
                                <div className="absolute bottom-1 right-2 text-[10px] font-mono text-gray-400">8s</div>
                            </div>
                        ))}

                        {/* Ghost slot */}
                        {timeline.length > 0 && (
                            <div className="h-full aspect-video bg-white/5 rounded border-2 border-dashed border-white/10 flex items-center justify-center flex-shrink-0 opacity-50">
                                <Plus size={20} className="text-gray-600" />
                            </div>
                        )}
                    </div>

                    {/* Export Action */}
                    <div className="w-48 border-l border-white/10 pl-6 flex items-center justify-center">
                        <button
                            onClick={() => alert("Exporting sequence to .mp4... (VEO Integration Pending)")}
                            disabled={timeline.length === 0}
                            className="w-full h-12 bg-white text-black font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors shadow-lg shadow-white/5"
                        >
                            <Download size={18} /> Export All
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
