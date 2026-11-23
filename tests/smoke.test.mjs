import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { deriveUuid, isUuid } from "../src/lib/uuid.ts";
import { isDemoAuthEnabled, isPostgresConfigured } from "../src/lib/env.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

test("deriveUuid is deterministic and UUID-shaped", () => {
    const a = deriveUuid("telegram-123456");
    const b = deriveUuid("telegram-123456");
    assert.equal(a, b, "same key must derive the same UUID");
    assert.notEqual(a, deriveUuid("telegram-999999"), "different keys must differ");
    assert.match(a, /^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    assert.ok(isUuid(a));
});

test("isUuid rejects non-UUID legacy ids", () => {
    assert.equal(isUuid("ws_1"), false);
    assert.equal(isUuid("agent_1732000000"), false);
    assert.equal(isUuid(null), false);
    assert.equal(isUuid(undefined), false);
});

test("isPostgresConfigured tracks POSTGRES_URL", () => {
    const original = process.env.POSTGRES_URL;
    try {
        delete process.env.POSTGRES_URL;
        assert.equal(isPostgresConfigured(), false);
        process.env.POSTGRES_URL = "postgres://user:pass@host/db";
        assert.equal(isPostgresConfigured(), true);
    } finally {
        if (original === undefined) delete process.env.POSTGRES_URL;
        else process.env.POSTGRES_URL = original;
    }
});

test("demo auth is disabled in production unless explicitly allowed", () => {
    const savedEnv = { ...process.env };
    try {
        process.env.NODE_ENV = "production";
        delete process.env.NEXUS_ALLOW_DEMO_AUTH;
        assert.equal(isDemoAuthEnabled(), false);

        process.env.NEXUS_ALLOW_DEMO_AUTH = "true";
        assert.equal(isDemoAuthEnabled(), true);

        process.env.NODE_ENV = "development";
        delete process.env.NEXUS_ALLOW_DEMO_AUTH;
        assert.equal(isDemoAuthEnabled(), true);
    } finally {
        process.env.NODE_ENV = savedEnv.NODE_ENV;
        if (savedEnv.NEXUS_ALLOW_DEMO_AUTH === undefined) delete process.env.NEXUS_ALLOW_DEMO_AUTH;
        else process.env.NEXUS_ALLOW_DEMO_AUTH = savedEnv.NEXUS_ALLOW_DEMO_AUTH;
    }
});

test("schema.sql contains every column the server actions query", () => {
    const schema = readFileSync(join(root, "src", "lib", "db", "schema.sql"), "utf8");
    const required = [
        "password",          // users: credentials login
        "type TEXT",         // agents: dashboard type mapping
        "role TEXT",         // agents: dashboard type mapping
        "agent_id UUID",     // messages: per-agent metrics
        "session_id TEXT",   // messages: external conversation key
        "action TEXT",       // usage_logs: recent activity feed
        "details TEXT",      // usage_logs: recent activity feed
        "ADD COLUMN IF NOT EXISTS", // incremental migration for existing DBs
    ];
    for (const needle of required) {
        assert.ok(schema.includes(needle), `schema.sql missing: ${needle}`);
    }
});

test("encryption round-trips with dev key and validates configured keys", async () => {
    const savedKey = process.env.ENCRYPTION_KEY;
    const savedNodeEnv = process.env.NODE_ENV;
    try {
        delete process.env.ENCRYPTION_KEY;
        process.env.NODE_ENV = "development";
        const { encrypt, decrypt } = await import("../src/lib/encryption.ts");
        const secret = "sk-my-byok-key-123";
        const encrypted = encrypt(secret);
        assert.notEqual(encrypted, secret);
        assert.equal(decrypt(encrypted), secret);

        process.env.ENCRYPTION_KEY = "too-short";
        assert.throws(() => encrypt("x"), /32/);

        process.env.ENCRYPTION_KEY = "0".repeat(64); // valid 32-byte hex key
        const enc2 = encrypt(secret);
        assert.equal(decrypt(enc2), secret);
    } finally {
        if (savedKey === undefined) delete process.env.ENCRYPTION_KEY;
        else process.env.ENCRYPTION_KEY = savedKey;
        process.env.NODE_ENV = savedNodeEnv;
    }
});

test("production refuses to encrypt without ENCRYPTION_KEY", async () => {
    const savedKey = process.env.ENCRYPTION_KEY;
    const savedNodeEnv = process.env.NODE_ENV;
    try {
        delete process.env.ENCRYPTION_KEY;
        process.env.NODE_ENV = "production";
        const { encrypt } = await import("../src/lib/encryption.ts");
        assert.throws(() => encrypt("x"), /ENCRYPTION_KEY is required in production/);
    } finally {
        if (savedKey === undefined) delete process.env.ENCRYPTION_KEY;
        else process.env.ENCRYPTION_KEY = savedKey;
        process.env.NODE_ENV = savedNodeEnv;
    }
});
