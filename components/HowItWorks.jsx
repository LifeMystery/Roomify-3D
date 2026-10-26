'use client';

import { useState } from 'react';

// Same colours the tools use: orange = card, blue = item, green = gap.
const ORANGE = '#f59e0b';
const BLUE = '#2563eb';
const GREEN = '#10b981';
const RED = '#dc2626';

const SELLER_STEPS = [
  {
    title: 'Find any card',
    text: 'Use a bank card, ID card, driving licence or Smart Shopper card. They are all exactly the same size, so the app uses the card like a ruler.',
    tip: 'Cover your card number with your thumb or a sticker if you like — only the card’s shape matters.',
    Picture: CardEdges,
  },
  {
    title: 'Take the photos',
    text: 'Stick or hold the card flat on the item. Take 3 photos: FRONT (stand straight in front), SIDE (stand at the right-hand side) and TOP (from above — optional). The whole item must be inside every photo.',
    tip: 'Hold the phone straight, not tilted. Put the card on the part closest to you.',
    Picture: TakePhoto,
  },
  {
    title: 'Press “Sell an Item”',
    text: 'A window opens with Front, Side and Top tabs. Start on Front and choose your front photo. Do the same steps below for each tab.',
    Picture: OpenWindow,
  },
  {
    title: 'Tap the card (2 taps)',
    text: 'Leave the box on “Long edge”. Tap the LEFT corner of the card’s long side, then the RIGHT corner of the same side. An ORANGE line appears along the card.',
    tip: 'Made a mistake? Press “Re-mark card” and tap again.',
    Picture: TapCard,
  },
  {
    title: 'Tap the item (2 taps)',
    text: 'Now tap the TOP-LEFT corner of the whole item, then the BOTTOM-RIGHT corner. A BLUE dashed box appears around the item and its size (in cm) fills in by itself.',
    tip: 'The blue box must go around the WHOLE item — from the very top to where it touches the floor.',
    Picture: TapItem,
  },
  {
    title: 'Check, name it, list it',
    text: 'Do the Side tab the same way (and Top if you took it). When Front and Side show a ✓, type a name like “Orange chair” and press “List Item”.',
    Picture: WrongBox,
    warn: 'Wrong: if the blue box only goes around the card, your item will come out the size of a card. Tap the corners of the item instead.',
  },
];

const BUYER_STEPS = [
  {
    title: 'Look at the item in 3D',
    text: 'Scroll to “Your Listed Item”. Drag it with your finger to spin it around. The size is shown underneath as Width × Height × Depth in cm.',
    Picture: SpinModel,
  },
  {
    title: 'See it in your room (newer phones)',
    text: 'On your phone, press “View in your room”. Point the camera at the floor. The item appears in your room at its real size — walk around it.',
    tip: 'No “View in your room” button? Your phone can’t do this. Use the photo steps below instead.',
    Picture: PhoneAR,
  },
  {
    title: 'Take a photo of your room',
    text: 'Put your card on the floor or against the wall exactly where the item would go. Take a photo, then press “Take / choose room photo” in “Fit It With a Photo”.',
    Picture: RoomPhoto,
  },
  {
    title: 'Step 1 — Mark card',
    text: 'Tap the left corner of the card’s long side, then the right corner of the same side. An ORANGE line appears. The app now knows how big things are in your photo.',
    Picture: RoomCard,
  },
  {
    title: 'Step 2 — Move item',
    text: 'The item now appears in your photo at its real size, inside a BLUE dashed box. Press on it and drag it to where you want it to stand.',
    tip: 'Nothing appeared? Type the item’s width and height in the boxes above the photo.',
    Picture: RoomMove,
  },
  {
    title: 'Step 3 — Measure gap',
    text: 'Press “Measure gap”. Tap one side of the space, then the other side. A GREEN line appears and the app tells you if the item fits, and how many cm are left over.',
    Picture: RoomGap,
  },
];

