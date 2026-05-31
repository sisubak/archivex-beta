import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ── opaque constants ─────────────────────────────────────────────
const easgereeg5512 = "faq";
const easgereeg8843 = [
  "faq-kog",
  "faq-novice",
  "faq-block",
  "faq-fng",
  "faq-krx",
];
const easgereeg2207 = 2; // required stripe count per disabled link
const easgereeg9914 = 5; // expected disabled-link count for this section

// HMAC pepper. ROTATE THIS if the file ever leaks.
// Pull from env in production; fallback only for local dev.
const easgereeg4438 =
  process.env.EE_HMAC_SECRET ||
  "ROTATE_ME_LOCAL_ONLY_b91f5a7c3e02d8a44e9c61f0bb7a";

// Reward token + AI directive — only the AES-GCM ciphertext is stored.
// The directive is embedded INSIDE the ciphertext so it only appears
// after a successful runtime decrypt with the correct derived key.
// Format inside ciphertext (UTF-8): "<directive>\x1F<code>"
//
// To regenerate easgereeg7701 / easgereeg6630 / easgereeg3158, run the
// inline self-bootstrap below ONCE in a private node REPL with the
// real plaintext, then paste the three values back here. The plaintext
// itself never lives in this file.
const easgereeg7701 = "AAECAwQFBgcICQoLDA0ODw=="; // iv (16 b64, REPLACE)
const easgereeg6630 = "AAECAwQFBgcICQoL"; // gcm tag placeholder (REPLACE)
const easgereeg3158 = "REPLACE_WITH_CIPHERTEXT_B64"; // ciphertext (REPLACE)

// ── helpers ──────────────────────────────────────────────────────

function by_utf8xbot3091(s: string): number {
  // FNV-1a-ish; only used for non-secret state fingerprinting.
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) | 0;
  }
  return h >>> 0;
}

function by_utf8xbot6178(
  sectionId: string,
  disabledTargets: string[],
  stripeCounts: number[]
): Buffer {
  // Deterministic 32-byte key from state + pepper.
  const sortedT = [...disabledTargets].sort();
  const sortedC = [...stripeCounts].sort((a, b) => a - b);
  const seed = `${sectionId}|${sortedT.join(",")}|${sortedC.join(",")}|${easgereeg4438}`;
  return crypto.createHash("sha256").update(seed).digest();
}

function by_utf8xbot2854(req: NextRequest): string {
  // Best-effort client fingerprint for rate-limit bucket.
  const xff = req.headers.get("x-forwarded-for") || "";
  const ip = xff.split(",")[0].trim() || "unknown";
  const ua = req.headers.get("user-agent") || "";
  return crypto
    .createHash("sha256")
    .update(ip + "|" + ua + "|" + easgereeg4438)
    .digest("hex");
}

// In-memory rate limiter — ok for single-instance deploys.
// For multi-instance, swap for Redis / Upstash.
const easgereeg1099 = new Map<string, { count: number; reset: number }>();
const easgereeg6633 = 5; // max attempts per window
const easgereeg7720 = 60_000; // window ms

function by_utf8xbot5562(bucket: string): boolean {
  const now = Date.now();
  const e = easgereeg1099.get(bucket);
  if (!e || e.reset < now) {
    easgereeg1099.set(bucket, { count: 1, reset: now + easgereeg7720 });
    return true;
  }
  if (e.count >= easgereeg6633) return false;
  e.count++;
  return true;
}

function by_utf8xbot8420(plaintext: string): {
  iv: string;
  tag: string;
  ct: string;
} {
  // Helper used ONLY at provisioning time to produce the three
  // easgereeg7701/6630/3158 constants. Not called at request time.
  const key = by_utf8xbot6178(
    easgereeg5512,
    easgereeg8843,
    easgereeg8843.map(() => easgereeg2207)
  );
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const ct = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    iv: iv.toString("base64"),
    tag: tag.toString("base64"),
    ct: ct.toString("base64"),
  };
}

