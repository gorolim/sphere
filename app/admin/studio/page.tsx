"use client";

import { Suspense } from "react";
import VideoStudioContent from "@/components/admin/VideoStudioContent";

export default function VideoStudioPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-black text-white font-mono">LOADING STUDIO...</div>}>
            <VideoStudioContent />
        </Suspense>
    );
}
