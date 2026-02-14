import crypto from "crypto";

const SECRET = process.env.WEB_SHARED_SECRET;
const EXPIRY = 1000 * 60 * 60 * 24 * 7; // 7 days

export function verifyWebToken(token) {
  try {
    const [base, sig] = token.split(".");
    if (!base || !sig) return null;

    const expectedSig = crypto
      .createHmac("sha256", SECRET)
      .update(base)
      .digest("hex");

    if (sig !== expectedSig) return null;

    const payload = JSON.parse(
      Buffer.from(base, "base64url").toString()
    );

    if (Date.now() - payload.ts > EXPIRY)
      return null;

    return payload;
  } catch {
    return null;
  }
}

export function generateWebToken(user) {
  const payload = {
    id: user.id,
    username: user.username || "",
    ts: Date.now(),
  };

  const base = Buffer
    .from(JSON.stringify(payload))
    .toString("base64url");

  const sig = crypto
    .createHmac("sha256", SECRET)
    .update(base)
    .digest("hex");

  return `${base}.${sig}`;
}
