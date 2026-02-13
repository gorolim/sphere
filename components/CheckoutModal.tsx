
"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Zap, Lock } from "lucide-react";

export default function CheckoutModal() {
    const [loading, setLoading] = useState(false);

    const onSubscribe = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/stripe/checkout", {
                method: "POST"
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to create checkout session");
            }
            window.location.href = data.url;
        } catch (error: any) {
            console.error("Payment Error", error);
            alert(`Payment Error: ${error.message || "Something went wrong"}`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            disabled={loading}
            onClick={onSubscribe}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 group"
        >
            {loading ? (
                "Processing..."
            ) : (
                <>
                    <Zap className="group-hover:text-yellow-300 transition-colors" size={20} />
                    Upgrade to Architect
                </>
            )}
        </button>
    );
}
