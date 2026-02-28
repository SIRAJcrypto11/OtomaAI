"use server";

import { sql } from "@vercel/postgres";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { error: "Not authenticated" };
        }

        const name = formData.get("name") as string;

        if (!name || name.trim() === "") {
            return { error: "Name cannot be empty" };
        }

        if (process.env.POSTGRES_URL) {
            await sql`
                UPDATE users
                SET name = ${name.trim()}, updated_at = NOW()
                WHERE id = ${session.user.id}
            `;
        } else {
            console.warn("Skipping DB update because POSTGRES_URL is missing.");
        }

        // Revalidate the settings page to show the updated name
        revalidatePath("/dashboard/settings");

        return { success: true };

    } catch (error) {
        console.error("Failed to update profile:", error);
        return { error: "Database error" };
    }
}
