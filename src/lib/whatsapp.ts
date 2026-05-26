export function whatsappHref(phoneDigits: string, text?: string) {
  const encoded = encodeURIComponent(text ?? "");
  return `https://wa.me/${phoneDigits}?text=${encoded}`;
}
