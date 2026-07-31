// Minimal line-art pictograms for social platforms (lucide-react no longer
// ships brand marks). Kept purely geometric/generic, not brand logos.

export function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M13.6 20.6v-6.4h2.1l.3-2.5h-2.4V10c0-.7.2-1.2 1.2-1.2h1.3V6.6c-.2 0-1-.1-1.9-.1-1.9 0-3.2 1.1-3.2 3.3v1.9H8.9v2.5H11v6.4" />
    </svg>
  );
}

export function LinkedinIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
      <line x1="7.5" y1="10.5" x2="7.5" y2="16.5" />
      <circle cx="7.5" cy="7.6" r="0.9" fill="currentColor" stroke="none" />
      <path d="M11 16.5v-3.6c0-1.4 1-2.4 2.3-2.4 1.3 0 2.2 1 2.2 2.4v3.6" />
      <line x1="11" y1="10.5" x2="11" y2="16.5" />
    </svg>
  );
}

export function TikTokIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...props}>
      <path d="M16.6 5.82c-.9-.98-1.4-2.26-1.4-3.6h-3.16v13.9c0 1.55-1.26 2.8-2.8 2.8a2.8 2.8 0 0 1-2.8-2.8 2.8 2.8 0 0 1 2.8-2.8c.28 0 .55.04.8.12V10.2a6.05 6.05 0 0 0-.8-.06 6.1 6.1 0 1 0 6.1 6.1V9.14a9.13 9.13 0 0 0 5.34 1.7V7.68a5.6 5.6 0 0 1-3.98-1.86z" />
    </svg>
  );
}