export default function HowItWorks({ onSell }) {
  const [who, setWho] = useState('seller');
  const steps = who === 'seller' ? SELLER_STEPS : BUYER_STEPS;

  return (
    <section id="how-it-works">
      <div className="section-inner tutorial">
        <h2>How It Works</h2>
        <p className="subtitle">Simple steps, with pictures. No measuring tape needed.</p>

        <div className="tutorial-tabs">
          <button className={`btn-ghost${who === 'seller' ? ' active' : ''}`} onClick={() => setWho('seller')}>
            I want to sell
          </button>
          <button className={`btn-ghost${who === 'buyer' ? ' active' : ''}`} onClick={() => setWho('buyer')}>
            I want to buy
          </button>
        </div>

        <div className="tutorial-legend">
          <span><i style={{ background: ORANGE }} /> Orange = the card</span>
          <span><i style={{ background: BLUE }} /> Blue = the item</span>
          {who === 'buyer' && <span><i style={{ background: GREEN }} /> Green = the space</span>}
        </div>

        <ol className="tutorial-steps">
          {steps.map(({ title, text, tip, warn, Picture }, i) => (
            <li key={title} className="tutorial-step">
              <div className="tutorial-picture"><Picture /></div>
              <div className="tutorial-body">
                <span className="tutorial-num">{i + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
                {tip && <p className="tutorial-tip">💡 {tip}</p>}
                {warn && <p className="tutorial-warn">⚠️ {warn}</p>}
              </div>
            </li>
          ))}
        </ol>

        {who === 'seller' && (
          <button className="btn-primary" onClick={onSell}>Sell an Item</button>
        )}
      </div>
    </section>
  );
}

/* ── Pictures (240 × 160) ── */

function Frame({ children, label }) {
  return (
    <svg viewBox="0 0 240 160" role="img" aria-label={label}>
      <rect width="240" height="160" rx="10" fill="#f3f4f6" />
      {children}
    </svg>
  );
}

function Tap({ x, y, n, color, below = false }) {
  return (
    <g>
      <circle cx={x} cy={y} r="6" fill={color} stroke="#fff" strokeWidth="2" />
      <text x={x} y={below ? y + 18 : y - 10} textAnchor="middle" fontSize="11" fontWeight="700" fill={color}>{n}</text>
    </g>
  );
}

function Chair({ x = 0, y = 0, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="#9ca3af">
      <rect x="85" y="18" width="70" height="62" rx="6" />
      <rect x="75" y="80" width="90" height="14" rx="3" />
      <rect x="80" y="94" width="12" height="50" />
      <rect x="148" y="94" width="12" height="50" />
    </g>
  );
}

function Card({ x, y, w = 34 }) {
  const h = w / 1.585;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="2" fill="#3b0764" />
      <rect x={x + w * 0.12} y={y + h * 0.3} width={w * 0.18} height={h * 0.25} rx="1" fill="#facc15" />
    </g>
  );
}

function CardEdges() {
  return (
    <Frame label="A card with its long edge (8.56 cm) and short edge (5.40 cm)">
      <rect x="45" y="40" width="150" height="94.6" rx="8" fill="#3b0764" />
      <rect x="62" y="70" width="24" height="18" rx="3" fill="#facc15" />
      <text x="62" y="115" fontSize="11" fill="#e9d5ff" letterSpacing="2">1234 5678 9012</text>
      <line x1="45" y1="40" x2="195" y2="40" stroke={ORANGE} strokeWidth="5" strokeLinecap="round" />
      <text x="120" y="28" textAnchor="middle" fontSize="12" fontWeight="700" fill={ORANGE}>Long edge = 8.56 cm</text>
      <line x1="208" y1="42" x2="208" y2="133" stroke="#6b7280" strokeWidth="2" strokeDasharray="4 3" />
      <text x="222" y="88" textAnchor="middle" fontSize="10" fill="#6b7280" transform="rotate(90 222 88)">Short edge = 5.40 cm</text>
      <Tap x={45} y={40} n="tap" color={ORANGE} />
      <Tap x={195} y={40} n="tap" color={ORANGE} />
    </Frame>
  );
}

