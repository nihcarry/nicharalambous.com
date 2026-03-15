/**
 * Basic grammar and spell check using LanguageTool public API.
 * Outputs JSON suggestions for the Notion-to-blog skill; apply only with user approval.
 *
 * Usage:
 *   npx tsx scripts/check-grammar-spell.ts < content.txt
 *   npx tsx scripts/check-grammar-spell.ts path/to/file.txt
 *   echo "This is an test." | npx tsx scripts/check-grammar-spell.ts
 *
 * Output: JSON array of { offset, length, original, replacements, message, ruleId }.
 */

const LT_API = "https://api.languagetool.org/v2/check";
const MAX_TEXT_LENGTH = 20_000; // Public API limit 20KB

async function main(): Promise<void> {
  let text: string;
  if (process.argv[2]) {
    const fs = await import("fs");
    const path = await import("path");
    const p = path.resolve(process.argv[2]);
    if (!fs.existsSync(p)) {
      console.error("File not found:", p);
      process.exit(1);
    }
    text = fs.readFileSync(p, "utf-8");
  } else {
    text = await readStdin();
  }

  if (!text || !text.trim()) {
    console.error("No text to check. Provide via stdin or file path.");
    process.exit(1);
  }

  if (text.length > MAX_TEXT_LENGTH) {
    text = text.slice(0, MAX_TEXT_LENGTH);
    console.error("Warning: text truncated to", MAX_TEXT_LENGTH, "chars (API limit).");
  }

  const params = new URLSearchParams({
    text,
    language: "en",
  });

  const res = await fetch(LT_API, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!res.ok) {
    console.error("LanguageTool API error:", res.status, await res.text());
    process.exit(1);
  }

  const data = (await res.json()) as {
    matches?: Array<{
      offset: number;
      length: number;
      message: string;
      rule?: { id: string };
      replacements?: Array<{ value: string }>;
      context?: { text: string; offset: number; length: number };
    }>;
  };

  const suggestions = (data.matches || []).map((m) => ({
    offset: m.offset,
    length: m.length,
    original: text.slice(m.offset, m.offset + m.length),
    replacements: (m.replacements || []).map((r) => r.value),
    message: m.message,
    ruleId: m.rule?.id ?? "",
  }));

  console.log(JSON.stringify(suggestions, null, 2));
}

function readStdin(): Promise<string> {
  return new Promise((resolve) => {
    const chunks: Buffer[] = [];
    process.stdin.setEncoding("utf-8");
    process.stdin.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    process.stdin.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
