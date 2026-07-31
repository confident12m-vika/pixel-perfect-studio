import { Mail, MessageCircle, Send } from "lucide-react";
import { InstagramIcon, FacebookIcon, LinkedinIcon, TikTokIcon } from "./SocialIcons";
import { useLanguage } from "../context/LanguageContext";
import "./Footer.css";

export default function Footer() {
  const { t } = useLanguage();

  const navItems = [
    ["home", "#home"],
    ["services", "#services"],
    ["benefits", "#benefits"],
    ["whyUs", "#why-us"],
    ["work", "#work"],
    ["process", "#process"],
    ["contact", "#contact"],
  ];

  const socials = [
    { label: "Email", href: "mailto:hello@pixelperfect.studio", icon: Mail },
    { label: "WhatsApp", href: "https://wa.me/00000000000", icon: MessageCircle },
    { label: "Instagram", href: "https://instagram.com/pixelperfect.studio", icon: InstagramIcon },
    { label: "Facebook", href: "https://facebook.com/pixelperfect.studio", icon: FacebookIcon },
    { label: "LinkedIn", href: "https://linkedin.com/company/pixelperfect-studio", icon: LinkedinIcon },
    { label: "TikTok", href: "https://tiktok.com/@pixelperfect.studio", icon: TikTokIcon },
    { label: "Telegram", href: "https://t.me/pixelperfectstudio", icon: Send },
  ];

  return (
    <footer className="site-footer">
      <div className="site-footer__glow" aria-hidden="true" />
      <div className="container site-footer__top">
        <div className="footer-brand">
          <div className="footer-brand__lockup">
            <img src="/assets/logo-monogram.png" alt="" className="footer-brand__mark" />
            <img src="/assets/logo-wordmark.png" alt="Pixel Perfect Studio" className="footer-brand__word" />
          </div>
          <p className="footer-brand__text">{t.footer.text}</p>
          <div className="site-footer__socials">
            {socials.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target={label === "Email" ? undefined : "_blank"}
                rel="noreferrer"
                aria-label={label}
                title={label}
                className="site-footer__social"
              >
                <Icon size={17} />
              </a>
            ))}
          </div>
        </div>

        <div className="footer-col">
          <span className="footer-col__label">{t.nav.contact}</span>
          <nav className="site-footer__nav">
            {navItems.map(([key, href]) => (
              <a key={key} href={href}>
                {t.nav[key]}
              </a>
            ))}
          </nav>
        </div>

        <div className="footer-col">
          <span className="footer-col__label">{t.footer.contactsLabel}</span>
          <div className="site-footer__contacts">
            <a href="mailto:hello@pixelperfect.studio">hello@pixelperfect.studio</a>
            <a href="https://wa.me/00000000000" target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          </div>
        </div>
      </div>
      <div className="container site-footer__bottom">
        <span>© 2026 Pixel Perfect Studio. {t.footer.rights}</span>
      </div>
    </footer>
  );
}
