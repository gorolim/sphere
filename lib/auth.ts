import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/auth/signin", // Custom login page (we need to create this)
    },
    providers: [
        CredentialsProvider({
            name: "Master Access",
            credentials: {
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // [USER REQ]: Master Login System
                const masterPassword = process.env.ADMIN_PASSWORD;

                if (!masterPassword) {
                    throw new Error("ADMIN_PASSWORD not set in environment");
                }

                if (credentials?.password === masterPassword) {
                    // Return the "Admin" user
                    return {
                        id: "admin-master",
                        name: "The Architect",
                        email: "architect@enginesphere.com",
                        role: "admin"
                    };
                }

                return null; // Login failed
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
    }
};
