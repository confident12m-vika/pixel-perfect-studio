import { useLanguage } from "../context/LanguageContext";
import { useReveal } from "../hooks/useReveal";
import ContactForm from "./ContactForm";
import "./FinalCta.css";

export default function FinalCta() {
  const { t } = useLanguage();
  const ref = useReveal();

  return (
    <section id="contact" className="section final-cta">
      <div className="final-cta__bg" aria-hidden="true">
        <img src="/assets/section-arc.jpg" alt="" />
      </div>
      <div className="container">
        <div ref={ref} className="reveal final-cta__inner">
          <h2 className="section-title final-cta__title">{t.finalCta.title}</h2>
          <p className="section-subtitle final-cta__text">{t.finalCta.text}</p>
          <div className="final-cta__form">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
