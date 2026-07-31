import { useLanguage } from "../context/LanguageContext";
import { useReveal } from "../hooks/useReveal";
import "./Process.css";

function ProcessStep({ item, index }) {
  const ref = useReveal();
  return (
    <div ref={ref} className="reveal process-step" style={{ transitionDelay: `${index * 90}ms` }}>
      <span className="process-step__num">{item.num}</span>
      <h3>{item.title}</h3>
      <p>{item.text}</p>
    </div>
  );
}

export default function Process() {
  const { t } = useLanguage();
  const headRef = useReveal();

  return (
    <section id="process" className="section">
      <div className="container">
        <div ref={headRef} className="reveal section-head">
          <span className="eyebrow">{t.process.eyebrow}</span>
          <h2 className="section-title">{t.process.title}</h2>
          <p className="section-subtitle">{t.process.subtitle}</p>
        </div>
        <div className="process-track">
          {t.process.items.map((item, i) => (
            <ProcessStep key={item.num} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
