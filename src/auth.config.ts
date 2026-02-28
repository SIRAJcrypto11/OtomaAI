import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

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
                    // Check database if env is configured
                    if (process.env.POSTGRES_URL) {
                        const { sql } = await import("@vercel/postgres");
                        const bcrypt = await import("bcryptjs");

                        const { rows } = await sql`SELECT * FROM users WHERE email = ${email}`;
                        if (rows.length > 0) {
                            const user = rows[0];
                            const passwordsMatch = await bcrypt.compare(password, user.password);

                            if (passwordsMatch) {
                                return {
                                    id: user.id,
                                    name: user.name,
                                    email: user.email,
                                    role: user.role || 'Operator',
                                    workspace_id: user.workspace_id
                                } as any;
                            }
                            return null;
                        }
                    }

                    // Fallback to Predefined Accounts if no DB connection is present 
                    // (Ensure app doesn't crash on initial local runs without DB)
                    const mockUsers = [
                        { id: "admin_id", name: "Super Admin", email: "admin@nexus.ai", role: "Super Admin", workspace_id: "ws_global", password: "admin" },
                        { id: "owner_id", name: "Workspace Owner", email: "owner@nexus.ai", role: "Workspace Owner", workspace_id: "ws_1", password: "owner" },
                        { id: "user_id", name: "Standard User", email: "user@nexus.ai", role: "Operator", workspace_id: "ws_1", password: "user" },
                    ];

                    const mockUser = mockUsers.find(u => u.email === email);
                    if (mockUser && mockUser.password === password) {
                        return {
                            id: mockUser.id,
                            name: mockUser.name,
                            email: mockUser.email,
                            role: mockUser.role,
                            workspace_id: mockUser.workspace_id
                        } as any;
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
        async session({ session, token, user }: { session: any; token?: any; user?: any }) {
            if (session.user) {
                // If using JWT strategy, user data might be in the token
                if (token) {
                    session.user.id = token.sub as string;
                    session.user.role = token.role as string || "Operator";
                    session.user.workspaceId = token.workspaceId as string || null;
                } else if (user) {
                    session.user.id = user.id;
                    session.user.role = user.role || "Operator";
                    session.user.workspaceId = user.workspace_id || null;
                }
            }
            return session;
        },
        async jwt({ token, user, account }) {
            if (user) {
                token.role = (user as any).role || "Operator";
                token.workspaceId = (user as any).workspace_id || null;
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
