import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useReveal } from "../hooks/useReveal";
import "./PortfolioShowcase.css";

const projects = [
  {
    image: "/assets/portfolio-viktoria.jpg",
    url: "https://viktoriakotekhbridal.vercel.app/",
    label: "viktoriakotekhbridal.vercel.app",
  },
  {
    image: "/assets/portfolio-dahabi.jpg",
    url: "https://www.dahabigoldprice.com/",
    label: "dahabigoldprice.com",
  },
  {
    image: "/assets/portfolio-animaljoy.jpg",
    url: "https://www.animaljoystories.com/",
    label: "animaljoystories.com",
  },
];

const INTERVAL_MS = 5000;

export default function PortfolioShowcase() {
  const { t } = useLanguage();
  const ref = useReveal();
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((i) => (i + 1) % projects.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  const items = t.portfolio.items; // same order as `projects`

  return (
    <div ref={ref} className="reveal portfolio-row">
      <div className="portfolio-row__media">
        {projects.map((p, i) => (
          <img
            key={p.image}
            src={p.image}
            alt={items[i]?.title || ""}
            className={`portfolio-row__frame ${i === active ? "is-active" : ""}`}
          />
        ))}
      </div>

      <div className="portfolio-row__copy">
        {items.map((item, i) => (
          <div key={item.title} className={`portfolio-row__text ${i === active ? "is-active" : ""}`}>
            <span className="portfolio-row__category">{item.category}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
            <a href={projects[i].url} target="_blank" rel="noreferrer" className="portfolio-row__link">
              {projects[i].label}
              <span className="btn-arrow">→</span>
            </a>
          </div>
        ))}

        <div className="portfolio-row__dots">
          {projects.map((p, i) => (
            <button
              key={p.image}
              className={i === active ? "is-active" : ""}
              aria-label={items[i]?.title || `Project ${i + 1}`}
              onClick={() => setActive(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
