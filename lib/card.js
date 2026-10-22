// Every ISO/IEC 7810 ID-1 card is the same size: bank cards, smart ID cards,
// Smart Shopper / loyalty cards, driving licence cards.
export const CARD_MM = { long: 85.6, short: 53.98 };

export const CARD_EDGES = [
  { value: 'long', label: 'Long edge (8.56 cm)' },
  { value: 'short', label: 'Short edge (5.40 cm)' },
];

export function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function rectFromPoints(a, b) {
  return { x: Math.min(a.x, b.x), y: Math.min(a.y, b.y), w: Math.abs(a.x - b.x), h: Math.abs(a.y - b.y) };
}

// Photo pixels per real-world cm, from two taps on the ends of one card edge.
// Only accurate on the plane the card lies on, so the card should sit where the item will go.
export function pxPerCmFromCard(a, b, edge = 'long') {
  return distance(a, b) / (CARD_MM[edge] / 10);
}