function TakePhoto() {
  return (
    <Frame label="Phone taking a photo of a chair with a card on it">
      <Chair x={-40} y={-6} />
      <Card x={63} y={40} />
      <rect x="168" y="45" width="46" height="80" rx="8" fill="#111827" />
      <rect x="172" y="53" width="38" height="62" rx="3" fill="#93c5fd" />
      <circle cx="191" cy="120" r="3" fill="#fff" />
      <path d="M160 85 L130 85" stroke="#6b7280" strokeWidth="2" strokeDasharray="4 3" markerEnd="url(#arrow)" />
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0 L10 5 L0 10z" fill="#6b7280" />
        </marker>
      </defs>
      <text x="120" y="155" textAnchor="middle" fontSize="10" fill="#374151">Front · Side · Top (optional)</text>
    </Frame>
  );
}

function OpenWindow() {
  return (
    <Frame label="The List an Item window with Front, Side and Top tabs">
      <rect x="30" y="18" width="180" height="128" rx="8" fill="#fff" stroke="#e5e7eb" />
      <text x="44" y="38" fontSize="12" fontWeight="700" fill="#111827">List an Item</text>
      <rect x="44" y="48" width="46" height="18" rx="4" fill={BLUE} />
      <text x="67" y="61" textAnchor="middle" fontSize="10" fill="#fff">Front</text>
      <rect x="96" y="48" width="40" height="18" rx="4" fill="#f3f4f6" stroke="#e5e7eb" />
      <text x="116" y="61" textAnchor="middle" fontSize="10" fill="#374151">Side</text>
      <rect x="142" y="48" width="54" height="18" rx="4" fill="#f3f4f6" stroke="#e5e7eb" />
      <text x="169" y="61" textAnchor="middle" fontSize="9" fill="#374151">Top (opt.)</text>
      <rect x="44" y="76" width="152" height="54" rx="6" fill="#f9fafb" stroke="#d1d5db" strokeDasharray="5 4" />
      <text x="120" y="100" textAnchor="middle" fontSize="10" fill="#6b7280">Take / choose</text>
      <text x="120" y="114" textAnchor="middle" fontSize="10" fill="#6b7280">front photo</text>
    </Frame>
  );
}

function TapCard() {
  return (
    <Frame label="Tap the two ends of the card's long edge; an orange line appears">
      <Chair />
      <Card x={103} y={45} />
      <line x1="103" y1="45" x2="137" y2="45" stroke={ORANGE} strokeWidth="3" />
      <Tap x={103} y={45} n="1" color={ORANGE} />
      <Tap x={137} y={45} n="2" color={ORANGE} />
    </Frame>
  );
}

function TapItem() {
  return (
    <Frame label="Tap the top-left and bottom-right corners of the whole chair; a blue box appears">
      <Chair />
      <Card x={103} y={45} />
      <line x1="103" y1="45" x2="137" y2="45" stroke={ORANGE} strokeWidth="3" />
      <rect x="75" y="18" width="90" height="126" fill="rgba(37,99,235,0.1)" stroke={BLUE} strokeWidth="2" strokeDasharray="6 4" />
      <Tap x={75} y={18} n="3" color={BLUE} />
      <Tap x={165} y={144} n="4" color={BLUE} below />
      <text x="200" y="85" textAnchor="middle" fontSize="11" fontWeight="700" fill={GREEN}>✓ Right</text>
    </Frame>
  );
}

function WrongBox() {
  return (
    <Frame label="Wrong: the blue box is only around the card">
      <Chair />
      <Card x={103} y={45} />
      <rect x="101" y="43" width="38" height="25" fill="rgba(37,99,235,0.1)" stroke={BLUE} strokeWidth="2" strokeDasharray="5 3" />
      <line x1="185" y1="60" x2="215" y2="90" stroke={RED} strokeWidth="4" />
      <line x1="215" y1="60" x2="185" y2="90" stroke={RED} strokeWidth="4" />
      <text x="200" y="110" textAnchor="middle" fontSize="11" fontWeight="700" fill={RED}>Wrong</text>
    </Frame>
  );
}

