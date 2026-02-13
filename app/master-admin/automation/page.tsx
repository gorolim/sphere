"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Play, MoreHorizontal, Settings, X, GripVertical, ZoomIn, ZoomOut, Maximize, Save, FolderOpen, Bot, Sparkles, MessageSquare } from "lucide-react";
import { SPHERE_AGENTS } from "@/lib/brain";
import OrchestratorModal from "@/components/admin/OrchestratorModal";

// --- APP REGISTRY (With Slugs for SimpleIcons) ---
const APP_REGISTRY = {
    "Sphere Agents": SPHERE_AGENTS.map(agent => ({
        name: agent.name,
        slug: "robot",
        type: "agent",
        icon: <Bot size={16} className="text-neon-cyan" />
    })),
    "Orchestration": [
        { name: "The Orchestrator", slug: "orchestrator", type: "orchestrator", icon: <Sparkles size={16} className="text-neon-purple" /> }
    ],
    "Google Suite": [
        { name: "Google Forms", slug: "googleforms" },
        { name: "Google Sheets", slug: "googlesheets" },
        { name: "Google Drive", slug: "googledrive" },
        { name: "Gmail", slug: "gmail" },
        { name: "Google Docs", slug: "googledocs" },
        { name: "Google Calendar", slug: "googlecalendar" },
        { name: "Google Chat", slug: "googlechat" },
        { name: "YouTube", slug: "youtube" },
        { name: "Google Meet", slug: "googlemeet" },
        { name: "Google Analytics", slug: "googleanalytics" }
    ],
    "AI Models": [
        { name: "OpenAI", slug: "openai" },
        { name: "Anthropic", slug: "anthropic" },
        { name: "NVIDIA", slug: "nvidia" },
        { name: "Replicate", slug: "replicate" },
        { name: "ElevenLabs", slug: "elevenlabs" },
    ],
    "Social Media": [
        { name: "Instagram", slug: "instagram" },
        { name: "Facebook", slug: "facebook" },
        { name: "TikTok", slug: "tiktok" },
        { name: "X (Twitter)", slug: "x" },
        { name: "LinkedIn", slug: "linkedin" },
        { name: "Threads", slug: "threads" },
        { name: "Pinterest", slug: "pinterest" },
        { name: "Discord", slug: "discord" },
        { name: "Telegram", slug: "telegram" },
        { name: "Slack", slug: "slack" }
    ],
    "Productivity": [
        { name: "Airtable", slug: "airtable" },
        { name: "Notion", slug: "notion" },
        { name: "Spotify", slug: "spotify" },
        { name: "HubSpot", slug: "hubspot" }
    ]
};

// Mock Saved Workflows
const SAVED_WORKFLOWS = [
    {
        id: 1,
        name: "Daily News Briefing",
        status: "active",
        nodes: [
            { id: 101, name: "RSS Feed", slug: "rss", x: 100, y: 150 },
            { id: 102, name: "Summarizer Agent", slug: "robot", type: "agent", x: 400, y: 150 },
            { id: 103, name: "Slack Notification", slug: "slack", x: 700, y: 150 }
        ]
    },
    {
        id: 2,
        name: "Lead Gen Pipeline",
        status: "paused",
        nodes: [
            { id: 201, name: "Typeform", slug: "typeform", x: 100, y: 200 },
            { id: 202, name: "Lead Qualifier", slug: "robot", type: "agent", x: 400, y: 200 },
            { id: 203, name: "Salesforce", slug: "salesforce", x: 700, y: 100 },
            { id: 204, name: "Mailchimp", slug: "mailchimp", x: 700, y: 300 }
        ]
    },
    {
        id: 3,
        name: "Competitor Watch",
        status: "active",
        nodes: [
            { id: 301, name: "Google Alerts", slug: "google", x: 100, y: 150 },
            { id: 302, name: "Analysis Bot", slug: "robot", type: "agent", x: 400, y: 150 },
            { id: 303, name: "Notion Database", slug: "notion", x: 700, y: 150 }
        ]
    },
];

// Helper for logo URL
const getLogoUrl = (slug: string) => `https://cdn.simpleicons.org/${slug}/white`;

