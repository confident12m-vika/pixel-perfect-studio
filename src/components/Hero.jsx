import { useLanguage } from "../context/LanguageContext";
import "./Hero.css";

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section id="home" className="hero">
      <div className="hero__bg" aria-hidden="true">
        <img src="/assets/hero-laptop.jpg" alt="" />
        <div className="hero__overlay" />
      </div>
      <div className="hero__inner">
        <div className="hero__copy">
          <span className="eyebrow">{t.hero.eyebrow}</span>
          <h1 className="hero__title">{t.hero.title}</h1>
          <p className="hero__subtitle">{t.hero.subtitle}</p>
          <div className="hero__actions">
            <a href="#audit" className="btn btn-primary">
              {t.hero.cta1}
              <span className="btn-arrow">→</span>
            </a>
            <a href="#work" className="btn btn-outline">
              {t.hero.cta2}
            </a>
          </div>
        </div>
      </div>
      <div className="hero__scroll" aria-hidden="true">
        <span />
      </div>
    </section>
  );
}
