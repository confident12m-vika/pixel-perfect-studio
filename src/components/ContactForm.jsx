import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { api } from "../api/client";
import "./ContactForm.css";

export default function ContactForm() {
  const { t, lang } = useLanguage();
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
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
          <input
            type="text"
            name="name"
            required
            maxLength={120}
            value={values.name}
            onChange={handleChange}
            placeholder={t.contactForm.namePlaceholder}
          />
        </label>
        <label className="contact-form__field">
          <span>{t.contactForm.emailLabel}</span>
          <input
            type="email"
            name="email"
            required
            maxLength={200}
            value={values.email}
            onChange={handleChange}
            placeholder={t.contactForm.emailPlaceholder}
          />
        </label>
      </div>

      <label className="contact-form__field">
        <span>{t.contactForm.messageLabel}</span>
        <textarea
          name="message"
          required
          rows={5}
          maxLength={5000}
          value={values.message}
          onChange={handleChange}
          placeholder={t.contactForm.messagePlaceholder}
        />
      </label>

      <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
        {status === "sending" ? t.contactForm.sending : t.contactForm.submit}
        <span className="btn-arrow">→</span>
      </button>

      {status === "success" && (
        <p className="contact-form__notice contact-form__notice--success">
          {t.contactForm.success}
        </p>
      )}
      {status === "error" && (
        <p className="contact-form__notice contact-form__notice--error">
          {t.contactForm.error}
          {errorMsg ? ` (${errorMsg})` : ""}
        </p>
      )}
    </form>
  );
}
