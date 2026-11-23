// Central place for runtime configuration checks.
// POSTGRES_URL is the canonical connection string env var (set by Vercel when a
// Vercel Postgres / Neon store is provisioned) and is also what @vercel/postgres resolves.

export function isPostgresConfigured(): boolean {
    return !!process.env.POSTGRES_URL;
}

// Demo (hardcoded) credentials must never unlock a production deployment.
// They stay available in development/test, or when explicitly opted in via
// NEXUS_ALLOW_DEMO_AUTH=true on a preview/staging instance.
export function isDemoAuthEnabled(): boolean {
    return process.env.NEXUS_ALLOW_DEMO_AUTH === "true" || process.env.NODE_ENV !== "production";
}
