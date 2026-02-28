"use server";

import { sql } from "@vercel/postgres";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";

export async function registerUser(formData: FormData) {
    try {
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        if (!name || !email || !password) {
            return { error: "Missing required fields" };
        }

        // Check if user already exists
        const existingInfo = await sql`SELECT id FROM users WHERE email = ${email}`;
        if (existingInfo.rows.length > 0) {
            return { error: "User already exists with this email" };
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Here we assign a new workspace automatically for new signups
        // In a real app we might create a new entry in 'workspaces' table first
        const workspaceId = `ws_${Date.now()}`;

        // Insert user
        await sql`
            INSERT INTO users (name, email, password, role, workspace_id)
            VALUES (${name}, ${email}, ${hashedPassword}, 'Workspace Owner', ${workspaceId})
        `;

        return { success: true };
    } catch (error) {
        console.error("Registration failed:", error);
        return { error: "Something went wrong during registration." };
    }
}
