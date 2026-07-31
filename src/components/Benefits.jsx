import { useLanguage } from "../context/LanguageContext";
import { useReveal } from "../hooks/useReveal";
import "./Cards.css";

const icons = ["✓", "◇", "→", "↗"];

function BenefitCard({ item, index }) {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className="reveal benefit-card"
      style={{ transitionDelay: `${index * 90}ms` }}
    >
      <span className="benefit-card__icon">{icons[index]}</span>
      <h3>{item.title}</h3>
      <p>{item.text}</p>
    </div>
  );
}

export default function Benefits() {
  const { t } = useLanguage();
  const headRef = useReveal();

  return (
    <section id="benefits" className="section section--alt">
      <div className="container">
        <div ref={headRef} className="reveal section-head">
          <span className="eyebrow">{t.benefits.eyebrow}</span>
          <h2 className="section-title">{t.benefits.title}</h2>
          <p className="section-subtitle">{t.benefits.subtitle}</p>
        </div>
        <div className="card-grid card-grid--4">
          {t.benefits.items.map((item, i) => (
            <BenefitCard key={item.title} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
