import type { ReactNode } from "react";

type TrustIconName =
  | "budget"
  | "shield"
  | "zap"
  | "support"
  | "chat"
  | "verified";

const paths: Record<TrustIconName, ReactNode> = {
  budget: (
    <>
      <path d="M8 4h8l2 3v13H6V7l2-3z" strokeWidth="1.5" />
      <path d="M9 11h6M9 14h4" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3z" strokeWidth="1.5" />
      <path d="M9 12l2 2 4-4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  zap: (
    <path d="M13 2L6 14h6l-1 8 7-12h-6l1-8z" strokeWidth="1.5" strokeLinejoin="round" />
  ),
  support: (
    <>
      <circle cx="12" cy="12" r="3" strokeWidth="1.5" />
      <path
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </>
  ),
  chat: (
  <>
      <path d="M5 6a7 7 0 0114 0v5a7 7 0 01-7 7H9l-4 3v-3" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9 11h6M9 14h3" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  verified: (
    <>
      <path d="M12 3l6 2.5v5c0 4.5-2.8 7.2-6 8.5C9.8 17.7 7 15 7 10.5v-5L12 3z" strokeWidth="1.5" />
      <path d="M9 10l2 2 4-4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
};

export function TrustIcon({ name }: { name: string }) {
  const key = (name in paths ? name : "verified") as TrustIconName;
  return (
    <span className="trust-icon" aria-hidden>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="trust-icon__svg">
        {paths[key]}
      </svg>
    </span>
  );
}
