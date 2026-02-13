import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function Page() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-engine-black bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]">
            <div className="p-8 border border-neon-cyan/20 rounded-xl backdrop-blur-sm bg-black/40 shadow-[0_0_15px_rgba(0,240,255,0.1)]">
                <SignUp
                    appearance={{
                        baseTheme: dark,
                        elements: {
                            formButtonPrimary:
                                "bg-neon-cyan hover:bg-neon-cyan/80 text-engine-black font-bold font-orbitron",
                            card: "bg-transparent shadow-none",
                            headerTitle: "text-neon-cyan font-orbitron",
                            headerSubtitle: "text-gray-400",
                            socialButtonsBlockButton:
                                "border-gray-700 text-gray-300 hover:bg-white/5",
                            formFieldLabel: "text-gray-400",
                            formFieldInput: "bg-white/5 border-gray-700 text-white focus:border-neon-cyan",
                            footerActionLink: "text-neon-cyan hover:text-neon-cyan/80",
                        },
                    }}
                />
            </div>
        </div>
    );
}
