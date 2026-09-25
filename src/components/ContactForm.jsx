import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { api } from "../api/client";
import "./ContactForm.css";

const RECAPTCHA_KEY = '6Lf9OMktAAAAAHYu-VBUBW8BeYDjBiiIhgeZFUcc';

async function getRecaptchaToken() {
  return new Promise((resolve) => {
    if (!window.grecaptcha) { resolve(''); return; }
    window.grecaptcha.ready(() => {
      window.grecaptcha.execute(RECAPTCHA_KEY, { action: 'contact' })
        .then(resolve).catch(() => resolve(''));
    });
  });
}

export default function ContactForm() {
  const { t, lang } = useLanguage();
  const [values, setValues] = useState({ name: "", email: "", message: "", hp_field: "" });
  const [status, setStatus]   = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      const recaptchaToken = await getRecaptchaToken();
      await api.submitContact({ ...values, language: lang, recaptchaToken });
      setStatus("success");
      setValues({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message);
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="contact-form__row">
        <label className="contact-form__field">
          <span>{t.contactForm.nameLabel}</span>
          <input type="text" name="name" required maxLength={120}
            value={values.name} onChange={handleChange}
            placeholder={t.contactForm.namePlaceholder} />
        </label>
        <label className="contact-form__field">
          <span>{t.contactForm.emailLabel}</span>
          <input type="email" name="email" required maxLength={200}
            value={values.email} onChange={handleChange}
            placeholder={t.contactForm.emailPlaceholder} />
        </label>
      </div>
      <label className="contact-form__field">
        <span>{t.contactForm.messageLabel}</span>
        <textarea name="message" required rows={5} maxLength={5000}
          value={values.message} onChange={handleChange}
          placeholder={t.contactForm.messagePlaceholder} />
      </label>
      {/* Honeypot — مخفي للبشر */}
      <input
        type="text"
        name="hp_field"
        value={values.hp_field}
        onChange={(e) => setValues(v => ({ ...v, hp_field: e.target.value }))}
        style={{ display: "none" }}
        tabIndex="-1"
        autoComplete="off"
        aria-hidden="true"
      />
      <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
        {status === "sending" ? t.contactForm.sending : t.contactForm.submit}
        <span className="btn-arrow">→</span>
      </button>
      {status === "success" && (
        <p className="contact-form__notice contact-form__notice--success">{t.contactForm.success}</p>
      )}
      {status === "error" && (
        <p className="contact-form__notice contact-form__notice--error">
          {t.contactForm.error}{errorMsg ? ` (${errorMsg})` : ""}
        </p>
      )}
    </form>
  );
}