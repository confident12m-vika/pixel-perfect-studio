import { useLanguage } from "../context/LanguageContext";
import { useReveal } from "../hooks/useReveal";
import PortfolioShowcase from "./PortfolioShowcase";

export default function Portfolio() {
  const { t } = useLanguage();
  const headRef = useReveal();

  return (
    <section id="work" className="section section--alt">
      <div className="container">
        <div ref={headRef} className="reveal section-head">
          <span className="eyebrow">{t.portfolio.eyebrow}</span>
          <h2 className="section-title">{t.portfolio.title}</h2>
          <p className="section-subtitle">{t.portfolio.subtitle}</p>
        </div>
        <PortfolioShowcase />
      </div>
    </section>
  );
}
