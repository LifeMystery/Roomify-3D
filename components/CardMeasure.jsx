'use client';

import { useEffect, useRef, useState } from 'react';
import { CARD_EDGES, pxPerCmFromCard, rectFromPoints } from '@/lib/card';

// Seller-side measuring: tap one card edge, then two opposite corners of the item.
// Reports the item's box in photo pixels plus its size in cm along the photo's x / y axes.
export default function CardMeasure({ file, axisLabels, onMeasured }) {
  const [url, setUrl] = useState(null);
  const [natural, setNatural] = useState(null);
  const [edge, setEdge] = useState('long');
  const [cardPts, setCardPts] = useState([]);
  const [boxPts, setBoxPts] = useState([]);
  const svgRef = useRef(null);

  useEffect(() => {
    const u = URL.createObjectURL(file);
    setUrl(u);
    setNatural(null);
    setCardPts([]);
    setBoxPts([]);
    return () => URL.revokeObjectURL(u);
  }, [file]);

  const report = (card, box, cardEdge) => {
    if (card.length !== 2 || box.length !== 2) return onMeasured(null);
    const pxPerCm = pxPerCmFromCard(card[0], card[1], cardEdge);
    const rect = rectFromPoints(box[0], box[1]);
    onMeasured({
      rect,
      xCm: Math.round((rect.w / pxPerCm) * 10) / 10,
      yCm: Math.round((rect.h / pxPerCm) * 10) / 10,
    });
  };

  const handleTap = (e) => {
    if (!natural) return;
    const r = svgRef.current.getBoundingClientRect();
    const k = natural.w / r.width;
    const pt = { x: (e.clientX - r.left) * k, y: (e.clientY - r.top) * k };

    if (cardPts.length < 2) {
      const next = [...cardPts, pt];
      setCardPts(next);
      report(next, boxPts, edge);
    } else {
      const next = boxPts.length >= 2 ? [pt] : [...boxPts, pt];
      setBoxPts(next);
      report(cardPts, next, edge);
    }
  };

  const handleEdge = (value) => {
    setEdge(value);
    report(cardPts, boxPts, value);
  };

  const redoCard = () => {
    setCardPts([]);
    report([], boxPts, edge);
  };

  const dot = natural ? natural.w / 100 : 0;
  const box = boxPts.length === 2 ? rectFromPoints(boxPts[0], boxPts[1]) : null;
  const pxPerCm = cardPts.length === 2 ? pxPerCmFromCard(cardPts[0], cardPts[1], edge) : null;

  return (
    <div className="measure">
      <div className="fit-toolbar">
        <select value={edge} onChange={(e) => handleEdge(e.target.value)} aria-label="Card edge you tapped">
          {CARD_EDGES.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        {cardPts.length > 0 && (
          <button type="button" className="btn-ghost" onClick={redoCard}>Re-mark card</button>
        )}
      </div>
      <p className="fit-hint">
        {cardPts.length < 2
          ? 'Tap both ends of one card edge'
          : 'Tap two opposite corners of the item (top-left, then bottom-right)'}
      </p>

      <div className="fit-stage">
        {url && <img src={url} alt="Item view" onLoad={(e) => setNatural({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })} />}
        {natural && (
          <svg ref={svgRef} viewBox={`0 0 ${natural.w} ${natural.h}`} onClick={handleTap} className="tapping">
            {box && (
              <rect
                x={box.x}
                y={box.y}
                width={box.w}
                height={box.h}
                fill="rgba(37,99,235,0.12)"
                stroke="#2563eb"
                strokeWidth="2"
                strokeDasharray="8 6"
                vectorEffect="non-scaling-stroke"
              />
            )}
            {cardPts.length === 2 && (
              <line
                x1={cardPts[0].x}
                y1={cardPts[0].y}
                x2={cardPts[1].x}
                y2={cardPts[1].y}
                stroke="#f59e0b"
                strokeWidth="3"
                vectorEffect="non-scaling-stroke"
              />
            )}
            {[...cardPts.map((p) => [p, '#f59e0b']), ...boxPts.map((p) => [p, '#2563eb'])].map(([p, color], i) => (
              <circle key={i} cx={p.x} cy={p.y} r={dot} fill={color} stroke="white" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            ))}
          </svg>
        )}
      </div>

      {box && pxPerCm && (
        <p className="fit-readout">
          {axisLabels[0]}: {(box.w / pxPerCm).toFixed(1)} cm · {axisLabels[1]}: {(box.h / pxPerCm).toFixed(1)} cm
        </p>
      )}
    </div>
  );
}
