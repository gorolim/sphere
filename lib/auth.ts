import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "@/auth.config";

export const { auth, signIn, signOut, handlers } = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    providers: [
        Credentials({
            name: "Master Access",
            credentials: {
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const masterPassword = process.env.ADMIN_PASSWORD;

                if (!masterPassword) {
                    console.error("ADMIN_PASSWORD not set");
                    return null;
                }

                if (credentials?.password === masterPassword) {
                    return {
                        id: "admin-master",
                        name: "The Architect",
                        email: "architect@enginesphere.com",
                        role: "admin"
                    };
                }

                return null;
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).role = token.role;
            }
            return session;
        }
    },
    events: {
        async createUser({ user }) {
            const { triggerAutomation } = await import("@/lib/automation");
            await triggerAutomation("USER_SIGNUP", user);
        }
    },
});
