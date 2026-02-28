import { NextResponse } from 'next/server';
import { WhatsAppIntegration } from '@/lib/integrations/whatsapp';

// Global reference to keep the connection alive in dev mode 
// In production Vercel (serverless), this won't persist well without a dedicated worker.
// This is suitable for a VPS, local running, or a background worker process.
let whatsappInstance: WhatsAppIntegration | null = null;

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");

    if (action === "start") {
        if (!whatsappInstance) {
            whatsappInstance = new WhatsAppIntegration("nexus-main");
            whatsappInstance.connect();
            return NextResponse.json({ success: true, status: "WhatsApp Headless Service starting. Check server logs for QR Code." });
        }
        return NextResponse.json({ success: true, status: "WhatsApp Headless Service is already running." });
    }

    if (action === "stop") {
        if (whatsappInstance) {
            whatsappInstance.disconnect();
            whatsappInstance = null;
            return NextResponse.json({ success: true, status: "WhatsApp Headless Service stopped." });
        }
        return NextResponse.json({ success: true, status: "WhatsApp Headless Service was not running." });
    }

    // Default status check
    return NextResponse.json({
        success: true,
        service: "WhatsApp Baileys Headless",
        running: !!whatsappInstance
    });
}
