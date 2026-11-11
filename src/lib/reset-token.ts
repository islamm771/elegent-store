import { createHash, randomBytes } from "crypto";

export const RESET_TTL_MS = 60 * 60 * 1000;   // a link works for 1 hour
export const RESET_COOLDOWN_MS = 60 * 1000;   // at most one email per minute per account
export const RESET_MAX_PER_HOUR = 5;          // and five per hour

/** The random value that goes into the emailed link. Only its hash is stored. */
export const makeToken = () => randomBytes(32).toString("base64url");
export const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");
export const looksLikeToken = (t: unknown): t is string => typeof t === "string" && /^[A-Za-z0-9_-]{40,60}$/.test(t);
