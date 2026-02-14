export function parseMessage(text) {
  const input = text.trim();

  const regex =
    /^([+-])\s*([\d.]+[km]?)\s+(.+?)(?:\s*-\s*(.+))?$/i;

  const match = input.match(regex);
  if (!match) return null;

  const [, sign, rawAmount, rawCategory, rawDescription] = match;

  const amount = parseAmount(rawAmount);
  if (Number.isNaN(amount)) return null;

  return {
    type: sign === "+" ? "income" : "expense",
    amount,
    category: normalizeCategory(rawCategory),
    description: rawDescription ? rawDescription.trim() : "",
  };
}

export function normalizeCategory(category) {
  return category
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

export function parseAmount(raw) {
  const value = raw.toLowerCase();

  if (value.endsWith("k"))
    return parseFloat(value) * 1_000;

  if (value.endsWith("m"))
    return parseFloat(value) * 1_000_000;

  return parseFloat(value);
}
