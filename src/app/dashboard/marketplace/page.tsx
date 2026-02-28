import React from "react";
import { Download, Star, ExternalLink, Search } from "lucide-react";
import Image from "next/image";

export const metadata = {
    title: "Marketplace | NEXUS AI",
};

const templates = [
    {
        id: 1,
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
        id: 2,
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
        id: 3,
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
        id: 4,
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
        id: 5,
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
        id: 6,
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

export default function MarketplacePage() {
    return (
        <div className="flex-1 p-8 overflow-y-auto bg-slate-50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Agent Template Marketplace</h1>
                    <p className="text-slate-500 mt-1">Discover, buy, and deploy ready-made AI agents for your business workflows.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search templates..."
                        className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
                    />
                </div>
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-6 -mx-1 px-1">
                {["All", "Customer Service", "Sales & Marketing", "Human Resources", "Data & Research", "Free Templates"].map((cat, i) => (
                    <button key={i} className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium border ${i === 0 ? 'bg-slate-900 text-white border-transparent' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
                        {cat}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {templates.map((tpl) => (
                    <div key={tpl.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full">
                        <div className={`h-32 w-full ${tpl.color} flex items-center justify-center p-6 relative`}>
                            <h3 className="text-white text-xl font-bold text-center z-10">{tpl.title}</h3>
                            <div className="absolute inset-0 bg-black/10"></div>
                            <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md rounded-md px-2 py-1 flex items-center text-white text-xs font-bold">
                                <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                                {tpl.rating}
                            </div>
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs text-slate-500 font-medium tracking-wide uppercase">By {tpl.author}</span>
                                <span className="text-xs text-slate-500 flex items-center">
                                    <Download className="w-3 h-3 mr-1" />
                                    {tpl.downloads}
                                </span>
                            </div>
                            <p className="text-sm text-slate-700 leading-relaxed flex-1">
                                {tpl.description}
                            </p>
                            <div className="flex gap-2 mt-4 flex-wrap">
                                {tpl.tags.map(tag => (
                                    <span key={tag} className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-[10px] font-semibold uppercase tracking-wider">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                                <span className="font-bold text-slate-900">{tpl.price}</span>
                                <button className="text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                                    {tpl.price === 'Free' ? 'Install' : 'Purchase'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
