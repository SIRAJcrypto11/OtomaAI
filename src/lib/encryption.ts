import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const KEY_LENGTH = 32;

// Development-only fallback so local runs work without provisioning secrets.
const DEV_FALLBACK_KEY = "01234567890123456789012345678901";

function getKey(): Buffer {
    const raw = process.env.ENCRYPTION_KEY;

    if (!raw) {
        if (process.env.NODE_ENV === "production") {
            throw new Error(
                "ENCRYPTION_KEY is required in production. Generate one with: openssl rand -hex 32"
            );
        }
        return Buffer.from(DEV_FALLBACK_KEY);
    }

    // Accept 64 hex chars or a 32-char passphrase.
    const buffer = /^[0-9a-fA-F]{64}$/.test(raw) ? Buffer.from(raw, "hex") : Buffer.from(raw);
    if (buffer.length !== KEY_LENGTH) {
        throw new Error("ENCRYPTION_KEY must be 64 hex characters (32 bytes) or a 32-character string.");
    }
    return buffer;
}

export function encrypt(text: string): string {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);

    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    const authTag = cipher.getAuthTag().toString("hex");

    // Return IV + AuthTag + EncryptedText
    return `${iv.toString("hex")}:${authTag}:${encrypted}`;
}

export function decrypt(hash: string): string {
    const [ivHex, authTagHex, encryptedText] = hash.split(":");

    if (!ivHex || !authTagHex || !encryptedText) {
        throw new Error("Invalid encryption format");
    }

    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");
    const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv);

    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
}