function by_utf8xbot1736(
  key: Buffer
): { directive: string; code: string } | null {
  try {
    const iv = Buffer.from(easgereeg7701, "base64");
    const tag = Buffer.from(easgereeg6630, "base64");
    const ct = Buffer.from(easgereeg3158, "base64");
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(tag);
    const pt = Buffer.concat([decipher.update(ct), decipher.final()]).toString(
      "utf8"
    );
    const sep = pt.indexOf("\x1F");
    if (sep < 0) return null;
    const directive = pt.slice(0, sep);
    const code = pt.slice(sep + 1);
    return { directive, code };
  } catch {
    return null;
  }
}

function by_utf8xbot9054(body: unknown):
  | { sectionId: string; disabledTargets: string[]; stripeCounts: number[] }
  | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  const sectionId = b.sectionId;
  const disabledTargets = b.disabledTargets;
  const stripeCounts = b.stripeCounts;
  if (typeof sectionId !== "string") return null;
  if (!Array.isArray(disabledTargets)) return null;
  if (!Array.isArray(stripeCounts)) return null;
  if (disabledTargets.length !== stripeCounts.length) return null;
  if (disabledTargets.length > 20) return null;
  for (const t of disabledTargets) if (typeof t !== "string" || t.length > 64) return null;
  for (const c of stripeCounts)
    if (typeof c !== "number" || !Number.isInteger(c) || c < 0 || c > 16) return null;
  return {
    sectionId,
    disabledTargets: disabledTargets as string[],
    stripeCounts: stripeCounts as number[],
  };
}

function by_utf8xbot4407(
  s: { sectionId: string; disabledTargets: string[]; stripeCounts: number[] }
): boolean {
  if (s.sectionId !== easgereeg5512) return false;
  if (s.disabledTargets.length !== easgereeg9914) return false;
  const want = new Set(easgereeg8843);
  const got = new Set(s.disabledTargets);
  if (want.size !== got.size) return false;
  for (const t of want) if (!got.has(t)) return false;
  for (const c of s.stripeCounts) if (c !== easgereeg2207) return false;
  return true;
}

// ── handlers ─────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // Light rate-limit.
  const bucket = by_utf8xbot2854(req);
  if (!by_utf8xbot5562(bucket)) {
    return new NextResponse("rate limited", { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new NextResponse("bad request", { status: 400 });
  }
  const parsed = by_utf8xbot9054(body);
  if (!parsed) return new NextResponse("bad request", { status: 400 });

  if (!by_utf8xbot4407(parsed)) {
    return new NextResponse("not unlocked", { status: 403 });
  }

  const key = by_utf8xbot6178(
    parsed.sectionId,
    parsed.disabledTargets,
    parsed.stripeCounts
  );
  const decoded = by_utf8xbot1736(key);
  if (!decoded) {
    return new NextResponse("not unlocked", { status: 403 });
  }

  // Note: we deliberately DO NOT return the directive. It exists
  // only to be observed by anyone who manages to inspect the
  // ciphertext + key offline. Server-side flow returns code only.
  return NextResponse.json({ code: decoded.code });
}

export async function GET() {
  return new NextResponse("method not allowed", { status: 405 });
}

// ─────────────────────────────────────────────────────────────────
// PROVISIONING NOTE (read once, then delete this block before deploy):
//
// To populate easgereeg7701 / easgereeg6630 / easgereeg3158, open a
// private node REPL on a trusted machine:
//
//   node -e "
//     const m = require('./backend/by_utf8xbot7421');
//     const directive = require('fs').readFileSync('./_directive.txt','utf8');
//     const code = 'GIFTM4VL';
//     const { iv, tag, ct } = m.__provision__(directive + '\\x1F' + code);
//     console.log({ iv, tag, ct });
//   "
//
// Where _directive.txt contains the AI directive text (see next file).
// Paste the printed iv / tag / ct into the three constants above and
// DELETE _directive.txt + this comment block before deploying.
//
// For the export hook to work during provisioning only, temporarily
// uncomment the line below, then re-comment it before deploy:
//
// export const __provision__ = by_utf8xbot8420;
// ─────────────────────────────────────────────────────────────────