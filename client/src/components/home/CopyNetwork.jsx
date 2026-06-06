import { useEffect, useRef, useState } from 'react';
import './CopyNetwork.css';

/* ─── Animated counter hook ─── */
function useCountUp(target, duration = 2200, suffix = '') {
  const [display, setDisplay] = useState('0');
  const rafRef = useRef(null);
  const startRef = useRef(null);

  const run = (timestamp) => {
    if (!startRef.current) startRef.current = timestamp;
    const elapsed = timestamp - startRef.current;
    const progress = Math.min(elapsed / duration, 1);
    // easeOutExpo
    const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const current = Math.floor(eased * target);
    setDisplay(current.toLocaleString() + suffix);
    if (progress < 1) rafRef.current = requestAnimationFrame(run);
  };

  const start = () => {
    cancelAnimationFrame(rafRef.current);
    startRef.current = null;
    rafRef.current = requestAnimationFrame(run);
  };

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);
  return { display, start };
}

function StatCounter({ target, suffix, prefix, label }) {
  const { display, start } = useCountUp(target, 2400, suffix);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          start();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="cn-stat" ref={ref}>
      <span className="cn-stat-val">{prefix}{display}</span>
      <span className="cn-stat-label">{label}</span>
    </div>
  );
}

/* ─── Trader avatars & network layout ─── */
const TRADERS = [
  // Expert traders (gold ring + speech bubble + COPIED label)
  { cx: 18, cy: 14, r: 36, ring: true, copied: true, label: 'COPIED' },
  { cx: 85, cy: 12, r: 36, ring: true, copied: true, label: 'COPIED' },
  { cx: 50, cy: 35, r: 40, ring: true, copied: false, label: null },
  // Regular traders
  { cx: 5, cy: 8, r: 26, ring: false, copied: false, label: null },
  { cx: 32, cy: 20, r: 26, ring: false, copied: false, label: null },
  { cx: 37, cy: 55, r: 28, ring: false, copied: false, label: null },
  { cx: 63, cy: 18, r: 26, ring: false, copied: false, label: null },
  { cx: 66, cy: 42, r: 28, ring: false, copied: false, label: null },
  { cx: 74, cy: 60, r: 26, ring: false, copied: false, label: null },
  { cx: 92, cy: 8, r: 24, ring: false, copied: false, label: null },
  { cx: 97, cy: 30, r: 24, ring: false, copied: false, label: null },
];

const AVATARS = [
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&q=90&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=90&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&q=90&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&q=90&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&q=90&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&q=90&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&q=90&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1463453091185-61582044d556?w=120&q=90&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?w=120&q=90&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1489424731084-a5d8b2a2cf0d?w=120&q=90&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1548449112-96a38a643324?w=120&q=90&fit=crop&crop=face',
];

/* SVG path for speech-bubble ring (like the reference) */
const BubbleRing = ({ size }) => (
  <svg
    width={size + 20}
    height={size + 24}
    viewBox="0 0 100 110"
    fill="none"
    className="cn-bubble-ring"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* outer glow ring */}
    <circle cx="50" cy="46" r="44" stroke="url(#goldGrad)" strokeWidth="3" />
    <circle cx="50" cy="46" r="38" stroke="rgba(212,160,23,0.3)" strokeWidth="1.5" />
    {/* chat bubble pointer */}
    <path d="M38 86 L50 100 L62 86" fill="url(#goldGrad)" />
    <defs>
      <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#d4a017" />
        <stop offset="100%" stopColor="#f5c842" />
      </linearGradient>
    </defs>
  </svg>
);

/* Concentric ripple rings behind expert avatars */
const Ripples = () => (
  <svg width="160" height="160" viewBox="0 0 160 160" fill="none" className="cn-ripples">
    <circle cx="80" cy="80" r="50" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
    <circle cx="80" cy="80" r="65" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
    <circle cx="80" cy="80" r="75" stroke="rgba(255,255,255,0.025)" strokeWidth="1" />
  </svg>
);

export default function CopyNetwork() {
  return (
    <section className="cn-section">
      {/* Dark blue textured background */}
      <div className="cn-bg" />

      {/* Canvas area with avatars */}
      <div className="cn-canvas">
        {/* SVG connection lines drawn between nodes */}
        <svg className="cn-lines" viewBox="0 0 100 75" preserveAspectRatio="none">
          <line x1="5" y1="8" x2="18" y2="14" stroke="rgba(180,200,255,0.22)" strokeWidth="0.18" />
          <line x1="18" y1="14" x2="32" y2="20" stroke="rgba(180,200,255,0.22)" strokeWidth="0.18" />
          <line x1="32" y1="20" x2="50" y2="35" stroke="rgba(180,200,255,0.18)" strokeWidth="0.18" />
          <line x1="18" y1="14" x2="50" y2="35" stroke="rgba(180,200,255,0.15)" strokeWidth="0.18" />
          <line x1="37" y1="55" x2="50" y2="35" stroke="rgba(180,200,255,0.15)" strokeWidth="0.18" />
          <line x1="50" y1="35" x2="63" y2="18" stroke="rgba(180,200,255,0.18)" strokeWidth="0.18" />
          <line x1="63" y1="18" x2="85" y2="12" stroke="rgba(180,200,255,0.22)" strokeWidth="0.18" />
          <line x1="85" y1="12" x2="92" y2="8" stroke="rgba(180,200,255,0.18)" strokeWidth="0.18" />
          <line x1="66" y1="42" x2="74" y2="60" stroke="rgba(180,200,255,0.15)" strokeWidth="0.18" />
          <line x1="63" y1="18" x2="66" y2="42" stroke="rgba(180,200,255,0.15)" strokeWidth="0.18" />
          <line x1="85" y1="12" x2="97" y2="30" stroke="rgba(180,200,255,0.15)" strokeWidth="0.18" />
          <line x1="50" y1="35" x2="66" y2="42" stroke="rgba(180,200,255,0.12)" strokeWidth="0.18" />
        </svg>

        {TRADERS.map((t, i) => {
          const pxX = `${t.cx}%`;
          const pxY = `${t.cy}%`;
          const dia = t.r * 2;

          return (
            <div
              key={i}
              className={`cn-node ${t.ring ? 'is-expert' : 'is-follower'}`}
              style={{
                left: pxX,
                top: pxY,
                width: dia,
                height: dia,
              }}
            >
              {t.ring && <Ripples />}
              {t.ring && <BubbleRing size={dia} />}

              <div className="cn-avatar-wrap" style={{ width: dia, height: dia }}>
                <img
                  src={AVATARS[i % AVATARS.length]}
                  alt=""
                  draggable="false"
                />
              </div>

              {t.copied && (
                <span className="cn-copied-label">COPIED</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Animated stats bar */}
      <div className="cn-stats-bar">
        <StatCounter target={2700} suffix="+" label="Daily trades" />
        <StatCounter target={4300} suffix="+" label="Clients" />
        <StatCounter target={2.3} suffix=" million+" label="USD monthly trade volume" />
        <StatCounter target={10} suffix=" million+" label="USD assets under management" />
      </div>
    </section>
  );
}
