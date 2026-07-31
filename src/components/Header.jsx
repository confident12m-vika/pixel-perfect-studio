import { useEffect, useState } from "react";
import { languages } from "../i18n/translations";
import { useLanguage } from "../context/LanguageContext";
import "./Header.css";

export default function Header() {
  const { lang, setLang, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    ["home", "#home"],
    ["services", "#services"],
    ["benefits", "#benefits"],
    ["whyUs", "#why-us"],
    ["work", "#work"],
    ["process", "#process"],
    ["contact", "#contact"],
  ];

  const close = () => setOpen(false);

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="container site-header__inner">
        <a href="#home" className="brand" onClick={close}>
          <img src="/assets/logo-monogram.png" alt="" className="brand__mark" />
          <img src="/assets/logo-wordmark.png" alt="Pixel Perfect Studio" className="brand__word" />
        </a>

        <nav className={`site-nav ${open ? "is-open" : ""}`}>
          {navItems.map(([key, href]) => (
            <a key={key} href={href} onClick={close}>
              {t.nav[key]}
            </a>
          ))}
          <div className="lang-switch lang-switch--mobile">
            {languages.map((l) => (
              <button
                key={l.code}
                className={l.code === lang ? "is-active" : ""}
                onClick={() => {
                  setLang(l.code);
                  close();
                }}
              >
                {l.label}
              </button>
            ))}
          </div>
        </nav>

        <div className="site-header__actions">
          <div className="lang-switch lang-switch--desktop">
            {languages.map((l) => (
              <button
                key={l.code}
                className={l.code === lang ? "is-active" : ""}
                onClick={() => setLang(l.code)}
              >
                {l.label}
              </button>
            ))}
          </div>
          <a href="#audit" className="btn btn-primary header-cta">
            {t.header.cta}
          </a>
          <button
            className={`burger ${open ? "is-open" : ""}`}
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
