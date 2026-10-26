'use client';

import { useEffect, useRef, useState } from 'react';
import { CARD_EDGES, distance, pxPerCmFromCard } from '@/lib/card';

const STEPS = {
  calibrate: 'Step 1: Tap both ends of one card edge',
  place: 'Step 2: The item is drawn at real size on your card — drag it to where it would stand. Then press "Measure gap".',
  measure: 'Step 3: Tap both ends of the space you want to fill (e.g. wall to cupboard)',
};

export default function FitInRoom({ item }) {
  const [roomUrl, setRoomUrl] = useState(null);
  const [natural, setNatural] = useState(null); // { w, h } of the room photo
  const [edge, setEdge] = useState('long');
  const [mode, setMode] = useState('calibrate');
  const [cardPts, setCardPts] = useState([]);
  const [measurePts, setMeasurePts] = useState([]);
  const [itemPos, setItemPos] = useState(null); // bottom-centre of the item, photo px
  const [dims, setDims] = useState({ widthCm: '', heightCm: '' });
  const svgRef = useRef(null);
  const dragRef = useRef(null);

  useEffect(() => {
    if (item) setDims({ widthCm: item.widthCm, heightCm: item.heightCm });
  }, [item]);

  useEffect(() => () => roomUrl && URL.revokeObjectURL(roomUrl), [roomUrl]);

  // The room photo never leaves the device, so a visible ID card is never uploaded.
  const handleRoomPhoto = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setRoomUrl(URL.createObjectURL(file));
    setNatural(null);
    setCardPts([]);
    setMeasurePts([]);
    setItemPos(null);
    setMode('calibrate');
  };

  const handleImageLoad = (e) => {
    setNatural({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight });
  };

  const toPhotoPx = (e) => {
    const r = svgRef.current.getBoundingClientRect();
    const k = natural.w / r.width;
    return { x: (e.clientX - r.left) * k, y: (e.clientY - r.top) * k };
  };

  const pxPerCm = cardPts.length === 2 ? pxPerCmFromCard(cardPts[0], cardPts[1], edge) : null;
  const widthCm = Number(dims.widthCm) || 0;
  const heightCm = Number(dims.heightCm) || 0;
  const gapCm = pxPerCm && measurePts.length === 2 ? distance(measurePts[0], measurePts[1]) / pxPerCm : null;

  const handleTap = (e) => {
    if (!natural || mode === 'place') return;
    const pt = toPhotoPx(e);

    if (mode === 'calibrate') {
      const next = cardPts.length >= 2 ? [pt] : [...cardPts, pt];
      setCardPts(next);
      if (next.length === 2) {
        // Start the item where the card is: the buyer put the card where the item would go.
        setItemPos({ x: (next[0].x + next[1].x) / 2, y: Math.max(next[0].y, next[1].y) });
        setMode('place');
      }
    } else {
      setMeasurePts(measurePts.length >= 2 ? [pt] : [...measurePts, pt]);
    }
  };

  const handleItemDown = (e) => {
    if (mode !== 'place') return;
    svgRef.current.setPointerCapture(e.pointerId);
    dragRef.current = { start: toPhotoPx(e), startPos: itemPos };
  };

  const handleMove = (e) => {
    const drag = dragRef.current;
    if (!drag) return;
    const pt = toPhotoPx(e);
    setItemPos({
      x: drag.startPos.x + pt.x - drag.start.x,
      y: drag.startPos.y + pt.y - drag.start.y,
    });
  };

  const handleUp = () => {
    dragRef.current = null;
  };

  const dot = natural ? natural.w / 120 : 0;
  const itemW = pxPerCm ? widthCm * pxPerCm : 0;
  const itemH = pxPerCm ? heightCm * pxPerCm : 0;

  return (
    <section id="viewSpace">
      <div className="section-inner view-space">
        <h2>Fit It With a Photo</h2>
        <p className="subtitle">
          For phones without AR: put any bank, ID or Smart Shopper card where the item would go, then take a photo.
        </p>

        <div className="fit-card">
          <div className="fit-controls">
            <label className="btn-outline fit-file">
              {roomUrl ? 'Change room photo' : 'Take / choose room photo'}
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => handleRoomPhoto(e.target.files?.[0])}
              />
            </label>

            <label className="fit-field">
              Item width (cm)
              <input
                type="number"
                min="1"
                value={dims.widthCm}
                onChange={(e) => setDims({ ...dims, widthCm: e.target.value })}
              />
            </label>
            <label className="fit-field">
              Item height (cm)
              <input
                type="number"
                min="1"
                value={dims.heightCm}
                onChange={(e) => setDims({ ...dims, heightCm: e.target.value })}
              />
            </label>
          </div>

          {roomUrl && (
            <>
              <div className="fit-toolbar">
                <select value={edge} onChange={(e) => setEdge(e.target.value)} aria-label="Card edge you tapped">
                  {CARD_EDGES.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                {['calibrate', 'place', 'measure'].map((m) => (
                  <button
                    key={m}
                    className={`btn-ghost${mode === m ? ' active' : ''}`}
                    disabled={m !== 'calibrate' && !pxPerCm}
                    onClick={() => setMode(m)}
                  >
                    {m === 'calibrate' ? 'Mark card' : m === 'place' ? 'Move item' : 'Measure gap'}
                  </button>
                ))}
              </div>
              <p className="fit-hint">
                {mode !== 'calibrate' && !(widthCm > 0 && heightCm > 0)
                  ? 'Enter the item width and height above so it can be drawn at real size.'
                  : STEPS[mode]}
              </p>

              <div className="fit-stage">
                <img src={roomUrl} alt="Your room" onLoad={handleImageLoad} />
                {natural && (
                  <svg
                    ref={svgRef}
                    viewBox={`0 0 ${natural.w} ${natural.h}`}
                    onClick={handleTap}
                    onPointerMove={handleMove}
                    onPointerUp={handleUp}
                    onPointerCancel={handleUp}
                    className={mode === 'place' ? '' : 'tapping'}
                  >
                    {pxPerCm && itemPos && widthCm > 0 && heightCm > 0 && (
                      <g
                        transform={`translate(${itemPos.x - itemW / 2} ${itemPos.y - itemH})`}
                        onPointerDown={handleItemDown}
                        className="fit-item"
                      >
                        {item?.imageUrl && (
                          <image
                            href={item.imageUrl}
                            width={itemW}
                            height={itemH}
                            preserveAspectRatio="xMidYMax meet"
                            opacity="0.92"
                          />
                        )}
                        <rect
                          width={itemW}
                          height={itemH}
                          fill={item?.imageUrl ? 'none' : 'rgba(37,99,235,0.18)'}
                          stroke="#2563eb"
                          strokeWidth="2"
                          strokeDasharray="8 6"
                          vectorEffect="non-scaling-stroke"
                        />
                      </g>
                    )}

                    <PointPair pts={cardPts} color="#f59e0b" r={dot} />
                    <PointPair pts={measurePts} color="#10b981" r={dot} />
                  </svg>
                )}
              </div>

              <div className="fit-readout">
                {!pxPerCm && <span>Scale not set yet — mark the card first.</span>}
                {pxPerCm && (
                  <span>
                    Item shown at {widthCm || '?'} × {heightCm || '?'} cm
                  </span>
                )}
                {gapCm != null && (
                  <span className={gapCm >= widthCm ? 'fit-ok' : 'fit-bad'}>
                    Gap: {gapCm.toFixed(1)} cm —{' '}
                    {gapCm >= widthCm
                      ? `fits with ${(gapCm - widthCm).toFixed(1)} cm to spare`
                      : `${(widthCm - gapCm).toFixed(1)} cm too narrow`}
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        <p className="video-caption">
          Scale is exact where the card lies, so keep the card flat against the floor or wall where the item will stand.
        </p>
      </div>
    </section>
  );
}

function PointPair({ pts, color, r }) {
  return (
    <g pointerEvents="none">
      {pts.length === 2 && (
        <line
          x1={pts[0].x}
          y1={pts[0].y}
          x2={pts[1].x}
          y2={pts[1].y}
          stroke={color}
          strokeWidth="3"
          vectorEffect="non-scaling-stroke"
        />
      )}
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={r} fill={color} stroke="white" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      ))}
    </g>
  );
}
