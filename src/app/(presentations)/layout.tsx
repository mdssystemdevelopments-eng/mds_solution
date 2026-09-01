import { Instrument_Serif } from "next/font/google";

const serif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bp-serif",
});

export default function BusinessPublicLayout({ children }: { children: React.ReactNode }) {
  return <div className={`bp-shell ${serif.variable}`}>{children}</div>;
}
