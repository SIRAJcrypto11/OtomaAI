"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Bot,
  Workflow,
  ShieldCheck,
  Zap,
  Globe,
  ChevronRight,
  MessageSquare,
  BarChart3,
  Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              NEXUS <span className="text-primary">AI</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="#features" className="transition-colors hover:text-primary">Features</Link>
            <Link href="#solutions" className="transition-colors hover:text-primary">Solutions</Link>
            <Link href="#pricing" className="transition-colors hover:text-primary">Pricing</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/api/auth/signin">
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex">Login</Button>
            </Link>
            <Link href="/api/auth/signin">
              <Button size="sm" className="bg-primary hover:bg-primary/90">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="container px-4 mx-auto max-w-7xl relative z-10">
            <div className="max-w-3xl">
              <div>
                <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-6">
                  <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
                  NEXUS AI 2.1 — Sekarang Live!
                </div>
                <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 leading-tight">
                  Infrastruktur Pintar untuk <span className="text-primary">Agent AI</span> Anda.
                </h1>
                <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl">
                  Bangun, orkestrasi, dan skalakan agent AI otonom dalam hitungan menit.
                  Gunakan API Key Anda sendiri (BYOK) dan kendalikan kecerdasan bisnis Anda sepenuhnya.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="h-14 px-8 text-lg bg-primary hover:bg-primary/90">
                    Mulai Sekarang Gratis
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="lg" className="h-14 px-8 text-lg">
                    Lihat Demo
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Subtle Background Pattern */}
          <div className="absolute top-0 right-0 -z-10 w-1/2 h-full opacity-20 pointer-events-none">
            <svg viewBox="0 0 100 100" className="w-full h-full text-foreground">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>
        </section>

        {/* Stats / Proof */}
        <section className="py-12 border-y bg-muted/30">
          <div className="container px-4 mx-auto max-w-7xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">100%</div>
                <div className="text-sm text-muted-foreground uppercase tracking-widest mt-1">BYOK Agnostic</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">24/7</div>
                <div className="text-sm text-muted-foreground uppercase tracking-widest mt-1">Auto-Response</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">0ms</div>
                <div className="text-sm text-muted-foreground uppercase tracking-widest mt-1">Local Latency</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">AES</div>
                <div className="text-sm text-muted-foreground uppercase tracking-widest mt-1">GCM Security</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24">
          <div className="container px-4 mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl mb-4">Fitur Utama Platform</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Segala yang Anda butuhkan untuk menjalankan infrastruktur AI modern kelas dunia.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card
                icon={<Workflow />}
                title="Visual Workflow Builder"
                description="Rancang rangkaian aksi kompleks dengan sistem drag-and-drop React Flow yang intuitif."
              />
              <Card
                icon={<ShieldCheck />}
                title="Enterprise-Grade Security"
                description="API Key anda dienkripsi dengan AES-256-GCM. Anda memegang kendali penuh atas kunci tersebut."
              />
              <Card
                icon={<Globe />}
                title="Omni-Channel Integration"
                description="Hubungkan agent Anda ke WhatsApp, Telegram, Discord, dan Email secara bersamaan."
              />
              <Card
                icon={<Zap />}
                title="High-Speed Inference"
                description="Orkestrasi cerdas yang memilih model tercepat (Gemini/Groq) sesuai kebutuhan tugas."
              />
              <Card
                icon={<MessageSquare />}
                title="Multilingual Memory"
                description="Agent mengingat konteks percakapan di berbagai channel dengan Vector Memory terintegrasi."
              />
              <Card
                icon={<BarChart3 />}
                title="Advanced Analytics"
                description="Monitor efisiensi, biaya, dan performa agent Anda secara real-time di dashboard."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-primary text-white">
          <div className="container px-4 mx-auto max-w-7xl text-center">
            <h2 className="text-3xl font-bold sm:text-5xl mb-8">Siap Membangun Masa Depan AI?</h2>
            <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
              Bergabunglah dengan ribuan bisnis yang sudah mengotomatisasi operasional mereka dengan NEXUS AI.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" variant="secondary" className="h-14 px-10 text-lg">
                Daftar Sekarang — Gratis
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-10 text-lg border-white text-white hover:bg-white/10">
                Hubungi Kami
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/20">
        <div className="container px-4 mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold tracking-tight text-foreground">
                NEXUS <span className="text-primary">AI</span>
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2026 NEXUS AI. Dibuat dengan Standar Singularity Architect.
            </div>
            <div className="flex gap-6 text-sm font-medium text-muted-foreground">
              <Link href="#" className="hover:text-primary">Privacy</Link>
              <Link href="#" className="hover:text-primary">Terms</Link>
              <Link href="#" className="hover:text-primary">GitHub</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Card({ icon, title, description }: { icon: React.ReactElement, title: string, description: string }) {
  return (
    <div className="p-8 rounded-2xl border bg-surface hover:border-primary/50 transition-all group">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary transition-colors">
        {React.cloneElement(icon, { className: "h-6 w-6 text-primary group-hover:text-white transition-colors" } as any)}
      </div>
      <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}