export default function AdminAutomationPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [zoom, setZoom] = useState(1);
    const [showSaved, setShowSaved] = useState(false);
    const [showOrchestrator, setShowOrchestrator] = useState(false);

    // Initial State: Empty or Default
    const [nodes, setNodes] = useState<{ id: number, name: string, slug: string, type?: string, icon?: any, x: number, y: number }[]>([
        { id: 1, name: "Google Forms", slug: "googleforms", x: 100, y: 150 },
        { id: 2, name: "The Architect of Logic", slug: "robot", type: "agent", x: 400, y: 150 },
        { id: 3, name: "Google Sheets", slug: "googlesheets", x: 750, y: 150 },
    ]);
    const [selectedNode, setSelectedNode] = useState<number | null>(null);

    const addNode = (app: any) => {
        if (app.type === 'orchestrator') {
            setShowOrchestrator(true);
            return;
        }

        setNodes(prev => [...prev, {
            id: Date.now(),
            name: app.name,
            slug: app.slug,
            type: app.type,
            icon: app.icon, // Persist the icon component if it exists
            x: 100 + (prev.length * 30),
            y: 150 + (prev.length * 20)
        }]);
    };

    const handleZoom = (delta: number) => {
        setZoom(prev => Math.min(Math.max(prev + delta, 0.5), 2));
    };

    const handleOrchestratorGenerate = (newNodes: any[]) => {
        const processedNodes = newNodes.map(node => ({
            ...node,
            icon: node.type === 'agent' ? <Bot size={16} className="text-neon-cyan" /> : undefined
        }));
        setNodes(processedNodes);
        setZoom(0.9);
    };

    const loadWorkflow = (workflow: any) => {
        // Map nodes to ensure agents have icons
        const restoredNodes = workflow.nodes.map((n: any) => ({
            ...n,
            icon: n.type === 'agent' ? <Bot size={16} className="text-neon-cyan" /> : undefined
        }));
        setNodes(restoredNodes);
        setShowSaved(false);
        setZoom(1);
    };

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col gap-6 relative">

            <OrchestratorModal
                isOpen={showOrchestrator}
                onClose={() => setShowOrchestrator(false)}
                onGenerate={handleOrchestratorGenerate}
            />

            {/* Header */}
            <div className="flex items-center justify-between shrink-0">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white">Workflow Automation</h1>
                    <p className="text-gray-400 font-mono text-sm">Orchestrate complex agent behaviors and integrations.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowOrchestrator(true)}
                        className="px-4 py-2 rounded-lg font-mono text-sm flex items-center gap-2 transition-all bg-neon-purple/20 border border-neon-purple text-neon-purple hover:bg-neon-purple/30 shadow-[0_0_15px_rgba(168,85,247,0.2)] animate-pulse"
                    >
                        <Sparkles size={16} /> ASK ORCHESTRATOR
                    </button>
                    <button
                        onClick={() => setShowSaved(!showSaved)}
                        className={`px-4 py-2 rounded-lg font-mono text-sm flex items-center gap-2 transition-all border ${showSaved ? "bg-neon-cyan/20 border-neon-cyan text-neon-cyan" : "bg-white/5 border-white/10 text-gray-300 hover:text-white"}`}
                    >
                        <FolderOpen size={16} /> Saved Flows
                    </button>
                    <button
                        className="bg-neon-purple hover:bg-neon-purple/80 text-white px-6 py-2 rounded-lg font-mono text-sm flex items-center gap-2 transition-all"
                        title="Run Workflow"
                    >
                        <Play size={16} /> RUN_WORKFLOW
                    </button>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-12 gap-6 min-h-0 relative">

                {/* Saved Workflows Overlay Panel */}
                <AnimatePresence>
                    {showSaved && (
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            className="absolute left-0 top-0 bottom-0 w-80 bg-[#0a0a15] border border-white/10 rounded-xl z-50 shadow-2xl overflow-hidden flex flex-col"
                        >
                            <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
                                <span className="font-mono text-xs uppercase tracking-widest text-gray-400">Project Library</span>
                                <button onClick={() => setShowSaved(false)} className="text-gray-500 hover:text-white"><X size={16} /></button>
                            </div>
                            <div className="p-2 space-y-1 overflow-y-auto flex-1">
                                {SAVED_WORKFLOWS.map(flow => (
                                    <div
                                        key={flow.id}
                                        onClick={() => loadWorkflow(flow)}
                                        className="p-3 hover:bg-white/5 rounded-lg cursor-pointer group transition-colors block"
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-bold text-gray-200 group-hover:text-neon-cyan transition-colors">{flow.name}</h3>
                                            <span className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded border ${flow.status === 'active' ? 'border-green-500/30 text-green-500 bg-green-500/10' :
                                                    flow.status === 'paused' ? 'border-yellow-500/30 text-yellow-500 bg-yellow-500/10' :
                                                        'border-gray-500/30 text-gray-500 bg-gray-500/10'
                                                }`}>{flow.status}</span>
                                        </div>
                                        <div className="text-xs text-gray-500 flex gap-4">
                                            <span>{flow.nodes.length} Nodes</span>
                                            <span>Last run: 2h ago</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* LEFT: App Library */}
                <div className="col-span-2 bg-[#050510] border border-white/10 rounded-xl flex flex-col overflow-hidden">
                    <div className="p-3 border-b border-white/10 bg-white/5">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 text-gray-500" size={14} />
                            <input
                                type="text"
                                placeholder="Search..."
                                title="Search for an app"
                                className="w-full bg-black/50 border border-white/10 rounded-lg pl-8 pr-2 py-1.5 text-xs text-white focus:outline-none focus:border-neon-purple"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-4 scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">
                        {Object.entries(APP_REGISTRY).map(([category, apps]) => {
                            // Type assertion for apps to handle the mixed array types
                            const filteredApps = (apps as any[]).filter(app => app.name.toLowerCase().includes(searchQuery.toLowerCase()));
                            if (filteredApps.length === 0) return null;

                            return (
                                <div key={category}>
                                    <h3 className={`text-[9px] font-mono uppercase mb-2 px-2 tracking-wider ${category === 'Sphere Agents' ? 'text-neon-cyan font-bold' : 'text-gray-600'}`}>{category}</h3>
                                    <div className="space-y-0.5">
                                        {filteredApps.map(app => (
                                            <button
                                                key={app.name}
                                                onClick={() => addNode(app)}
                                                className={`w-full text-left px-2 py-2 rounded hover:bg-white/5 text-gray-300 hover:text-white text-xs flex items-center gap-2 group transition-colors ${app.type === 'agent' ? 'hover:bg-neon-cyan/5 hover:text-neon-cyan' :
                                                        app.type === 'orchestrator' ? 'hover:bg-neon-purple/5 hover:text-neon-purple font-bold' : ''
                                                    }`}
                                            >
                                                <div className={`w-5 h-5 grid place-items-center opacity-70 group-hover:opacity-100 transition-opacity ${app.type === 'agent' ? 'text-neon-cyan' :
                                                        app.type === 'orchestrator' ? 'text-neon-purple' : ''
                                                    }`}>
                                                    {app.type === 'agent' || app.type === 'orchestrator' ? app.icon : <img src={getLogoUrl(app.slug)} alt={app.name} className="w-4 h-4" />}
                                                </div>
                                                <span className="truncate">{app.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* CENTER: Canvas */}
                <div className="col-span-7 bg-[#0a0a15] rounded-xl border border-white/10 relative overflow-hidden group">
                    {/* Grid Background */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
                        backgroundImage: "radial-gradient(#4a4a5a 1px, transparent 1px)",
                        backgroundSize: `${20 * zoom}px ${20 * zoom}px`
                    }}></div>

                    {/* Floating Orchestrator Token (Merlin Style) */}
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowOrchestrator(true)}
                        className="absolute bottom-8 right-8 w-14 h-14 bg-neon-purple rounded-full shadow-[0_0_30px_rgba(168,85,247,0.4)] z-50 flex items-center justify-center text-white border-2 border-white/20 animate-pulse"
                        title="Call The Orchestrator"
                    >
                        <Sparkles size={24} />
                    </motion.button>

                    {/* Zoom Controls (Shifted Left because of FAB) */}
                    <div className="absolute bottom-4 left-4 flex gap-2 bg-black/50 backdrop-blur rounded-lg border border-white/10 p-1 z-40">
                        <button onClick={() => handleZoom(0.1)} className="p-2 hover:bg-white/10 rounded text-gray-400 hover:text-white" title="Zoom In"><ZoomIn size={16} /></button>
                        <button onClick={() => setZoom(1)} className="p-2 hover:bg-white/10 rounded text-gray-400 hover:text-white font-mono text-[10px]" title="Reset Zoom">{Math.round(zoom * 100)}%</button>
                        <button onClick={() => handleZoom(-0.1)} className="p-2 hover:bg-white/10 rounded text-gray-400 hover:text-white" title="Zoom Out"><ZoomOut size={16} /></button>
                    </div>

                    {/* Nodes Container with Zoom */}
                    <div className="w-full h-full p-8 relative overflow-hidden"
                        style={{ transform: `scale(${zoom})`, transformOrigin: "top left" }}
                    >
                        {/* Connecting Lines */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
                            {nodes.map((node, i) => {
                                if (i === nodes.length - 1) return null;
                                const nextNode = nodes[i + 1];
                                return (
                                    <line
                                        key={`line-${i}`}
                                        x1={node.x + 190} y1={node.y + 35}
                                        x2={nextNode.x} y2={nextNode.y + 35}
                                        stroke="#4a4a5a" strokeWidth="2" strokeDasharray="5,5"
                                    />
                                )
                            })}
                        </svg>

                        <AnimatePresence>
                            {nodes.map((node, i) => (
                                <motion.div
                                    key={node.id}
                                    layoutId={node.id.toString()}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className={`absolute w-48 bg-[#1a1a25] border ${selectedNode === node.id
                                            ? 'border-neon-purple shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                                            : node.type === 'agent' ? 'border-neon-cyan/30 shadow-[0_0_10px_rgba(6,182,212,0.1)]' : 'border-white/10'
                                        } rounded-lg shadow-xl cursor-pointer z-10 hover:border-white/30 transition-colors group/node`}
                                    style={{ left: node.x, top: node.y }}
                                    drag
                                    dragMomentum={false}
                                    onClick={() => setSelectedNode(node.id)}
                                >
                                    <div className={`p-3 border-b flex items-center justify-between bg-white/5 ${node.type === 'agent' ? 'border-neon-cyan/20' : 'border-white/5'}`}>
                                        <div className="flex items-center gap-3">
                                            {node.type === 'agent' ? (
                                                <div className="text-neon-cyan"><Bot size={20} /></div>
                                            ) : (
                                                <img src={getLogoUrl(node.slug)} alt={node.name} className="w-5 h-5 opacity-80 group-hover/node:opacity-100 transition-opacity" />
                                            )}
                                            <span className={`text-xs font-bold truncate max-w-[100px] ${node.type === 'agent' ? 'text-neon-cyan' : 'text-gray-200'}`}>{node.name}</span>
                                        </div>
                                        <div className="flex gap-1">
                                            <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? "bg-green-500" : "bg-gray-600"}`}></div>
                                        </div>
                                    </div>
                                    <div className="p-3">
                                        <div className="text-[9px] text-gray-500 font-mono mb-1">Step {i + 1}</div>
                                        <div className="text-xs text-gray-400">
                                            {node.type === 'agent' ? "Process Data" : i === 0 ? "Trigger" : "Action"}
                                        </div>
                                    </div>

                                    {/* Connectors */}
                                    {i !== 0 && <div className="absolute left-[-5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-neon-purple rounded-full border border-[#1a1a25]"></div>}
                                    {i !== nodes.length - 1 && <div className="absolute right-[-5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-gray-500 rounded-full border border-[#1a1a25]"></div>}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* RIGHT: Configuration */}
                <div className="col-span-3 bg-[#050510] border border-white/10 rounded-xl flex flex-col">
                    <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
                        <span className="font-mono text-xs uppercase tracking-widest text-gray-500">Config_Panel</span>
                        <Settings size={14} className="text-gray-500" />
                    </div>

                    <div className="p-6 flex-1 overflow-y-auto">
                        {selectedNode ? (
                            <div className="space-y-6">
                                <div className={`flex items-center gap-4 mb-8 p-4 rounded-xl border ${nodes.find(n => n.id === selectedNode)?.type === 'agent' ? 'bg-neon-cyan/5 border-neon-cyan/20' : 'bg-white/5 border-white/5'
                                    }`}>
                                    <div className={`w-12 h-12 rounded-lg grid place-items-center border ${nodes.find(n => n.id === selectedNode)?.type === 'agent' ? 'bg-neon-cyan/20 border-neon-cyan/30 text-neon-cyan' : 'bg-black/50 border-white/10'
                                        }`}>
                                        {nodes.find(n => n.id === selectedNode)?.type === 'agent' ? (
                                            <Bot size={24} />
                                        ) : (
                                            <img src={getLogoUrl(nodes.find(n => n.id === selectedNode)?.slug || "")} className="w-6 h-6" alt="Node Icon" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className={`font-bold text-lg leading-tight ${nodes.find(n => n.id === selectedNode)?.type === 'agent' ? 'text-neon-cyan' : 'text-white'}`}>
                                            {nodes.find(n => n.id === selectedNode)?.name}
                                        </h3>
                                        <p className="text-xs text-green-400 font-mono flex items-center gap-1 mt-1">● Connected</p>
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider" htmlFor="operation-select">
                                            {nodes.find(n => n.id === selectedNode)?.type === 'agent' ? "Task Mode" : "Operation"}
                                        </label>
                                        <select
                                            id="operation-select"
                                            className="w-full bg-black border border-white/10 rounded px-3 py-2.5 text-sm focus:border-neon-purple outline-none transition-colors"
                                        >
                                            {nodes.find(n => n.id === selectedNode)?.type === 'agent' ? (
                                                <>
                                                    <option>Analyze Input</option>
                                                    <option>Generate Content</option>
                                                    <option>Execute Logic</option>
                                                    <option>Research Query</option>
                                                </>
                                            ) : (
                                                <>
                                                    <option>Create New Item</option>
                                                    <option>Update Existing</option>
                                                    <option>Get Item By ID</option>
                                                    <option>Search / List</option>
                                                </>
                                            )}
                                        </select>
                                    </div>

                                    {nodes.find(n => n.id === selectedNode)?.type !== 'agent' && (
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider" htmlFor="credential-select">Credential</label>
                                            <select
                                                id="credential-select"
                                                className="w-full bg-black border border-white/10 rounded px-3 py-2.5 text-sm focus:border-neon-purple outline-none transition-colors"
                                            >
                                                <option>Default (Admin)</option>
                                                <option>Service Account 1</option>
                                            </select>
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider" htmlFor="input-payload">
                                            {nodes.find(n => n.id === selectedNode)?.type === 'agent' ? "Context / Instructions" : "Input Payload"}
                                        </label>
                                        <div className="relative">
                                            <textarea
                                                id="input-payload"
                                                className={`w-full bg-black border rounded px-3 py-3 text-xs font-mono h-48 focus:border-neon-purple outline-none resize-none leading-relaxed ${nodes.find(n => n.id === selectedNode)?.type === 'agent' ? 'border-neon-cyan/30 text-neon-cyan' : 'border-white/10 text-green-400'
                                                    }`}
                                                defaultValue={`{\n  "source": "trigger",\n  "timestamp": 1709234,\n  "data": {\n    "priority": "high"\n  }\n}`}
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-white/10">
                                    <button className="w-full bg-white/5 hover:bg-neon-purple hover:text-white border border-white/10 hover:border-transparent text-gray-300 py-3 rounded font-mono text-xs transition-all uppercase tracking-wider">
                                        Test Action
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-500 text-center">
                                <GripVertical size={32} className="mb-4 opacity-50" />
                                <p className="text-sm">Select a node to configure</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
