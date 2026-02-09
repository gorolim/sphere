"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { CREATOR_AGENTS, CreatorAgent } from "@/lib/creators";

interface CreatorContextType {
    creators: CreatorAgent[];
    addCreator: (newAgent: CreatorAgent) => void;
}

const CreatorContext = createContext<CreatorContextType | undefined>(undefined);

export function CreatorProvider({ children }: { children: ReactNode }) {
    const [creators, setCreators] = useState<CreatorAgent[]>(CREATOR_AGENTS);

    const addCreator = (newAgent: CreatorAgent) => {
        setCreators((prev) => [newAgent, ...prev]);
    };

    return (
        <CreatorContext.Provider value={{ creators, addCreator }}>
            {children}
        </CreatorContext.Provider>
    );
}

export function useCreators() {
    const context = useContext(CreatorContext);
    if (context === undefined) {
        throw new Error("useCreators must be used within a CreatorProvider");
    }
    return context;
}
