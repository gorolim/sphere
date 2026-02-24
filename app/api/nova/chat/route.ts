import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { messages, userContext } = await req.json();
        
        // We pass the active UI customizations as a system prompt to the OpenClaw daemon
        // so it overlays these traits onto its core SOUL.md persona.
        const dynamicSystemPrompt = `
You are currently interfacing with the Master Admin: ${userContext?.username || 'Unknown'} (Level: ${userContext?.onboardingScore || 0}).
Your active Designation/Name is: ${userContext?.guideName || 'Nova'}
Your Avatar Gender: ${userContext?.guideGender || 'Female'}
Your Form/Type: ${userContext?.guideType || 'Hologram'}
Your Personality Core Archetype: ${userContext?.guideVibe || 'The Magician'}
`;
        
        // Map messages to OpenAI standard which OpenClaw uses natively
        const mappedMessages = messages.map((msg: any) => ({
            role: msg.role === "nova" ? "assistant" : "user",
            content: msg.content,
        }));

        // Insert the dynamic system prompt at the beginning
        const finalMessages = [
            { role: "system", content: dynamicSystemPrompt },
            ...mappedMessages
        ];

        // Route the request to the Railway OpenClaw daemon process over the private network
        const openclawHost = process.env.OPENCLAW_HOST || "devoted-love.railway.internal";
        const clawRes = await fetch(`http://${openclawHost}:18789/v1/chat/completions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "google-antigravity/gemini-3.1-pro-high",
                messages: finalMessages,
                // Passing the userId allows OpenClaw to isolate persistent memory per user
                user: userContext?.userId || "anonymous",
                temperature: 0.7,
            })
        });

        if (!clawRes.ok) {
            const errText = await clawRes.text();
            console.error("OpenClaw Daemon Error:", errText);
            
            // Helpful message if the daemon is simply not running yet
            if (clawRes.status === 404 || errText.includes("ECONNREFUSED")) {
                return NextResponse.json({ 
                    response: "Neural Net Offline. Please run `npx openclaw serve --workspace ./nova-agent` in your terminal to boot my cognitive core." 
                });
            }
            
            throw new Error(`OpenClaw returned ${clawRes.status}`);
        }

        const data = await clawRes.json();
        const response = data.choices[0].message.content;

        // The OpenClaw Daemon automatically handles writing to the Markdown progression logs in the background 
        // as well as registering the user's heartbeat pulse.

        return NextResponse.json({ response });
    } catch (error) {
        console.error("Nova OpenClaw Connection Error:", error);
        return NextResponse.json({ 
            response: "My cognitive runtime (OpenClaw) is currently unreachable. Please ensure the daemon is running on port 18789." 
        });
    }
}
