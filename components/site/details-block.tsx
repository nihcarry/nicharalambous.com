import "./details-block.css";

export type DetailsIconName =
  | "clock"
  | "price"
  | "recording"
  | "preparation"
  | "qa"
  | "service";

export type DetailsBlockItem = {
  label: string;
  value: string;
  icon: DetailsIconName;
};

export type DetailsBlockProps = {
  heading: string;
  items: readonly DetailsBlockItem[];
  id?: string;
  className?: string;
};

function DetailIcon({ name }: { name: DetailsIconName }) {
  switch (name) {
    case "clock":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="8.25" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path
            d="M12 8v4.4l3 1.6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
    case "price":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="8.25" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path
            d="M12 7.5v9M9.4 9.2c.6-.8 1.5-1.2 2.6-1.2 1.7 0 2.7.9 2.7 2.1 0 2.8-4.8 1.6-4.8 4.2 0 1.1 1 2 2.7 2 1.2 0 2.1-.4 2.6-1.2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
    case "recording":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect
            x="3.5"
            y="6.5"
            width="13"
            height="11"
            rx="1.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M16.5 10.2 20 8.4v7.2l-3.5-1.8z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "preparation":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M5.5 18.5V8.2L12 4.8l6.5 3.4v10.3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M9.2 18.5v-5.2h5.6v5.2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
        </svg>
      );
    case "qa":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M5.5 16.2 4 19.5l4-1.4c.9.4 1.9.6 3 .6 3.9 0 7-2.8 7-6.3S14.9 6 11 6 4 8.9 4 12.4c0 1.4.5 2.7 1.5 3.8z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "service":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 4.8 13.6 9h4.6l-3.7 2.8 1.4 4.4L12 13.6 8.1 16.2l1.4-4.4L5.8 9h4.6z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}

export function DetailsBlock({ heading, items, id, className }: DetailsBlockProps) {
  const sectionClass = ["talk-details", className ?? ""].filter(Boolean).join(" ");
  return (
    <section className={sectionClass} id={id} data-component="details-block">
      <div className="wrap">
        <h2>{heading}</h2>
        <ul className="td-grid">
          {items.map((item) => (
            <li key={item.label}>
              <span className="td-ico">
                <DetailIcon name={item.icon} />
              </span>
              <div>
                <span className="td-k">{item.label}</span>
                <p>{item.value}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
