import { createHash } from "crypto";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: string | null | undefined): boolean {
    return !!value && UUID_PATTERN.test(value);
}

/**
 * Deterministically derive a UUID (v5-style, SHA-1) from an arbitrary string key.
 * Used to persist conversations whose external ids (Telegram chat id, WhatsApp
 * JID) are not UUIDs into UUID-keyed Postgres tables without collisions.
 *
 * NOTE: uses node:crypto — import dynamically from edge/proxy code paths.
 */
export function deriveUuid(key: string): string {
    const hex = createHash("sha1").update(`nexus:conv:${key}`).digest("hex").slice(0, 32);
    const chars = hex.split("");
    chars[12] = "5"; // version nibble
    chars[16] = (((parseInt(chars[16], 16) & 0b1011) | 0b1000).toString(16)); // variant nibble
    return [
        chars.slice(0, 8).join(""),
        chars.slice(8, 12).join(""),
        chars.slice(12, 16).join(""),
        chars.slice(16, 20).join(""),
        chars.slice(20, 32).join(""),
    ].join("-");
}
