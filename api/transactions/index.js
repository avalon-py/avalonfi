import { db } from "../../lib/firebase.js";
import { verifyWebToken } from "../../lib/auth.js";

export default async function handler(req, res) {

  if (req.method !== "GET")
    return res.status(405).end();

  const { token } = req.query;
  const user = verifyWebToken(token);

  if (!user)
    return res.status(401).json({ error: "Invalid token" });

  const snap = await db
    .collection("transactions")
    .where("userId", "==", user.id)
    .orderBy("createdAt", "desc")
    .limit(200)
    .get();

  const txs = snap.docs.map(doc => {
    const d = doc.data();
    return {
      id: doc.id,
      type: d.type,
      amount: d.amount,
      category: d.category,
      description: d.description,
      date: d.createdAt?.toDate() || new Date(),
    };
  });

  res.json({ transactions: txs });
}
