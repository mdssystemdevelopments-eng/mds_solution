/** Bandeira visível no Windows/desktop (emoji de bandeira costuma não renderizar). */
export function FlagIcon({
  iso,
  emoji,
  label,
  size = 22,
}: {
  iso: string;
  emoji: string;
  label: string;
  size?: number;
}) {
  const h = Math.round(size * 0.72);
  return (
    <span className="flag-icon" title={label}>
      <img
        className="flag-icon__img"
        src={`https://flagcdn.com/w40/${iso}.png`}
        alt=""
        width={size}
        height={h}
        loading="lazy"
        decoding="async"
      />
      <span className="flag-icon__emoji" aria-hidden>
        {emoji}
      </span>
    </span>
  );
}
