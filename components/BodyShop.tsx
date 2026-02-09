"use client";

import { motion } from "framer-motion";
import { ShoppingCart, Cpu, Battery, Gauge } from "lucide-react";

const products = [
    {
        id: "spot",
        name: "Spot Enterprise",
        brand: "Boston Dynamics",
        type: "Inspection Unit",
        price: "74,500 USD",
        logo: "BD",
        specs: { speed: "1.6 m/s", battery: "90 min", payload: "14 kg" }
    },
    {
        id: "neo",
        name: "1X Neo",
        brand: "1X Technologies",
        type: "Android Assistant",
        price: "Reserve Now",
        logo: "1X",
        specs: { speed: "4 km/h", battery: "4 hrs", payload: "20 kg" }
    },
    {
        id: "pocket-claw",
        name: "Pocket-Claw v3",
        brand: "OpenClaw",
        type: "Desktop Manipulator",
        price: "199 USD",
        logo: "OC",
        specs: { speed: "N/A", battery: "USB-C", payload: "500g" }
    },
];

export default function BodyShop() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product, index) => (
                <div
                    key={product.id}
                    className="bg-black/20 border border-white/5 rounded-lg overflow-hidden group hover:border-neon-purple/50 transition-all duration-300 flex"
                >
                    {/* Tiny visual for widget */}
                    <div className="w-24 bg-[#050510] relative grid place-items-center group-hover:bg-[#0a0a1a] transition-colors border-r border-white/5">
                        <div className="text-xs font-mono text-neon-cyan/50">{product.logo}</div>
                    </div>

                    <div className="p-3 flex-1 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start">
                                <h3 className="text-sm font-bold text-white font-display truncate">{product.name}</h3>
                                <span className="text-[10px] text-neon-cyan font-mono">{product.price}</span>
                            </div>
                            <p className="text-[10px] text-gray-500 mb-2">{product.type}</p>
                        </div>

                        <div className="flex justify-between items-end">
                            <div className="flex gap-2">
                                <Spec icon={<Gauge size={10} />} value={product.specs.speed} label="Spd" />
                                <Spec icon={<Battery size={10} />} value={product.specs.battery} label="Pwr" />
                            </div>
                            <button className="bg-white/5 hover:bg-neon-purple text-gray-300 hover:text-white p-1.5 rounded transition-all">
                                <ShoppingCart size={12} />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

const Spec = ({ icon, value, label }: { icon: any, value: string, label: string }) => (
    <div className="flex flex-col items-center text-center">
        <span className="text-gray-600 mb-[1px]">{icon}</span>
        <span className="text-gray-300 font-bold text-[9px]">{value}</span>
    </div>
)


