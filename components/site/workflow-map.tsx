const WORKFLOW_MAP_ROWS = [
  {
    workflow: "Marketing",
    today: "Campaigns planned in someone's head",
    after: "Agent researches, drafts and tracks outreach daily",
    owner: "CMO",
  },
  {
    workflow: "Back office",
    today: "Invoices and contracts chased by hand",
    after: "Receipts filed, contracts drafted for sign-off",
    owner: "CFO",
  },
  {
    workflow: "Design",
    today: "Briefs lost in chat threads",
    after: "Options from real assets, ready to pick",
    owner: "Brand lead",
  },
  {
    workflow: "Content",
    today: "Blank page every week",
    after: "Interview in, posts and newsletter out",
    owner: "Content lead",
  },
  {
    workflow: "Paid media",
    today: "Dashboards nobody checks",
    after: "Daily spend and results, with changes suggested",
    owner: "Growth lead",
  },
  {
    workflow: "Business unit COOs",
    today: "Status updates in meetings",
    after: "One scorecard each Friday, blockers flagged",
    owner: "CEO",
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
            {WORKFLOW_MAP_ROWS.map((row, index) => (
              <tr key={row.workflow} className={index === 0 ? "is-on" : undefined}>
                <th scope="row">{row.workflow}</th>
                <td className="wf-today">{row.today}</td>
                <td className="wf-after">
                  {row.after}
                  {index === WORKFLOW_MAP_ROWS.length - 1 ? <span className="wf-caret" aria-hidden="true" /> : null}
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
