"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AgentProfile, HardwareItem } from "@/lib/brain";
import { useRouter } from "next/navigation";

interface UserState {
    name: string;
    email: string;
    avatar: string;
    balance: number; // in SPHERE Credits
    hiredAgents: string[]; // Agent IDs
    inventory: string[]; // Hardware IDs
    isLoggedIn: boolean;
    role: string;
}

interface UserContextType {
    user: UserState;
    login: () => void;
    logout: () => void;
    hireAgent: (agent: AgentProfile, cost: number) => Promise<boolean>;
    buyHardware: (itemId: string, cost: number) => Promise<boolean>;
    addBalance: (amount: number) => void;
    isLoading: boolean;
}

const defaultUser: UserState = {
    name: "Guest",
    email: "",
    avatar: "",
    balance: 0,
    hiredAgents: [],
    inventory: [],
    isLoggedIn: false,
    role: "user",
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [user, setUser] = useState<UserState>(defaultUser);
    const [isLoading, setIsLoading] = useState(true);

    // Sync user with local state cache
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const saved = localStorage.getItem(`sphere_user_native`);
                const savedData = saved ? JSON.parse(saved) : null;
                if (savedData) {
                    setUser({
                        name: "Agent",
                        email: "",
                        avatar: "",
                        balance: savedData.balance || 1000, 
                        hiredAgents: savedData.hiredAgents || [],
                        inventory: savedData.inventory || [],
                        isLoggedIn: true,
                        role: "user" 
                    });
                }
            } catch (e) {
                // Handle errors silently on init
            } finally {
                setIsLoading(false);
            }
        };
        fetchUser();
    }, []);

    // Save state changes (mock DB persistence)
    useEffect(() => {
        if (user.isLoggedIn) {
            localStorage.setItem(`sphere_user_native`, JSON.stringify({
                balance: user.balance,
                hiredAgents: user.hiredAgents,
                inventory: user.inventory
            }));
        }
    }, [user]);

    const login = () => {
        router.push("/sign-in");
    };

    const logout = async () => {
        try {
            await fetch("/api/auth/sign-in", { method: "DELETE" });
            setUser(defaultUser);
            router.push("/sign-in");
            router.refresh();
        } catch (e) {}
    };

    const hireAgent = async (agent: AgentProfile, cost: number) => {
        if (user.balance < cost) return false;
        if (user.hiredAgents.includes(agent.id)) return false;

        setUser(prev => ({
            ...prev,
            balance: prev.balance - cost,
            hiredAgents: [...prev.hiredAgents, agent.id]
        }));
        return true;
    };

    const buyHardware = async (itemId: string, cost: number) => {
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
        <UserContext.Provider value={{ user, login, logout, hireAgent, buyHardware, addBalance, isLoading }}>
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
