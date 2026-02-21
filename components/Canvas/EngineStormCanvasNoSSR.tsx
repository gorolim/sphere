"use client";

import dynamic from "next/dynamic";

export const EngineStormCanvasNoSSR = dynamic(
    () => import("./EngineStormCanvas").then((mod) => mod.EngineStormCanvas),
    { ssr: false }
);
