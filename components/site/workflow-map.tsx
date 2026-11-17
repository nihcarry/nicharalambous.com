// PLACEHOLDER: Nic to supply real examples before this ships
const WORKFLOW_MAP_ROWS = [
  {
    workflow: "Board pack prep",
    today: "Two days, four people",
    after: "Grok Bot drafts, CFO edits",
    mobileAfter: "Grok Bot drafts",
    owner: "CFO",
    active: true,
  },
  {
    workflow: "Customer escalations",
    today: "Long email chains",
    after: "Agent summarises and routes",
    mobileAfter: "Agent routes",
    owner: "COO",
    active: false,
  },
  {
    workflow: "Hiring pipeline review",
    today: "Weekly meeting",
    after: "Friday digest, no meeting",
    mobileAfter: "Friday digest",
    owner: "CPO",
    active: false,
  },
  {
    workflow: "Monday leadership brief",
    today: "Nobody owns it",
    after: "Agent compiles from",
    mobileAfter: "",
    owner: "CEO",
    active: false,
    caret: true,
    desktopOnly: true,
  },
] as const;

export function WorkflowMap() {
  return (
    <div className="wf-stage">
      <div className="wf-map">
        <div className="wf-head">
          <span className="wf-title">Leadership team · workflow map</span>
          <span className="wf-edited">Edited just now</span>
        </div>
        <table>
          <thead>
            <tr>
              <th scope="col">Workflow</th>
              <th className="wf-today" scope="col">
                Today
              </th>
              <th scope="col">After the session</th>
              <th className="wf-owner" scope="col">
                Owner
              </th>
            </tr>
          </thead>
          <tbody>
            {WORKFLOW_MAP_ROWS.map((row) => (
              <tr
                key={row.workflow}
                className={[row.active ? "is-on" : "", "desktopOnly" in row && row.desktopOnly ? "wf-desk" : ""]
                  .filter(Boolean)
                  .join(" ")}
              >
                <th scope="row">{row.workflow}</th>
                <td className="wf-today">{row.today}</td>
                <td className="wf-after">
                  <span className="wf-full">
                    {row.after}
                    {"caret" in row && row.caret ? <span className="wf-caret" aria-hidden="true" /> : null}
                  </span>
                  {row.mobileAfter ? <span className="wf-short">{row.mobileAfter}</span> : null}
                </td>
                <td className="wf-owner">{row.owner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="wf-cursor" aria-hidden="true">
        <svg width="18" height="20" viewBox="0 0 18 20">
          <path d="M1 1 L16 10 L9 11.5 L6 19 Z" fill="#2563eb" stroke="#fff" strokeWidth="1.2" />
        </svg>
        <span>Nic</span>
      </div>
      <div className="wf-chip">
        <picture>
          <source srcSet="/v3/new/nic-1722-chip.webp" type="image/webp" />
          <img src="/v3/new/nic-1722-chip.jpg" alt="Nic Haralambous" width={320} height={320} />
        </picture>
        <p>
          <span className="wf-name">Nic Haralambous</span>
          <span className="wf-role">Facilitating · editing with your team</span>
          <span className="wf-role-m">Nic is editing</span>
        </p>
      </div>
    </div>
  );
}
