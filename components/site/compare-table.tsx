/** Content Studio comparison. data-col drives the stacked mobile layout. */
export function CompareTable() {
  const cols = ["Lunch and learn", "My week with Grok Bot", "Team Workflow Upgrade Session"] as const;
  const rows: { label: string; cells: string[] }[] = [
    { label: "What it is", cells: ["A talk", "A show-and-tell", "A hands-on workshop"] },
    { label: "Length", cells: ["20 minutes", "90 minutes", "2 hours"] },
    {
      label: "Who's in the room",
      cells: ["Any team size", "Up to 20 people", "Up to 8 senior leaders (10 with extra seats), one company"],
    },
    {
      label: "What it covers",
      cells: [
        "The Output Paradox: why AI makes everyone busier and less engaged",
        "My own Grok Bot setup, how I work with it and what's out there to do",
        "Workflow automation in Grok Bot, on each person's own work",
      ],
    },
    {
      label: "What your people do",
      cells: ["Listen, with time for a few questions", "Watch me work and ask questions", "Build their own workflow with me"],
    },
    {
      label: "Price",
      cells: [
        "€999 per session, ex VAT",
        "€2,999 per session, ex VAT",
        "€4,999 per session for up to 8, plus €499 per extra seat up to 10 (maximum €5,997), ex VAT.",
      ],
    },
    {
      label: "Where",
      cells: [
        "Live on Zoom, Teams or Meet",
        "Virtual by default; in person possible, travel extra",
        "Virtual by default; in person possible, travel extra",
      ],
    },
  ];
  return (
    <div className="cmp-wrap">
      <table className="cmp">
        <thead>
          <tr>
            <th />
            {cols.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th>{row.label}</th>
              {row.cells.map((cell, index) => (
                <td key={cols[index]} data-col={cols[index]}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
