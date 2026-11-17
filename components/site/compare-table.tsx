/** Content Studio comparison. data-col drives the stacked mobile layout. */
export function CompareTable({ highlight }: { highlight?: string }) {
  const cols = ["Executive Workflow Upgrade Session", "My week with Grok Bot", "Team Workflow Upgrade Session"] as const;
  const rows: { label: string; cells: string[] }[] = [
    {
      label: "What it is",
      cells: [
        "For the CEO: a Grok Bot introduction, a review of your workflow and an upgrade.",
        "A show-and-tell",
        "A hands-on workshop",
      ],
    },
    { label: "Length", cells: ["2 hours", "90 minutes", "2 hours"] },
    {
      label: "Who's in the room",
      cells: [
        "CEOs, and founders running a company. It's one person per session.",
        "Up to 20 people",
        "Up to 8 senior leaders (10 with extra seats), one company",
      ],
    },
    {
      label: "What it covers",
      cells: [
        "A Grok Bot introduction. A review of your current workflow. An upgrade, built during the session on your own work.",
        "My own Grok Bot setup, how I work with it and what's out there to do",
        "Workflow automation in Grok Bot, on each person's own work",
      ],
    },
    {
      label: "What your people do",
      cells: [
        "Then we upgrade it together, on your real work, so you leave with the changes set up and running.",
        "Watch me work and ask questions",
        "Build their own workflow with me",
      ],
    },
    {
      label: "Price",
      cells: [
        "€1,499, one to one, ex VAT",
        "€2,999 per session, ex VAT",
        "€4,999 per session for up to 8, plus €499 per extra seat up to 10 (maximum €5,997), ex VAT.",
      ],
    },
    {
      label: "Where",
      cells: [
        "Virtual by default. In person is possible, with travel extra.",
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
              <th key={col} className={col === highlight ? "hl" : undefined}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th>{row.label}</th>
              {row.cells.map((cell, index) => (
                <td key={cols[index]} className={cols[index] === highlight ? "hl" : undefined} data-col={cols[index]}>
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
