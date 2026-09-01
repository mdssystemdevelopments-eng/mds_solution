"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { whatsappHref } from "@/lib/whatsapp";

export function WhatsAppFloat({
  whatsappNumber,
  defaultMessage,
}: {
  whatsappNumber: string;
  defaultMessage: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <a
      href={whatsappHref(whatsappNumber, defaultMessage)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="wa-float"
    >
      <svg className="wa-float__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 2.09.54 4.14 1.56 5.95L2 22l4.25-1.11a9.86 9.86 0 004.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.6 14.2c-.24-.12-1.38-.68-1.6-.76-.22-.08-.38-.12-.54.12-.16.24-.62.76-.76.92-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.93-1.2-.71-.63-1.19-1.41-1.33-1.66-.14-.25-.01-.38.1-.51.11-.11.24-.29.36-.43.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.43-.06-.13-.55-1.32-.75-1.81-.2-.49-.41-.42-.55-.43-.14-.01-.3-.01-.46-.01-.16 0-.42.06-.64.31-.22.25-.85.83-.85 2.02 0 1.19.87 2.34.99 2.5.12.16 1.73 2.78 4.18 3.92.58.25 1.04.4 1.4.51.59.19 1.13.16 1.56.1.47-.07 1.45-.6 1.66-1.17.21-.57.21-1.07.15-1.18-.06-.11-.22-.18-.46-.3z" />
      </svg>
    </a>,
    document.body,
  );
}
