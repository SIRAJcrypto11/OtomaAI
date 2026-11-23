import NextAuth, { type DefaultSession } from "next-auth";
import PostgresAdapter from "@auth/pg-adapter";
import { Pool } from "pg";
import { authConfig } from "./auth.config";

// 1. Extend the session user type
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: string;
            workspaceId: string | null;
        } & DefaultSession["user"];
    }

    interface User {
        role?: string;
        workspace_id?: string | null;
    }

    interface AdapterUser {
        role?: string;
        workspace_id?: string | null;
    }
}

// 2. Database Connection (only when configured; keeps local runs without a DB alive)
const pool = process.env.POSTGRES_URL
    ? new Pool({ connectionString: process.env.POSTGRES_URL })
    : null;

// 3. Auth Configuration with Database Adapter
export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    ...(pool ? { adapter: PostgresAdapter(pool) } : {}),
    session: { strategy: "jwt" }, // Required to work seamlessly with middleware
});
