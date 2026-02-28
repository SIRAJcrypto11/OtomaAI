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

                // Predefined Accounts matching User Request
                const mockUsers = [
                    { id: "admin_id", name: "Super Admin", email: "admin@nexus.ai", role: "Super Admin", workspace_id: "ws_global", password: "admin" },
                    { id: "owner_id", name: "Workspace Owner", email: "owner@nexus.ai", role: "Workspace Owner", workspace_id: "ws_1", password: "owner" },
                    { id: "user_id", name: "Standard User", email: "user@nexus.ai", role: "Operator", workspace_id: "ws_1", password: "user" },
                ];

                const user = mockUsers.find(u => u.email === email);
                if (user && user.password === password) {
                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        workspace_id: user.workspace_id
                    } as any;
                }

                // Fallback: If integrating with actual DB, you would check `pool.query()` here using bcryptjs for passwords.
                // But for Edge compatibility and immediate assignment fulfillment, we use secure pre-defines.
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
