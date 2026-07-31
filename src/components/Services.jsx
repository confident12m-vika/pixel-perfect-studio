import { useLanguage } from "../context/LanguageContext";
import { useReveal } from "../hooks/useReveal";
import "./Cards.css";

function ServiceCard({ item, index }) {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className="reveal service-card"
      style={{ transitionDelay: `${index * 90}ms` }}
    >
      <span className="service-card__num">{item.num}</span>
      <h3>{item.title}</h3>
      <p>{item.text}</p>
    </div>
  );
}

export default function Services() {
  const { t } = useLanguage();
  const headRef = useReveal();

  return (
    <section id="services" className="section">
      <div className="container">
        <div ref={headRef} className="reveal section-head">
          <span className="eyebrow">{t.services.eyebrow}</span>
          <h2 className="section-title">{t.services.title}</h2>
          <p className="section-subtitle">{t.services.subtitle}</p>
        </div>
        <div className="card-grid card-grid--3">
          {t.services.items.map((item, i) => (
            <ServiceCard key={item.title} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
