/**
 * Static client / media marks for the Incredible Clients section.
 * Keys are normalized with normalizeClientLogoKey() so CMS strings stay flexible.
 */

function normalizeClientLogoKey(name: string): string {
  let s = name.trim();
  /* Split PascalCase / camelCase so "FirstTechnology" → "first technology" */
  s = s.replace(/([a-z\d])([A-Z])/g, "$1 $2");
  s = s.replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2");
  s = s
    .toLowerCase()
    .replace(/\u2019|\u2018/g, "'");
  /* Align UK spelling with map keys */
  s = s.replace(/\borganisation\b/g, "organization");
  /* Strip trailing qualifiers like "(EO)" from Sanity entries */
  s = s.replace(/\s*\([^)]*\)\s*$/g, "").trim();
  s = s.replace(/\s+/g, " ");
  return s;
}

/** Maps normalized name → path under /public */
const CLIENT_LOGO_SRC = new Map<string, string>([
  ["sxsw", "/logos/clients/sxsw.png"],
  ["standard bank", "/logos/clients/standard-bank.png"],
  ["vodacom", "/logos/clients/vodacom.png"],
  ["bbc", "/logos/clients/bbc.png"],
  ["fast company", "/logos/clients/fast-company.png"],
  ["cnbc africa", "/logos/clients/cnbc-africa.png"],
  ["coronation", "/logos/clients/coronation.png"],
  ["coronation fund managers", "/logos/clients/coronation.png"],
  ["first technology", "/logos/clients/first-technology.png"],
  ["first technology group", "/logos/clients/first-technology.png"],
  ["motus", "/logos/clients/motus.png"],
  ["motus select", "/logos/clients/motus.png"],
  ["eo", "/logos/clients/eo.png"],
  ["entrepreneurs' organization", "/logos/clients/eo.png"],
  ["entrepreneurs organization", "/logos/clients/eo.png"],
  ["wipfli", "/logos/clients/wipfli.png"],
  ["danone", "/logos/clients/danone.png"],
  ["johnson & johnson", "/logos/clients/johnson-johnson.png"],
  ["jse", "/logos/clients/jse.png"],
  ["johannesburg stock exchange", "/logos/clients/jse.png"],
  ["fnb", "/logos/clients/fnb.png"],
  ["first national bank", "/logos/clients/fnb.png"],
  ["yoco", "/logos/clients/yoco.png"],
  ["nedbank", "/logos/clients/nedbank.png"],
  ["sasfin", "/logos/clients/sasfin.png"],
  ["sasko", "/logos/clients/sasko.png"],
  ["orange", "/logos/clients/orange.png"],
  ["old mutual", "/logos/clients/old-mutual.png"],
  ["pick n pay", "/logos/clients/pick-n-pay.png"],
  ["pick 'n pay", "/logos/clients/pick-n-pay.png"],
  ["wesgro", "/logos/clients/wesgro.png"],
]);

const HIDDEN_CLIENT_MARKS = new Set(["liberty", "liberty group"]);

export function filterVisibleClientMarks(names: string[]): string[] {
  return names.filter(
    (name) => !HIDDEN_CLIENT_MARKS.has(normalizeClientLogoKey(name)),
  );
}

export function getClientLogoSrc(name: string): string | undefined {
  const key = normalizeClientLogoKey(name);
  return CLIENT_LOGO_SRC.get(key);
}
