"use server";

import { sql } from "@vercel/postgres";

const defaultTemplates = [
    {
        title: "E-Commerce CS Bot",
        author: "NEXUS Core",
        rating: 4.9,
        downloads: "12.5k",
        description: "Auto-reply untuk toko Shopee & Tokopedia. Mendukung tracking resi dan FAQ produk.",
        tags: ["WhatsApp", "Shopee", "CS"],
        price: "Free",
        color: "bg-blue-600"
    },
    {
        title: "Cold Email Outreach",
        author: "B2B Growth",
        rating: 4.7,
        downloads: "4.2k",
        description: "Agent otonom untuk me-research lead dan mengirim personalized cold email via Gmail.",
        tags: ["Email", "Sales", "B2B"],
        price: "Rp 150k",
        color: "bg-emerald-600"
    },
    {
        title: "Social Media Manager",
        author: "ContentGenius",
        rating: 4.8,
        downloads: "8.9k",
        description: "Generate konten kalender harian, scraping ide dari Twitter, dan auto-post ke Instagram.",
        tags: ["Instagram", "Twitter", "Content"],
        price: "Rp 250k",
        color: "bg-purple-600"
    },
    {
        title: "HR Interview Bot",
        author: "NEXUS Core",
        rating: 4.5,
        downloads: "2.1k",
        description: "Pre-screen kandidat via Telegram. Mengajukan pertanyaan dasar dan menilai jawaban.",
        tags: ["Telegram", "HR", "Recruitment"],
        price: "Free",
        color: "bg-orange-600"
    },
    {
        title: "Lead Magnet Auto-Responder",
        author: "MarketingPro",
        rating: 4.9,
        downloads: "15k",
        description: "Kirim PDF materi setelah user mengisi form. Follow up otomatis di hari ke-3 dan ke-7.",
        tags: ["WhatsApp", "Marketing"],
        price: "Rp 99k",
        color: "bg-rose-600"
    },
    {
        title: "Price Monitor Agent",
        author: "DataScraper",
        rating: 4.6,
        downloads: "3.4k",
        description: "Pantau harga Tokopedia/Shopee kompetitor tiap jam, kirim alert Telegram jika turun.",
        tags: ["Scraper", "Telegram", "E-Commerce"],
        price: "Rp 199k",
        color: "bg-slate-800"
    }
];

export async function getMarketplaceTemplates(searchQuery?: string, category?: string) {
    try {
        if (!process.env.POSTGRES_URL) {
            throw new Error("No Database connected");
        }

        // Ensure table exists
        await sql`
            CREATE TABLE IF NOT EXISTS templates (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                author VARCHAR(255) NOT NULL,
                rating DECIMAL(2,1),
                downloads VARCHAR(50),
                description TEXT,
                tags JSONB,
                price VARCHAR(50),
                color VARCHAR(50)
            )
        `;

        // Check if empty, run seed if so
        const countRes = await sql`SELECT COUNT(*) FROM templates`;
        if (parseInt(countRes.rows[0].count, 10) === 0) {
            for (const t of defaultTemplates) {
                await sql`
                    INSERT INTO templates (title, author, rating, downloads, description, tags, price, color)
                    VALUES (${t.title}, ${t.author}, ${t.rating}, ${t.downloads}, ${t.description}, ${JSON.stringify(t.tags)}, ${t.price}, ${t.color})
                `;
            }
        }

        // Fetch using plain text search for simplicity
        let query = `SELECT * FROM templates WHERE 1=1`;
        const values: any[] = [];
        let valueIndex = 1;

        if (searchQuery) {
            query += ` AND (title ILIKE $${valueIndex} OR description ILIKE $${valueIndex})`;
            values.push(`%${searchQuery}%`);
            valueIndex++;
        }

        if (category && category !== "All") {
            if (category === "Free Templates") {
                query += ` AND price = 'Free'`;
            } else if (category === "Customer Service") {
                query += ` AND tags::text ILIKE '%CS%'`;
            } else if (category === "Sales & Marketing") {
                query += ` AND (tags::text ILIKE '%Sales%' OR tags::text ILIKE '%Marketing%')`;
            } else if (category === "Human Resources") {
                query += ` AND tags::text ILIKE '%HR%'`;
            } else if (category === "Data & Research") {
                query += ` AND tags::text ILIKE '%Scraper%'`;
            }
        }

        const result = await sql.query(query, values);
        return result.rows;

    } catch (error) {
        console.error("Marketplace DB Error, using fallback data:", error);

        // Fallback filtering in memory if database is not available
        let filtered = [...defaultTemplates];

        if (searchQuery) {
            const lowerQ = searchQuery.toLowerCase();
            filtered = filtered.filter(t => t.title.toLowerCase().includes(lowerQ) || t.description.toLowerCase().includes(lowerQ));
        }

        if (category && category !== "All") {
            if (category === "Free Templates") {
                filtered = filtered.filter(t => t.price === 'Free');
            } else if (category === "Customer Service") {
                filtered = filtered.filter(t => t.tags.includes("CS"));
            } else if (category === "Sales & Marketing") {
                filtered = filtered.filter(t => t.tags.includes("Sales") || t.tags.includes("Marketing"));
            } else if (category === "Human Resources") {
                filtered = filtered.filter(t => t.tags.includes("HR"));
            } else if (category === "Data & Research") {
                filtered = filtered.filter(t => t.tags.includes("Scraper"));
            }
        }

        return filtered;
    }
}
