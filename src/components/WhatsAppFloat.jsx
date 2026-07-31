import { MessageCircle } from "lucide-react";
import "./WhatsAppFloat.css";

export default function WhatsAppFloat() {
  return (
    <a
      className="wa-float"
      href="https://wa.me/00000000000"
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      title="Chat on WhatsApp"
    >
      <MessageCircle size={26} strokeWidth={2} fill="#14110C" />
    </a>
  );
}
