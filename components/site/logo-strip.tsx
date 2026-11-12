const LOGOS: Array<
  | { kind: "img"; src: string; alt: string; height: number; width: number }
  | { kind: "word"; name: string }
> = [
  { kind: "img", src: "/v3/mono/standard-bank-ink.png", alt: "Standard Bank", height: 26, width: 102 },
  { kind: "img", src: "/v3/mono/vodacom-ink.png", alt: "Vodacom", height: 26, width: 105 },
  { kind: "word", name: "Old Mutual" },
  { kind: "word", name: "Nedbank" },
  { kind: "img", src: "/v3/mono/coronation-ink.png", alt: "Coronation", height: 17, width: 158 },
  { kind: "img", src: "/v3/mono/danone-ink.png", alt: "Danone", height: 30, width: 92 },
  { kind: "img", src: "/v3/mono/johnson-johnson-ink.png", alt: "Johnson & Johnson", height: 17, width: 182 },
  { kind: "img", src: "/v3/mono/pick-n-pay-ink.png", alt: "Pick n Pay", height: 24, width: 124 },
  { kind: "img", src: "/v3/mono/jse-ink.png", alt: "JSE", height: 26, width: 67 },
  { kind: "img", src: "/v3/mono/sxsw-ink.png", alt: "SXSW", height: 24, width: 103 },
  { kind: "img", src: "/v3/mono/eo-ink.png", alt: "EO", height: 30, width: 108 },
  { kind: "img", src: "/v3/mono/first-technology-ink.png", alt: "First Technology", height: 26, width: 183 },
  { kind: "img", src: "/v3/mono/wesgro-ink.png", alt: "Wesgro", height: 32, width: 67 },
  { kind: "word", name: "FNB" },
];

export function LogoStrip() {
  return (
    <div className="logos">
      {LOGOS.map((logo) =>
        logo.kind === "word" ? (
          <span key={logo.name} className="wmk">
            {logo.name}
          </span>
        ) : (
          <img
            key={logo.alt}
            src={logo.src}
            alt={logo.alt}
            height={logo.height}
            width={logo.width}
            style={{ height: logo.height }}
            loading="lazy"
          />
        ),
      )}
    </div>
  );
}
