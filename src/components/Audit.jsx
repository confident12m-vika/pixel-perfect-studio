import { useLanguage } from "../context/LanguageContext";
import { useReveal } from "../hooks/useReveal";
import "./Audit.css";

export default function Audit() {
  const { t } = useLanguage();
  const ref = useReveal();

  return (
    <section id="audit" className="section section--alt audit">
      <div className="container">
        <div ref={ref} className="reveal audit__box">
          <h2 className="audit__title">{t.audit.title}</h2>
          <p className="audit__text">{t.audit.text}</p>
          <p className="audit__note">{t.audit.note}</p>
          <a href="#contact" className="btn btn-primary">
            {t.audit.cta}
            <span className="btn-arrow">→</span>
          </a>
          <p className="audit__small">{t.audit.small}</p>
        </div>
      </div>
    </section>
  );
}
