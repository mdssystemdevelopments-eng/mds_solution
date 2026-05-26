type Props = {
  src: string;
};

export function SiteImageBackground({ src }: Props) {
  return (
    <div className="page-bg" aria-hidden>
      <div className="page-bg__image" style={{ backgroundImage: `url(${src})` }} />
      <div className="page-bg__shade" />
    </div>
  );
}
