"use client";

import { useState } from "react";
import { Wallet, Loader2, CheckCircle } from "lucide-react";

export default function WalletConnect() {
    const [status, setStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected");
    const [address, setAddress] = useState("");

    const connect = () => {
        setStatus("connecting");
        setTimeout(() => {
            setStatus("connected");
            setAddress("0x71C...3A9");
        }, 1500);
    };

    if (status === "connected") {
        return (
            <div className="flex items-center gap-2 bg-neon-cyan/10 border border-neon-cyan/50 text-neon-cyan px-4 py-2 rounded-lg font-mono text-sm cursor-pointer hover:bg-neon-cyan/20 transition-all">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                {address}
            </div>
        );
    }

    if (status === "connecting") {
        return (
            <button disabled className="flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-lg font-mono text-sm opacity-80">
                <Loader2 size={16} className="animate-spin" /> CONNECTING...
            </button>
        );
    }

    return (
        <button
            onClick={connect}
            className="flex items-center gap-2 bg-white/5 border border-white/20 hover:bg-white/10 text-white px-4 py-2 rounded-lg font-mono text-sm transition-all hover:scale-105 active:scale-95"
        >
            <Wallet size={16} /> CONNECT_WALLET
        </button>
    );
}
