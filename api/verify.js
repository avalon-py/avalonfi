import { verifyWebToken } from "../lib/auth.js";

export default async function handler(req, res) {
  const { token } = req.query;

  const user = verifyWebToken(token);
  if (!user) return res.status(401).json({ error: "Invalid token" });

  res.json({
    id: user.id,
    username: user.username,
  });
}
