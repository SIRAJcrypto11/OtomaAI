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
}

// 2. Database Connection
const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
});

// 3. Auth Configuration with Database Adapter
export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    adapter: PostgresAdapter(pool),
    session: { strategy: "jwt" }, // Required to work seamlessly with middleware
});
