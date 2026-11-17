"use client";

import { useState, type KeyboardEvent } from "react";

/** Content Studio comparison. data-col drives the stacked mobile layout. */
const COLS = ["Executive Workflow Upgrade Session", "My week with Grok Bot", "Team Workflow Upgrade Session"] as const;
const TAB_IDS = ["exec", "my-week", "team"] as const;
const TAB_LABELS = ["Exec", "My Week", "Team"] as const;
const ROWS: { label: string; cells: string[] }[] = [
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

export function CompareTable({ highlight }: { highlight?: string }) {
  const [active, setActive] = useState(0);

  function onTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      next = (index + 1) % TAB_IDS.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      next = (index - 1 + TAB_IDS.length) % TAB_IDS.length;
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = TAB_IDS.length - 1;
    }
    if (next === null) return;
    event.preventDefault();
    setActive(next);
    document.getElementById(`cmp-tab-${TAB_IDS[next]}`)?.focus();
  }

  return (
    <>
      <div className="cmp-tabs" role="tablist" aria-label="Choose a session">
        {TAB_IDS.map((id, index) => {
          const selected = index === active;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              id={`cmp-tab-${id}`}
              aria-controls={`cmp-panel-${id}`}
              aria-selected={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(index)}
              onKeyDown={(event) => onTabKey(event, index)}
            >
              {TAB_LABELS[index]}
            </button>
          );
        })}
      </div>
      <div className="cmp-panels">
        {COLS.map((col, index) => {
          const selected = index === active;
          const id = TAB_IDS[index];
          return (
            <div
              key={id}
              className={selected ? "cmp-session-wrap is-active" : "cmp-session-wrap"}
              role="tabpanel"
              id={`cmp-panel-${id}`}
              aria-labelledby={`cmp-tab-${id}`}
              aria-hidden={selected ? undefined : true}
              inert={selected ? undefined : true}
            >
              <div className="cmp-session">
                <h3>{col}</h3>
                <dl>
                  {ROWS.map((row) => (
                    <div className="cmp-row" key={row.label}>
                      <dt>{row.label}</dt>
                      <dd>{row.cells[index]}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          );
        })}
      </div>
      <div className="cmp-wrap">
        <table className="cmp">
          <thead>
            <tr>
              <th />
              {COLS.map((col) => (
                <th key={col} className={col === highlight ? "hl" : undefined}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.label}>
                <th>{row.label}</th>
                {row.cells.map((cell, index) => (
                  <td key={COLS[index]} className={COLS[index] === highlight ? "hl" : undefined} data-col={COLS[index]}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
