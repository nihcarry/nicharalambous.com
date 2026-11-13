/**
 * Dark closing band. Left edge matches the 1240px page column.
 */
export function ClosingCta({
  heading,
  copy,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  className = "",
}: {
  heading: string;
  copy: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  className?: string;
}) {
  return (
    <section className={`dark closing${className ? ` ${className}` : ""}`}>
      <div className="wrap">
        <h2>{heading}</h2>
        <p className="lead">{copy}</p>
        <div className="acts">
          <a className="btn" href={primaryHref}>
            {primaryLabel}
          </a>
          {secondaryHref && secondaryLabel ? (
            <a className="quiet-link" href={secondaryHref}>
              {secondaryLabel}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
