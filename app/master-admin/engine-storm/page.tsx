import { EngineStormCanvas } from "@/components/Canvas/EngineStormCanvas";

export const metadata = {
    title: 'Engine-storm Canvas | Pathfinders Hub',
    description: 'Digital whiteboard for brainstorming and planning',
}

export default function EngineStormPage() {
    return (
        <div className="flex-1 w-full bg-engine-background">
            <div className="mb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">Engine-storm Canvas</h1>
                    <p className="text-gray-400 font-mono text-sm max-w-2xl">
                        An infinite digital whiteboard for mapping out architecture, brainstorming scraping logic, and collecting vision boards. Press F11 or use the fullscreen button to maximize focus.
                    </p>
                </div>
            </div>

            <EngineStormCanvas />
        </div>
    );
}
