"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Dynamically import Globe to avoid SSR issues with WebGL / window objects
const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

export function InteractiveGlobe({ journeyData = [] }: { journeyData?: any[] }) {
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="animate-pulse w-full h-[500px] bg-black/40 rounded-xl border border-white/10 flex items-center justify-center font-mono text-neon-cyan/50 backdrop-blur-sm">
                INITIALIZING_GLOBE_CORE...
            </div>
        );
    }

    // Generate mock coordinates representing past journeys if DB data is missing
    const gData = journeyData.length > 0 ? journeyData : [...Array(20).keys()].map(() => ({
        lat: (Math.random() - 0.5) * 160,
        lng: (Math.random() - 0.5) * 360,
        size: Math.random() / 3,
        color: ['#00f0ff', '#a855f7', '#22c55e'][Math.round(Math.random() * 2)]
    }));

    return (
        <div className="w-full h-[500px] rounded-xl overflow-hidden border border-white/10 bg-black/40 relative">
            <div className="absolute top-4 left-4 z-10 font-mono text-xs text-neon-cyan bg-black/50 px-3 py-1 rounded border border-neon-cyan/30 backdrop-blur-sm shadow-[0_0_10px_rgba(0,240,255,0.2)] flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse"></div>
                TELEMETRY_ACTIVE
            </div>
            
            <Globe
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
                bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                backgroundColor="rgba(0,0,0,0)" // Seamless blend into the Engine Sphere theme
                pointsData={gData}
                pointAltitude="size"
                pointColor="color"
                pointRadius={0.4}
                pointsMerge={true}
                atmosphereColor="#a855f7"
                atmosphereAltitude={0.2}
            />
        </div>
    );
}
