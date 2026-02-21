"use client";

import { useState, useCallback, useEffect } from "react";
import { Tldraw, useEditor, getSnapshot } from "@tldraw/tldraw";
import "@tldraw/tldraw/tldraw.css";
import { Maximize, Minimize, Save, Plus, Trash2, Edit2, Check, RefreshCw } from "lucide-react";
import { getCanvasBoards, getCanvasState, createCanvasBoard, updateCanvasBoard, deleteCanvasBoard } from "@/app/actions/canvas";

// The Tldraw component needs to be rendered client-side, and we need an internal component to access its hooks
function SaveButton({ boardId, title, isSaving, setIsSaving }: any) {
    const editor = useEditor();

    const handleSave = async () => {
        setIsSaving(true);
        const snapshot = getSnapshot(editor.store);
        const statePayload = { document: snapshot };
        
        await updateCanvasBoard(boardId, title, statePayload);
        setIsSaving(false);
    };

    return (
        <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-neon-purple/20 hover:bg-neon-purple/30 border border-neon-purple/50 rounded-lg text-neon-purple text-sm font-bold transition-all"
        >
            {isSaving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
            {isSaving ? "Saving..." : "Save Canvas"}
        </button>
    );
}

export function EngineStormCanvas() {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [boards, setBoards] = useState<any[]>([]);
    const [activeBoardId, setActiveBoardId] = useState<string | null>(null);
    const [activeTitle, setActiveTitle] = useState("Loading...");
    const [canvasKey, setCanvasKey] = useState(0); // Used to force remount Tldraw when switching boards
    const [initialSnapshot, setInitialSnapshot] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);
    
    // Edit title states
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editTitleValue, setEditTitleValue] = useState("");

    // Load available boards on mount
    useEffect(() => {
        loadBoards();
    }, []);

    const loadBoards = async (selectId?: string) => {
        const res = await getCanvasBoards();
        if (res.data) {
            setBoards(res.data);
            if (res.data.length > 0 && !activeBoardId && !selectId) {
                // Select most recently updated board
                loadBoardState(res.data[0].id, res.data[0].title);
            } else if (selectId) {
                const target = res.data.find((b: any) => b.id === selectId);
                if (target) loadBoardState(target.id, target.title);
            }
        } else {
            // First time ever, create one
            handleCreateNew();
        }
    };

    const loadBoardState = async (id: string, title: string) => {
        const res = await getCanvasState(id);
        
        if (res.data) {
            const stateObj = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
            if (stateObj && stateObj.document) {
                setInitialSnapshot(stateObj.document);
            } else {
                setInitialSnapshot(undefined); // Fresh board
            }
        } else {
            setInitialSnapshot(undefined);
        }
        
        // Now set the active board and mount Tldraw
        setActiveBoardId(id);
        setActiveTitle(title);
        setCanvasKey(prev => prev + 1);
    };

    const handleCreateNew = async () => {
        const res = await createCanvasBoard("New Idea Canvas");
        if (res.data) {
            await loadBoards(res.data.id);
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this canvas?")) return;
        
        await deleteCanvasBoard(id);
        if (id === activeBoardId) {
            setActiveBoardId(null); // Reset
            setInitialSnapshot(null);
            loadBoards(); // Will auto-select the next one if it exists
        } else {
            loadBoards(activeBoardId!); // Keep current active and just refresh list
        }
    };

    const handleTitleSave = async () => {
        if (!activeBoardId || !editTitleValue.trim()) {
            setIsEditingTitle(false);
            return;
        }
        
        setActiveTitle(editTitleValue);
        setIsEditingTitle(false);
        await updateCanvasBoard(activeBoardId, editTitleValue);
        
        // Refresh sidebar silently
        const res = await getCanvasBoards();
        if (res.data) setBoards(res.data);
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((err) => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    // Listen for fullscreen changes to update icon state
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    return (
        <div className={`flex flex-col bg-engine-background w-full transition-all ${isFullscreen ? 'fixed inset-0 z-[100] bg-engine-dark' : 'h-[85vh] rounded-xl border border-white/10 overflow-hidden'}`}>
            
            {/* Top Toolbar */}
            <div className="h-14 border-b border-white/10 bg-black/40 px-4 flex items-center justify-between shrink-0">
                
                <div className="flex items-center gap-4">
                    {/* Title Editor */}
                    {isEditingTitle ? (
                        <div className="flex items-center gap-2">
                            <input 
                                type="text"
                                aria-label="Canvas title"
                                value={editTitleValue}
                                onChange={e => setEditTitleValue(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleTitleSave()}
                                className="bg-black/50 border border-white/20 rounded px-2 py-1 text-white font-display text-lg focus:outline-none focus:border-neon-cyan"
                                autoFocus
                            />
                            <button onClick={handleTitleSave} title="Save Title" className="text-green-400 hover:text-green-300">
                                <Check size={18} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 group">
                            <h2 className="text-xl font-display font-bold text-white tracking-widest uppercase">
                                {activeTitle}
                            </h2>
                            <button 
                                onClick={() => {
                                    setEditTitleValue(activeTitle);
                                    setIsEditingTitle(true);
                                }} 
                                title="Edit Title"
                                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white transition-opacity"
                            >
                                <Edit2 size={14} />
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    {activeBoardId && (
                        <SaveButton boardId={activeBoardId} title={activeTitle} isSaving={isSaving} setIsSaving={setIsSaving} />
                    )}
                    
                    <button 
                        onClick={toggleFullscreen}
                        className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/10"
                        title={isFullscreen ? "Exit Fullscreen" : "Fullscreen (F11)"}
                    >
                        {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
                    </button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden relative">
                
                {/* Left Sidebar - Canvas List */}
                <div className="w-64 border-r border-white/10 bg-black/20 flex flex-col shrink-0">
                    <div className="p-3 border-b border-white/5 flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Your Boards</span>
                        <button 
                            onClick={handleCreateNew}
                            className="p-1 hover:bg-white/10 rounded text-neon-cyan transition-colors"
                            title="New Canvas"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {boards.map(board => (
                            <div 
                                key={board.id}
                                onClick={() => loadBoardState(board.id, board.title)}
                                className={`flex items-center justify-between p-2 rounded cursor-pointer group transition-colors text-sm
                                    ${activeBoardId === board.id 
                                        ? 'bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan' 
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'}`}
                            >
                                <span className="truncate pr-2 font-mono">{board.title}</span>
                                <button 
                                    onClick={(e) => handleDelete(e, board.id)}
                                    title="Delete Canvas"
                                    className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                        {boards.length === 0 && (
                            <div className="p-4 text-center text-gray-600 text-sm font-mono">
                                No boards found. Create one to start brainstorming!
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Tldraw Area */}
                <div className="flex-1 relative bg-white/5" style={{ zIndex: 0 }}>
                    {activeBoardId ? (
                        <Tldraw 
                            key={canvasKey}
                            snapshot={initialSnapshot}
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-mono">
                            Select or create a canvas from the sidebar.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
