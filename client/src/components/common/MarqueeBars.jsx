import './MarqueeBars.css';

const ROW1 = [
  { icon: '', text: "Top Trader 'Alpha_Quant' just closed a +24.3% win in Bitcoin options!" },
  { icon: '', text: "1,420 users just copied 'ScalpMaster's' latest Forex trade." },
  { icon: '', text: "Total client payouts in the last 24 hours: $142,505" },
  { icon: '', text: "Liam Dupont's portfolio is up +31.7% this month — 890 copiers profiting now." },
  { icon: '', text: "'CryptoKing' just opened a BTC long — 2,100 users copied in 60 seconds!" },
  { icon: '', text: "New payout record: $38,200 withdrawn by clients in the last hour alone." },
];

const ROW2 = [
  { icon: '', text: "No Experience? No Problem. Copy verified pros with 1 click." },
  { icon: '', text: "Limited Time: Deposit $100+ and get a $50 risk-free first copy trade!" },
  { icon: '', text: "Market downturn? Our top-ranked short-sellers are still up 15% this week." },
  { icon: '', text: "Set your own limits: Built-in stop-loss protection on all copy portfolios." },
  { icon: '', text: "Real-Time Syncing: Zero-latency execution matching the pros instantly." },
  { icon: '', text: "Join 400,000+ investors from 150+ countries already copying the pros." },
];

function MarqueeTrack({ items, direction = 'left', speed = 40 }) {
  const doubled = [...items, ...items];
  return (
    <div className={`mq-track-wrap ${direction === 'right' ? 'mq-right' : 'mq-left'}`}>
      <div className="mq-track" style={{ animationDuration: `${speed}s` }}>
        {doubled.map((item, i) => (
          <span key={i} className="mq-item">
            <span className="mq-icon">{item.icon}</span>
            <span className="mq-text">{item.text}</span>
            <span className="mq-sep">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function MarqueeBars() {
  return (
    <div className="mq-bars-wrap">
      <div className="mq-bar mq-bar-top">
        <MarqueeTrack items={ROW1} direction="left" speed={40} />
      </div>
      <div className="mq-bar mq-bar-bottom">
        <MarqueeTrack items={ROW2} direction="right" speed={45} />
      </div>
    </div>
  );
}
