import { useState } from "react";
import { Link } from "react-router-dom";
import { LanguageProvider, useLanguage } from "../context/LanguageContext";
import { api } from "../api/client";
import "../components/ContactForm.css";
import "./StartPage.css";

function StartPageInner() {
  const { t, lang } = useLanguage();
  const [values, setValues] = useState({ name: "", email: "", whatsapp: "", websiteUrl: "", message: "" });
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      await api.submitContact({ ...values, language: lang });
      setStatus("success");
      setValues({ name: "", email: "", whatsapp: "", websiteUrl: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="start-page">
      <div className="start-page__glow" aria-hidden="true" />
      <div className="start-page__card">
        <Link to="/" className="start-page__brand">
          <img src="/assets/logo-monogram.png" alt="" />
          <img src="/assets/logo-wordmark.png" alt="Pixel Perfect Studio" />
        </Link>

        <span className="eyebrow">{t.startForm.eyebrow}</span>
        <h1 className="start-page__title">{t.startForm.title}</h1>
        <p className="start-page__subtitle">{t.startForm.subtitle}</p>

        <form className="start-page__form" onSubmit={handleSubmit}>
          <label className="contact-form__field">
            <span>{t.startForm.nameLabel}</span>
            <input
              type="text"
              name="name"
              required
              maxLength={120}
              value={values.name}
              onChange={handleChange}
              placeholder={t.startForm.namePlaceholder}
            />
          </label>

          <label className="contact-form__field">
            <span>{t.startForm.emailLabel}</span>
            <input
              type="email"
              name="email"
              required
              maxLength={200}
              value={values.email}
              onChange={handleChange}
              placeholder={t.startForm.emailPlaceholder}
            />
          </label>

          <label className="contact-form__field">
            <span>{t.startForm.whatsappLabel}</span>
            <input
              type="tel"
              name="whatsapp"
              required
              maxLength={40}
              value={values.whatsapp}
              onChange={handleChange}
              placeholder={t.startForm.whatsappPlaceholder}
            />
          </label>

          <label className="contact-form__field">
            <span>{t.startForm.websiteLabel}</span>
            <input
              type="url"
              name="websiteUrl"
              maxLength={300}
              value={values.websiteUrl}
              onChange={handleChange}
              placeholder={t.startForm.websitePlaceholder}
            />
          </label>

          <label className="contact-form__field">
            <span>{t.startForm.messageLabel}</span>
            <textarea
              name="message"
              rows={4}
              maxLength={5000}
              value={values.message}
              onChange={handleChange}
              placeholder={t.startForm.messagePlaceholder}
            />
          </label>

          <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
            {status === "sending" ? t.startForm.sending : t.startForm.submit}
            <span className="btn-arrow">→</span>
          </button>

          {status === "success" && (
            <p className="contact-form__notice contact-form__notice--success">{t.startForm.success}</p>
          )}
          {status === "error" && (
            <p className="contact-form__notice contact-form__notice--error">
              {t.startForm.error}
              {errorMsg ? ` (${errorMsg})` : ""}
            </p>
          )}
        </form>

        <Link to="/" className="start-page__back">
          ← {t.startForm.back}
        </Link>
      </div>
    </div>
  );
}

export default function StartPage() {
  return (
    <LanguageProvider>
      <StartPageInner />
    </LanguageProvider>
  );
}
