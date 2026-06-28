import './MarqueeBars.css';


const ROW2 = [
  { icon: '', text: "No Experience? No Problem. Copy verified pros with 1 click." },
  { icon: '', text: "Limited Time: Deposit $500+ and get a $50 risk-free first copy trade" },
  { icon: '', text: "Market downturn? Our top-ranked short-sellers are still up 15% this week." },
  { icon: '', text: "Set your own limits: Built-in stop-loss protection on all copy portfolios." },
  { icon: '', text: "Real-Time Syncing: Zero-latency execution matching the pros instantly." },
  { icon: '', text: "Join 200,000+ investors from 150+ countries already copying the pros." },
];

function MarqueeTrack({ items, direction = 'left', speed = 30 }) {
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

      <div className="mq-bar mq-bar-bottom">
        <MarqueeTrack items={ROW2} direction="left" speed={25} />
      </div>
    </div>
  );
}
