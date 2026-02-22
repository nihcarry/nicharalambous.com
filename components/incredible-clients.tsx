/**
 * Incredible Clients — reusable client logos / "As seen at" section.
 * Displays a list of client/media names in bold Inter uppercase.
 * Used on both homepage and speaker page.
 */

interface IncredibleClientsProps {
  /** List of client/media names to display */
  names: string[];
}

export function IncredibleClients({ names }: IncredibleClientsProps) {
  return (
    <>
      <h2 className="heading-stroke font-extrabold tracking-tight text-center text-4xl uppercase text-brand-900 sm:text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl">
        Incredible Clients
      </h2>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-8">
        {names.map((name) => (
          <span
            key={name}
            className="font-extrabold tracking-tight text-2xl uppercase text-accent-600 sm:text-3xl"
          >
            {name}
          </span>
        ))}
      </div>
    </>
  );
}
