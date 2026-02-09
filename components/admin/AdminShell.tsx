"use client";

import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { Menu } from "lucide-react";

export default function AdminShell({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-engine-black text-white flex font-sans overflow-hidden">
            <AdminSidebar collapsed={collapsed} toggleCollapse={() => setCollapsed(!collapsed)} />

            <main
                className={`flex-1 transition-all duration-300 ease-in-out p-8 overflow-y-auto h-screen bg-engine-black bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0a0a1a] via-engine-black to-black
                ${collapsed ? "ml-20" : "ml-64"}`}
            >
                <div className="max-w-7xl mx-auto h-full flex flex-col">
                    {children}
                </div>
            </main>
        </div>
    );
}
