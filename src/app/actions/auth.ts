"use server";

import { sql } from "@vercel/postgres";
import bcrypt from "bcryptjs";
import { isPostgresConfigured } from "@/lib/env";

export async function registerUser(formData: FormData) {
    try {
        if (!isPostgresConfigured()) {
            return { error: "Registration requires a database (set POSTGRES_URL)." };
        }

        const name = (formData.get("name") as string || "").trim();
        const email = (formData.get("email") as string || "").trim().toLowerCase();
        const password = formData.get("password") as string;

        if (!name || !email || !password) {
            return { error: "Missing required fields" };
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return { error: "Please provide a valid email address" };
        }

        if (password.length < 8) {
            return { error: "Password must be at least 8 characters" };
        }

        // Check if user already exists
        const existingInfo = await sql`SELECT id FROM users WHERE email = ${email}`;
        if (existingInfo.rows.length > 0) {
            return { error: "User already exists with this email" };
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user first, then a workspace owned by that user, then link it.
        // users.workspace_id is a UUID FK into workspaces(id), so an ad-hoc string
        // like `ws_${Date.now()}` would violate the schema.
        const { rows: userRows } = await sql`
            INSERT INTO users (name, email, password, role)
            VALUES (${name}, ${email}, ${hashedPassword}, 'Workspace Owner')
            RETURNING id
        `;
        const userId = userRows[0]?.id;
        if (!userId) {
            return { error: "Could not create user record" };
        }

        const { rows: workspaceRows } = await sql`
            INSERT INTO workspaces (name, owner_id)
            VALUES (${`${name}'s Workspace`}, ${userId})
            RETURNING id
        `;
        const workspaceId = workspaceRows[0]?.id;
        if (!workspaceId) {
            await sql`DELETE FROM users WHERE id = ${userId}`;
            return { error: "Could not create workspace record" };
        }

        await sql`
            UPDATE users SET workspace_id = ${workspaceId}, updated_at = NOW()
            WHERE id = ${userId}
        `;

        return { success: true };
    } catch (error) {
        console.error("Registration failed:", error);
        return { error: "Something went wrong during registration." };
    }
}
