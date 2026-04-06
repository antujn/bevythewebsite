const stats = [
  { number: "1000+", label: "Cards crafted" },
  { number: "10", label: "Unique bundles" },
  { number: "4.7", label: "App Store rating" },
  { number: "5", label: "Truth bundles" },
  { number: "5", label: "Dare bundles" },
];

export default function StatsSection() {
  return (
    <section className="stats-section">
      <div className="site-shell">
        <div className="stats-row">
          {stats.map((s) => (
            <div key={s.label} className="stat-item">
              <span className="stat-number">{s.number}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
