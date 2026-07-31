import { useLanguage } from "../context/LanguageContext";
import { useReveal } from "../hooks/useReveal";
import "./Cards.css";
import "./WhyUs.css";

function WhyCard({ item, index }) {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className="reveal whyus-card"
      style={{ transitionDelay: `${index * 90}ms` }}
    >
      <h3>{item.title}</h3>
      <p>{item.text}</p>
    </div>
  );
}

export default function WhyUs() {
  const { t } = useLanguage();
  const headRef = useReveal();
  const leadRef = useReveal();

  return (
    <section id="why-us" className="section">
      <div className="container">
        <div ref={headRef} className="reveal section-head">
          <span className="eyebrow">{t.whyUs.eyebrow}</span>
          <h2 className="section-title">{t.whyUs.title}</h2>
          <p className="section-subtitle">{t.whyUs.subtitle}</p>
        </div>
        <p ref={leadRef} className="reveal whyus-lead">
          {t.whyUs.lead}
        </p>
        <div className="card-grid card-grid--4">
          {t.whyUs.items.map((item, i) => (
            <WhyCard key={item.title} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
