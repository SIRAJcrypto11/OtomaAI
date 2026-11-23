import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { isDemoAuthEnabled, isPostgresConfigured } from "./lib/env";

export const authConfig = {
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const email = credentials.email as string;
                const password = credentials.password as string;

                try {
                    // Primary path: bcrypt verification against the users table
                    if (isPostgresConfigured()) {
                        const { sql } = await import("@vercel/postgres");
                        const bcrypt = await import("bcryptjs");

                        const { rows } = await sql`SELECT * FROM users WHERE email = ${email}`;
                        if (rows.length > 0) {
                            const user = rows[0];
                            if (!user.password) return null; // OAuth-only account

                            const passwordsMatch = await bcrypt.compare(password, user.password);
                            if (passwordsMatch) {
                                return {
                                    id: user.id,
                                    name: user.name,
                                    email: user.email,
                                    role: user.role || 'Operator',
                                    workspace_id: user.workspace_id
                                };
                            }
                            return null;
                        }
                    }

                    // Fallback to predefined demo accounts only outside production
                    // (or when NEXUS_ALLOW_DEMO_AUTH=true). Never in production.
                    if (isDemoAuthEnabled()) {
                        const { deriveUuid } = await import("./lib/uuid");
                        const mockUsers = [
                            { key: "admin", name: "Super Admin", email: "admin@nexus.ai", role: "Super Admin", workspaceKey: "ws_global", password: "admin" },
                            { key: "owner", name: "Workspace Owner", email: "owner@nexus.ai", role: "Workspace Owner", workspaceKey: "ws_1", password: "owner" },
                            { key: "user", name: "Standard User", email: "user@nexus.ai", role: "Operator", workspaceKey: "ws_1", password: "user" },
                        ];

                        const mockUser = mockUsers.find(u => u.email === email);
                        if (mockUser && mockUser.password === password) {
                            return {
                                id: deriveUuid(`demo-user:${mockUser.key}`),
                                name: mockUser.name,
                                email: mockUser.email,
                                role: mockUser.role,
                                workspace_id: deriveUuid(`demo-workspace:${mockUser.workspaceKey}`)
                            };
                        }
                    }
                } catch (error) {
                    console.error("Auth error:", error);
                    return null;
                }

                return null;
            }
        })
    ],
    callbacks: {
        async session({ session, token, user }) {
            if (session.user) {
                // If using JWT strategy, user data might be in the token
                if (token) {
                    session.user.id = token.sub as string;
                    session.user.role = (token.role as string) || "Operator";
                    session.user.workspaceId = (token.workspaceId as string) ?? null;
                } else if (user) {
                    if (user.id) session.user.id = user.id;
                    session.user.role = user.role || "Operator";
                    session.user.workspaceId = user.workspace_id ?? null;
                }
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role || "Operator";
                token.workspaceId = user.workspace_id ?? null;
            }
            return token;
        }
    },
    pages: {
        signIn: "/login",
        error: "/auth/error",
    },
    trustHost: true,
} satisfies NextAuthConfig;
