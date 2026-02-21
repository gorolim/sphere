import { Globe } from "lucide-react";
import { InteractiveGlobe } from "@/components/Canvas/InteractiveGlobe";
import { GenesisSimulation } from "@/components/admin/GenesisSimulation";
import { MerkabahFleet } from "@/components/admin/MerkabahFleet";

export const dynamic = "force-dynamic";

export default function MasterAdminBodyPage() {
    return (
        <div className="flex-1 w-full bg-engine-background flex flex-col items-start p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3">
                    <Globe className="text-green-500 shrink-0" size={32} />
                    The Body 
                </h1>
                <p className="text-gray-400 font-mono mt-2">// THE_TRAVELER_GEOLOCATOR</p>
                <p className="max-w-3xl text-gray-400 mt-4 leading-relaxed">
                    This is the grounding layer representing the physical journey. 
                    Upload raw travel chronicles (photos, messy text logs), and let the Storyteller Agent process and plot them on the interactive globe.
                </p>
            </div>

            {/* Interactive Map */}
            <div className="w-full max-w-6xl mt-4">
                <InteractiveGlobe />
            </div>

            {/* The Merkabah Protocol */}
            <div className="w-full max-w-6xl">
                <MerkabahFleet />
            </div>

            {/* Genesis Simulation */}
            <div className="w-full max-w-6xl mb-12">
                <GenesisSimulation />
            </div>
        </div>
    );
}
