import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevent Next.js from trying to statically analyze and bundle Baileys 
  // along with its dynamic imports (jimp, sharp, etc.) that crash the build.
  serverExternalPackages: ['@whiskeysockets/baileys', 'pino', 'qrcode-terminal'],
};

export default nextConfig;
