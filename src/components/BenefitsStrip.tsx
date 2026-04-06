const benefits = [
  { icon: "🃏", label: "1000+ Cards" },
  { icon: "📦", label: "10 Bundles" },
  { icon: "✦", label: "AI-Powered" },
  { icon: "🔞", label: "Ages 18+" },
];

export default function BenefitsStrip() {
  return (
    <section className="benefits-strip">
      <div className="site-shell">
        <div className="benefits-row">
          {benefits.map((b) => (
            <div key={b.label} className="benefit-item">
              <span className="benefit-icon">{b.icon}</span>
              <span className="benefit-label">{b.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
