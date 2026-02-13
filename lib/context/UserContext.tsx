"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AgentProfile, HardwareItem } from "@/lib/brain";
import { useUser as useClerkUser, useClerk } from "@clerk/nextjs";

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
    login: () => void; // Redirects to Clerk login
    logout: () => void; // Clerk logout
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
    const { user: clerkUser, isLoaded: isClerkLoaded, isSignedIn } = useClerkUser();
    const { signOut, openSignIn } = useClerk();

    const [user, setUser] = useState<UserState>(defaultUser);
    const [isLoading, setIsLoading] = useState(true);

    // Sync Clerk user with our local state/DB
    useEffect(() => {
        if (!isClerkLoaded) return;

        if (isSignedIn && clerkUser) {
            // In a real app, we would fetch the BALANCE and INVENTORY from our DB API here.
            // For now, we'll simulate fetching or use local storage as a cache, 
            // but rely on Clerk for identity.

            // TODO: Fetch from /api/user/me to get real DB data (credits, etc)
            const saved = localStorage.getItem(`sphere_user_${clerkUser.id}`);
            const savedData = saved ? JSON.parse(saved) : {};

            setUser({
                name: clerkUser.fullName || clerkUser.firstName || "User",
                email: clerkUser.primaryEmailAddress?.emailAddress || "",
                avatar: clerkUser.imageUrl,
                balance: savedData.balance || 1000, // Starter credits
                hiredAgents: savedData.hiredAgents || [],
                inventory: savedData.inventory || [],
                isLoggedIn: true,
                role: "user" // We could fetch this from publicMetadata if synced
            });
        } else {
            setUser(defaultUser);
        }
        setIsLoading(false);
    }, [isClerkLoaded, isSignedIn, clerkUser]);

    // Save state changes (mock DB persistence)
    useEffect(() => {
        if (user.isLoggedIn && clerkUser) {
            localStorage.setItem(`sphere_user_${clerkUser.id}`, JSON.stringify({
                balance: user.balance,
                hiredAgents: user.hiredAgents,
                inventory: user.inventory
            }));
        }
    }, [user, clerkUser]);

    const login = () => {
        openSignIn();
    };

    const logout = () => {
        signOut();
        setUser(defaultUser);
    };

    const hireAgent = async (agent: AgentProfile, cost: number) => {
        if (user.balance < cost) return false;
        if (user.hiredAgents.includes(agent.id)) return false;

        // TODO: Call API to deduct credits in DB
        setUser(prev => ({
            ...prev,
            balance: prev.balance - cost,
            hiredAgents: [...prev.hiredAgents, agent.id]
        }));
        return true;
    };

    const buyHardware = async (itemId: string, cost: number) => {
        if (user.balance < cost) return false;

        // TODO: Call API to deduct credits in DB
        setUser(prev => ({
            ...prev,
            balance: prev.balance - cost,
            inventory: [...prev.inventory, itemId]
        }));
        return true;
    };

    const addBalance = (amount: number) => {
        // This would normally be a Stripe webhook result
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