function SpinModel() {
  return (
    <Frame label="A 3D box you can spin with your finger">
      <path d="M90 60 L130 45 L170 60 L130 75 Z" fill="#d1d5db" />
      <path d="M90 60 L130 75 L130 125 L90 110 Z" fill="#9ca3af" />
      <path d="M130 75 L170 60 L170 110 L130 125 Z" fill="#6b7280" />
      <path d="M70 135 Q130 155 190 135" fill="none" stroke="#6b7280" strokeWidth="2" markerEnd="url(#spin)" />
      <defs>
        <marker id="spin" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0 L10 5 L0 10z" fill="#6b7280" />
        </marker>
      </defs>
      <text x="120" y="25" textAnchor="middle" fontSize="11" fill="#374151">Drag to spin</text>
    </Frame>
  );
}

function PhoneAR() {
  return (
    <Frame label="Phone camera showing the item standing in the room">
      <rect x="80" y="10" width="80" height="140" rx="12" fill="#111827" />
      <rect x="86" y="22" width="68" height="116" rx="4" fill="#e5e7eb" />
      <rect x="86" y="100" width="68" height="38" fill="#d6d3d1" />
      <Chair x={70} y={57} s={0.42} />
      <rect x="88" y="122" width="64" height="13" rx="6" fill={BLUE} />
      <text x="120" y="131" textAnchor="middle" fontSize="6" fill="#fff">View in your room</text>
    </Frame>
  );
}

function Room({ children, label }) {
  return (
    <Frame label={label}>
      <rect x="0" y="0" width="240" height="118" rx="10" fill="#e7e5e4" />
      <rect x="0" y="118" width="240" height="42" fill="#d6d3d1" />
      <rect x="12" y="40" width="48" height="78" fill="#a8a29e" />
      <rect x="182" y="40" width="46" height="78" fill="#a8a29e" />
      {children}
    </Frame>
  );
}

function RoomPhoto() {
  return (
    <Room label="Card placed against the wall where the item would go">
      <Card x={104} y={98} w={32} />
      <text x="120" y="150" textAnchor="middle" fontSize="10" fill="#374151">Card where the item will stand</text>
    </Room>
  );
}

function RoomCard() {
  return (
    <Room label="Tap both ends of the card's long edge in the room photo">
      <Card x={104} y={98} w={32} />
      <line x1="104" y1="98" x2="136" y2="98" stroke={ORANGE} strokeWidth="3" />
      <Tap x={104} y={98} n="1" color={ORANGE} />
      <Tap x={136} y={98} n="2" color={ORANGE} />
    </Room>
  );
}

function RoomMove() {
  return (
    <Room label="Drag the blue item box to where it would stand">
      <rect x="78" y="48" width="64" height="70" fill="rgba(37,99,235,0.15)" stroke={BLUE} strokeWidth="2" strokeDasharray="6 4" />
      <path d="M150 85 L172 85" stroke={BLUE} strokeWidth="2" markerEnd="url(#drag)" />
      <path d="M70 85 L48 85" stroke={BLUE} strokeWidth="2" markerEnd="url(#drag)" />
      <defs>
        <marker id="drag" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0 L10 5 L0 10z" fill={BLUE} />
        </marker>
      </defs>
      <text x="110" y="150" textAnchor="middle" fontSize="10" fill="#374151">Press and drag</text>
    </Room>
  );
}

function RoomGap() {
  return (
    <Room label="Tap both sides of the gap; a green line shows if it fits">
      <line x1="60" y1="112" x2="182" y2="112" stroke={GREEN} strokeWidth="3" />
      <Tap x={60} y={112} n="1" color={GREEN} />
      <Tap x={182} y={112} n="2" color={GREEN} />
      <text x="120" y="142" textAnchor="middle" fontSize="11" fontWeight="700" fill={GREEN}>Fits! 12 cm to spare</text>
    </Room>
  );
}
