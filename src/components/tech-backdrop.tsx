export function GalaxyOrb({ className = "" }: { className?: string }) {
  return (
    <div className={`galaxy-orb ${className}`} aria-hidden>
      <div className="galaxy-orb__halo" />
      <div className="galaxy-orb__sphere">
        <div className="galaxy-orb__nebula galaxy-orb__nebula--1" />
        <div className="galaxy-orb__nebula galaxy-orb__nebula--2" />
        <div className="galaxy-orb__nebula galaxy-orb__nebula--3" />
        <div className="galaxy-orb__core" />
        <div className="galaxy-orb__stars" />
        <div className="galaxy-orb__ring" />
      </div>
    </div>
  );
}

export const TechOrb = GalaxyOrb;

export function TechBackdrop({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  return (
    <div className={`tech-backdrop ${className}`}>
      <div className="tech-backdrop__grid" aria-hidden />
      {children}
    </div>
  );
}
