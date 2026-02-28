import { sql } from "@vercel/postgres";

// We use the 'sql' template literal from @vercel/postgres for easier querying.
// For more complex queries, we can use a library like Kysely or Drizzle in the future.

export const db = sql;

// Helper to check for multi-tenancy isolation
export function withWorkspace(query: string, workspaceId: string) {
    // This is a conceptual helper. For real usage, we should use a query builder.
}
