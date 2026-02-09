"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AgentProfile, HardwareItem } from "@/lib/brain";

interface UserState {
    name: string;
    email: string; // Fake email for "login"
    avatar: string;
    balance: number; // in SPHERE Credits (or ETH equivalent visually)
    hiredAgents: string[]; // Agent IDs
    inventory: string[]; // Hardware IDs
    isLoggedIn: boolean;
}

interface UserContextType {
    user: UserState;
    login: (name: string) => void;
    logout: () => void;
    hireAgent: (agent: AgentProfile, cost: number) => boolean;
    buyHardware: (itemId: string, cost: number) => boolean;
    addBalance: (amount: number) => void;
}

const defaultUser: UserState = {
    name: "Guest",
    email: "",
    avatar: "",
    balance: 5000, // Starting Credits
    hiredAgents: [],
    inventory: [],
    isLoggedIn: false
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserState>(defaultUser);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from LocalStorage
    useEffect(() => {
        const saved = localStorage.getItem("sphere_user_v1");
        if (saved) {
            setUser(JSON.parse(saved));
        }
        setIsLoaded(true);
    }, []);

    // Save to LocalStorage
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("sphere_user_v1", JSON.stringify(user));
        }
    }, [user, isLoaded]);

    const login = (name: string) => {
        setUser({
            ...user,
            name,
            email: `${name.toLowerCase().replace(" ", ".")}@humans.sphere`,
            isLoggedIn: true,
            // If first time login, maybe give bonus? kept simple for now
        });
    };

    const logout = () => {
        setUser(defaultUser);
        localStorage.removeItem("sphere_user_v1");
    };

    const hireAgent = (agent: AgentProfile, cost: number) => {
        if (user.balance < cost) return false;
        if (user.hiredAgents.includes(agent.id)) return false; // Already hired

        setUser(prev => ({
            ...prev,
            balance: prev.balance - cost,
            hiredAgents: [...prev.hiredAgents, agent.id]
        }));
        return true;
    };

    const buyHardware = (itemId: string, cost: number) => {
        if (user.balance < cost) return false;

        setUser(prev => ({
            ...prev,
            balance: prev.balance - cost,
            inventory: [...prev.inventory, itemId]
        }));
        return true;
    };

    const addBalance = (amount: number) => {
        setUser(prev => ({ ...prev, balance: prev.balance + amount }));
    };

    return (
        <UserContext.Provider value={{ user, login, logout, hireAgent, buyHardware, addBalance }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}
