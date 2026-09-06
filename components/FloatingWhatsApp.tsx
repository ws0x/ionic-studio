"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/lib/i18n";
import { waLink } from "@/lib/site";

export function FloatingWhatsApp() {
  const { t } = useLocale();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href={waLink(t("cta.whatsappDefault"))}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("contact.whatsapp")}
      title={t("contact.whatsapp")}
      className={`fixed bottom-5 end-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-ink text-paper shadow-lg ring-1 ring-paper/10 transition-all duration-300 hover:scale-110 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2a10 10 0 00-8.6 15l-1.3 4.8 4.9-1.3A10 10 0 1012 2zm0 18a8 8 0 01-4.1-1.1l-.3-.2-2.9.8.8-2.8-.2-.3A8 8 0 1112 20zm4.4-6c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.5.1a6.5 6.5 0 01-1.9-1.2 7.2 7.2 0 01-1.3-1.7c-.1-.2 0-.4.1-.5l.4-.5.3-.5v-.4l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 00-.7.3A2.8 2.8 0 006 8.8a4.9 4.9 0 001 2.6 11 11 0 004.3 3.8c.6.3 1.1.4 1.5.5a3.5 3.5 0 001.6.1 2.6 2.6 0 001.7-1.2 2.1 2.1 0 00.2-1.2c-.1-.1-.3-.2-.5-.3z" />
      </svg>
    </a>
  );
}
