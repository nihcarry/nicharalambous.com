/**
 * YouTube video import script.
 *
 * Fetches recent videos from a YouTube channel RSS feed, pulls transcripts,
 * generates summaries, and creates blog post drafts in Sanity.
 * Skips YouTube Shorts and previously imported videos (idempotent via createOrReplace).
 *
 * Environment:
 *   YOUTUBE_CHANNEL_ID — required, the channel ID (starts with UC)
 *   SANITY_WRITE_TOKEN — required, Editor role token from sanity.io/manage
 *   NEXT_PUBLIC_SANITY_PROJECT_ID — from .env / .env.local
 *   NEXT_PUBLIC_SANITY_DATASET — defaults to "production"
 *
 * Usage:
 *   npx tsx scripts/import-youtube-video.ts                     # Import all new videos
 *   npx tsx scripts/import-youtube-video.ts --video-id=abc123   # Import specific video
 *   npx tsx scripts/import-youtube-video.ts --dry-run           # Preview without writing
 *   npx tsx scripts/import-youtube-video.ts --limit 5           # Limit to 5 most recent
 */

import "./load-env";
import { YouTubeTranscriptApi } from "youtube-transcript-api-js";

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "lsivhm7f";
const API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-02-14";
const SANITY_WRITE_TOKEN =
  process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_WRITE_TOKEN;
const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

// ─── YouTube RSS parsing ──────────────────────────────────────────────

interface YouTubeVideo {
  videoId: string;
  title: string;
  publishedAt: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  isShort: boolean;
}

async function fetchYouTubeRSS(channelId: string): Promise<YouTubeVideo[]> {
  const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;

  const response = await fetch(feedUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch YouTube RSS: ${response.status}`);
  }

  const xml = await response.text();
  const videos: YouTubeVideo[] = [];

  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let match;

  while ((match = entryRegex.exec(xml)) !== null) {
    const entry = match[1];

    const videoId = extractTag(entry, "yt:videoId");
    const title = extractTag(entry, "title");
    const published = extractTag(entry, "published");
    const videoUrl = extractAttr(entry, "link", "href") || "";
    const description = extractTag(entry, "media:description") || "";
    const thumbnailUrl =
      extractAttr(entry, "media:thumbnail", "url") ||
      `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

    if (videoId && title && published) {
      videos.push({
        videoId,
        title: decodeHtmlEntities(title),
        publishedAt: published,
        description: decodeHtmlEntities(description),
        thumbnailUrl,
        videoUrl,
        isShort: videoUrl.includes("/shorts/"),
      });
    }
  }

  return videos;
}

function extractTag(xml: string, tag: string): string {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const match = xml.match(regex);
  return match ? match[1].trim() : "";
}

function extractAttr(xml: string, tag: string, attr: string): string | null {
  const regex = new RegExp(`<${tag}[^>]*${attr}="([^"]*)"`, "i");
  const match = xml.match(regex);
  return match ? match[1] : null;
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&hellip;/g, "...")
    .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num, 10)));
}

// ─── Transcript fetching ──────────────────────────────────────────────

interface TranscriptSegment {
  text: string;
  start: number;
  duration: number;
}

async function fetchTranscript(videoId: string): Promise<string | null> {
  try {
    const api = new YouTubeTranscriptApi();
    const transcript = await api.fetch(videoId, ["en"]);

    if (!transcript || !transcript.snippets || transcript.snippets.length === 0) {
      console.log(`    No transcript available for ${videoId}`);
      return null;
    }

    // Join all transcript segments into plain text and decode HTML entities
    const fullText = transcript.snippets
      .map((segment: TranscriptSegment) => decodeHtmlEntities(segment.text))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    return fullText;
  } catch (err) {
    console.log(`    Transcript fetch failed for ${videoId}: ${err}`);
    return null;
  }
}

// ─── HTML formatting ──────────────────────────────────────────────────

/** Group a block of prose into readable paragraphs (~4 sentences each). */
function groupIntoParagraphs(text: string): string[] {
  const sentences = text
    .replace(/([.!?])\s+/g, "$1|")
    .split("|")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const paragraphs: string[] = [];
  let current: string[] = [];
  for (const sentence of sentences) {
    current.push(sentence);
    if (current.length >= 4) {
      paragraphs.push(current.join(" "));
      current = [];
    }
  }
  if (current.length > 0) paragraphs.push(current.join(" "));
  return paragraphs;
}

/** Trim promotional boilerplate that follows the first "---" in a YouTube description. */
function cleanDescription(description: string): string {
  const cut = description.split(/\n-{2,}\n/)[0] ?? description;
  return cut.trim();
}

/**
 * Build the post body as raw HTML.
 *
 * The video embed is ALWAYS included at the top so a post is never empty,
 * even when the transcript can't be fetched. The transcript (when available)
 * provides body copy to work from; otherwise we fall back to the cleaned
 * YouTube description.
 */
function buildRawHtmlBody(
  videoId: string,
  title: string,
  transcript: string | null,
  description: string
): string {
  const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0`;

  const embed = `
<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; margin-bottom: 2rem;">
  <iframe 
    src="${embedUrl}" 
    title="${title.replace(/"/g, "&quot;")}"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; border-radius: 8px;"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
    allowfullscreen>
  </iframe>
</div>`.trim();

  let copy: string;
  if (transcript && transcript.trim().length > 0) {
    const paragraphs = groupIntoParagraphs(transcript)
      .map((p) => `<p>${escapeHtml(p)}</p>`)
      .join("\n\n");
    copy = `<h2>Video Transcript</h2>\n\n${paragraphs}`;
  } else {
    const desc = cleanDescription(description);
    copy = desc
      ? desc
          .split(/\n{2,}/)
          .map((p) => p.trim())
          .filter(Boolean)
          .map((p) => `<p>${escapeHtml(p)}</p>`)
          .join("\n\n")
      : `<p>Watch the video above.</p>`;
  }

  return `${embed}\n\n${copy}`.trim();
}

function extractVideoId(url: string): string {
  const match = url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?]+)/);
  return match ? match[1] : "";
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ─── Topic detection ──────────────────────────────────────────────────

const TOPIC_KEYWORDS: Record<
  string,
  { primary: string[]; secondary: string[] }
> = {
  curiosity: {
    primary: [
      "curiosity",
      "curious",
      "question",
      "wonder",
      "explore",
      "discovery",
      "learn",
    ],
    secondary: [
      "experiment",
      "interest",
      "investigate",
      "ask",
      "unknown",
      "surprise",
      "new idea",
      "open mind",
    ],
  },
  innovation: {
    primary: [
      "innovation",
      "innovate",
      "disrupt",
      "breakthrough",
      "invent",
      "creative",
      "build",
    ],
    secondary: [
      "technology",
      "product",
      "iterate",
      "prototype",
      "design",
      "ship",
      "launch",
      "create",
      "maker",
    ],
  },
  entrepreneurship: {
    primary: [
      "entrepreneur",
      "startup",
      "business",
      "founder",
      "company",
      "venture",
    ],
    secondary: [
      "hustle",
      "customer",
      "revenue",
      "profit",
      "market",
      "growth",
      "scale",
      "pivot",
      "investor",
      "funding",
      "bootstrapp",
    ],
  },
  focus: {
    primary: [
      "focus",
      "distraction",
      "attention",
      "screen time",
      "digital",
      "mindful",
      "present",
    ],
    secondary: [
      "phone",
      "social media",
      "scroll",
      "productivity",
      "deep work",
      "concentration",
      "boredom",
      "habit",
      "discipline",
      "addiction",
    ],
  },
  ai: {
    primary: [
      "artificial intelligence",
      " ai ",
      "machine learning",
      "chatgpt",
      "llm",
      "generative",
    ],
    secondary: [
      "algorithm",
      "automat",
      "neural",
      "model",
      "prompt",
      "robot",
      "copilot",
      "claude",
      "openai",
      "gpt",
    ],
  },
  agency: {
    primary: [
      "agency",
      "autonomy",
      "choice",
      "control",
      "decision",
      "ownership",
      "empower",
    ],
    secondary: [
      "action",
      "proactive",
      "initiative",
      "self-determin",
      "independen",
      "accountab",
      "responsib",
      "intention",
    ],
  },
  failure: {
    primary: [
      "failure",
      "fail",
      "mistake",
      "wrong",
      "error",
      "setback",
      "loss",
    ],
    secondary: [
      "resilience",
      "bounce back",
      "lesson",
      "recover",
      "overcome",
      "persist",
      "grit",
      "tough",
      "struggle",
      "adversity",
    ],
  },
};

const TOPIC_TO_KEYNOTE: Record<string, string> = {
  curiosity: "curiosity-catalyst",
  innovation: "breakthrough-product-teams",
  entrepreneurship: "breakthrough-product-teams",
  focus: "reclaiming-focus",
  ai: "reclaiming-focus",
  agency: "reclaiming-focus",
  failure: "curiosity-catalyst",
};

function detectTopics(text: string): { slug: string; score: number }[] {
  const lowerText = ` ${text.toLowerCase()} `;

  const scores = Object.entries(TOPIC_KEYWORDS).map(([slug, keywords]) => {
    let score = 0;

    for (const kw of keywords.primary) {
      const regex = new RegExp(kw, "gi");
      const matches = lowerText.match(regex);
      score += (matches?.length || 0) * 3;
    }

    for (const kw of keywords.secondary) {
      const regex = new RegExp(kw, "gi");
      const matches = lowerText.match(regex);
      score += (matches?.length || 0) * 1;
    }

    return { slug, score };
  });

  return scores.filter((s) => s.score > 0).sort((a, b) => b.score - a.score);
}

// ─── Slug generation ──────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 96);
}

// ─── Sanity API helpers ───────────────────────────────────────────────

interface SanityRef {
  _type: "reference";
  _ref: string;
  _key?: string;
}

async function sanityQuery<T>(query: string, dataset: string): Promise<T> {
  const params = new URLSearchParams({ query });
  const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${dataset}?${params}`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${SANITY_WRITE_TOKEN}` },
  });

  if (!response.ok) {
    throw new Error(
      `Sanity query failed: ${response.status} ${await response.text()}`
    );
  }

  const json = await response.json();
  return json.result as T;
}

async function sanityMutate(
  mutations: Record<string, unknown>[],
  dataset: string
): Promise<{ transactionId: string; documentIds: string[] }> {
  const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${dataset}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SANITY_WRITE_TOKEN}`,
    },
    body: JSON.stringify({ mutations }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Sanity mutation failed: ${response.status} ${errorText}`);
  }

  const json = await response.json();
  return {
    transactionId: json.transactionId || "",
    documentIds: (json.results || []).map((r: { id: string }) => r.id),
  };
}

async function fetchTopicHubMap(dataset: string): Promise<Map<string, string>> {
  const hubs = await sanityQuery<{ _id: string; slug: string }[]>(
    `*[_type == "topicHub"]{ _id, "slug": slug.current }`,
    dataset
  );

  const map = new Map<string, string>();
  for (const hub of hubs) {
    if (hub.slug) map.set(hub.slug, hub._id);
  }
  return map;
}

async function fetchKeynoteMap(dataset: string): Promise<Map<string, string>> {
  const keynotes = await sanityQuery<{ _id: string; slug: string }[]>(
    `*[_type == "keynote"]{ _id, "slug": slug.current }`,
    dataset
  );

  const map = new Map<string, string>();
  for (const keynote of keynotes) {
    if (keynote.slug) map.set(keynote.slug, keynote._id);
  }
  return map;
}

/**
 * Fetch status + whether a hand-written Portable Text body exists for the
 * already-imported YouTube posts, so re-runs don't reset your published
 * status or overwrite content you've edited in Studio.
 */
async function fetchExistingPosts(
  dataset: string
): Promise<Map<string, ExistingPost>> {
  const rows = await sanityQuery<
    { _id: string; contentStatus?: string; hasBody?: boolean; excerpt?: string }[]
  >(
    `*[_type == "post" && _id match "imported-youtube-*"]{ _id, contentStatus, excerpt, "hasBody": defined(body) && length(body) > 0 }`,
    dataset
  );

  const map = new Map<string, ExistingPost>();
  for (const row of rows) {
    map.set(row._id, {
      contentStatus: row.contentStatus,
      hasBody: row.hasBody,
      excerpt: row.excerpt,
    });
  }
  return map;
}

// ─── Document building ────────────────────────────────────────────────

interface ExistingPost {
  contentStatus?: string;
  hasBody?: boolean;
  excerpt?: string;
}

function buildSanityDocument(
  video: YouTubeVideo,
  transcript: string | null,
  topicMap: Map<string, string>,
  keynoteMap: Map<string, string>,
  existing?: ExistingPost
): Record<string, unknown> {
  // Use transcript for topic detection if available, otherwise use title + description
  const textForAnalysis = transcript
    ? `${video.title} ${transcript}`
    : `${video.title} ${video.description}`;

  const topicScores = detectTopics(textForAnalysis);
  const topicSlugs = topicScores.slice(0, 3).map((t) => t.slug);
  if (topicSlugs.length === 0) topicSlugs.push("curiosity");

  const topicRefs: SanityRef[] = topicSlugs
    .map((slug) => topicMap.get(slug))
    .filter((id): id is string => !!id)
    .map((id) => ({
      _type: "reference" as const,
      _ref: id,
      _key: id,
    }));

  const primaryTopic = topicSlugs[0];
  const keynoteSlug = TOPIC_TO_KEYNOTE[primaryTopic] || "curiosity-catalyst";
  const keynoteId = keynoteMap.get(keynoteSlug);
  const relatedKeynote: SanityRef | undefined = keynoteId
    ? { _type: "reference", _ref: keynoteId }
    : undefined;

  // Excerpt / TL;DR. Preserve an existing excerpt (hand-written or generated by
  // `npm run tldr`) so re-imports never clobber a meaningful TL;DR. Brand-new
  // imports are deliberately left with an empty excerpt — `npm run tldr` then
  // reads the transcript and writes a real TL;DR (see scripts/generate-tldrs.ts).
  const excerpt =
    existing?.excerpt && existing.excerpt.trim().length > 0
      ? existing.excerpt.trim()
      : "";

  // Always build a body with the video embedded at the top, plus body copy
  // from the transcript (or the description as a fallback). Never empty.
  const rawHtmlBody = buildRawHtmlBody(
    video.videoId,
    video.title,
    transcript,
    video.description
  );

  // Calculate read time from transcript
  const wordCount = transcript ? transcript.split(/\s+/).length : 0;
  const estimatedReadTime = wordCount > 0 ? Math.max(1, Math.round(wordCount / 225)) : undefined;

  // SEO fields
  let seoTitle = video.title;
  if (seoTitle.length > 70) {
    seoTitle = seoTitle.substring(0, 67) + "...";
  }

  let seoDescription = excerpt;
  if (seoDescription.length > 160) {
    seoDescription = seoDescription.substring(0, 157) + "...";
  }

  const slug = slugify(video.title);

  return {
    _id: `imported-youtube-${video.videoId}`,
    _type: "post",
    title: video.title,
    slug: { _type: "slug", current: slug },
    publishedAt: video.publishedAt,
    excerpt,
    rawHtmlBody,
    // Don't set videoEmbed - video is embedded in rawHtmlBody, no need for VideoReadAlong component
    videoEmbed: null,
    estimatedReadTime,
    // Preserve the status of an already-imported post (e.g. one you've
    // published or moved to in-review). New imports start as ai-draft.
    contentStatus: existing?.contentStatus ?? "ai-draft",
    originalUrl: video.videoUrl,
    topics: topicRefs.length > 0 ? topicRefs : undefined,
    relatedKeynote: relatedKeynote || undefined,
    seo: {
      _type: "seoFields",
      seoTitle,
      seoDescription,
    },
  };
}

// ─── CLI parsing ──────────────────────────────────────────────────────

interface CliArgs {
  dataset: string;
  videoId?: string;
  limit?: number;
  dryRun: boolean;
}

function parseArgs(): CliArgs {
  const args = process.argv.slice(2);
  const result: CliArgs = {
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    dryRun: false,
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--dataset" && args[i + 1]) {
      result.dataset = args[i + 1];
      i++;
    } else if (args[i].startsWith("--video-id=")) {
      result.videoId = args[i].split("=")[1];
    } else if (args[i] === "--video-id" && args[i + 1]) {
      result.videoId = args[i + 1];
      i++;
    } else if (args[i] === "--limit" && args[i + 1]) {
      result.limit = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === "--dry-run") {
      result.dryRun = true;
    }
  }

  return result;
}

// ─── Main ─────────────────────────────────────────────────────────────

export async function importYouTubeVideos(options?: {
  dryRun?: boolean;
  limit?: number;
  videoId?: string;
}): Promise<{ imported: string[]; skipped: string[] }> {
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const dryRun = options?.dryRun ?? false;

  if (!YOUTUBE_CHANNEL_ID) {
    throw new Error("YOUTUBE_CHANNEL_ID not set");
  }

  if (!SANITY_WRITE_TOKEN) {
    throw new Error("SANITY_WRITE_TOKEN not set");
  }

  console.log(`📺 YouTube Import (with transcripts)\n`);
  console.log(`  Channel:  ${YOUTUBE_CHANNEL_ID}`);
  console.log(`  Dataset:  ${dataset}`);
  console.log(`  Dry run:  ${dryRun}`);

  // Fetch videos from RSS
  console.log(`\n  Fetching YouTube RSS feed...`);
  let videos = await fetchYouTubeRSS(YOUTUBE_CHANNEL_ID);
  console.log(`  Found ${videos.length} videos in feed`);

  // Filter by specific video ID if provided
  if (options?.videoId) {
    videos = videos.filter((v) => v.videoId === options.videoId);
    if (videos.length === 0) {
      console.log(`  ⚠ Video ${options.videoId} not found in RSS feed`);
      return { imported: [], skipped: [] };
    }
  }

  // Filter out Shorts
  const regularVideos = videos.filter((v) => !v.isShort);
  const shortsCount = videos.length - regularVideos.length;
  if (shortsCount > 0) {
    console.log(`  Skipping ${shortsCount} Shorts`);
  }

  // Apply limit
  let videosToImport = regularVideos;
  if (options?.limit) {
    videosToImport = regularVideos.slice(0, options.limit);
  }

  if (videosToImport.length === 0) {
    console.log(`  No videos to import`);
    return { imported: [], skipped: [] };
  }

  console.log(`  Videos to import: ${videosToImport.length}`);

  // Fetch reference maps from Sanity
  console.log(`\n  Fetching reference data from Sanity...`);
  const topicMap = await fetchTopicHubMap(dataset);
  const keynoteMap = await fetchKeynoteMap(dataset);
  const existingPosts = await fetchExistingPosts(dataset);
  console.log(`  Topic hubs: ${topicMap.size}`);
  console.log(`  Keynotes: ${keynoteMap.size}`);
  console.log(`  Already imported: ${existingPosts.size}`);

  // Process each video
  const imported: string[] = [];
  const skipped: string[] = [];

  for (const video of videosToImport) {
    console.log(`\n  Processing: ${video.title}`);

    // Fetch transcript
    console.log(`    Fetching transcript...`);
    const transcript = await fetchTranscript(video.videoId);

    if (transcript) {
      const wordCount = transcript.split(/\s+/).length;
      console.log(`    Transcript: ${wordCount} words`);
    } else {
      console.log(`    No transcript available - will use description only`);
    }

    // Skip posts you've hand-edited in Studio (Portable Text body present),
    // so the import never overwrites your own writing.
    const docId = `imported-youtube-${video.videoId}`;
    const existing = existingPosts.get(docId);
    if (existing?.hasBody) {
      console.log(`    ⏭ Skipping - has a hand-written body in Studio`);
      skipped.push(video.videoId);
      continue;
    }

    // Build document (preserving existing status if already imported)
    const doc = buildSanityDocument(
      video,
      transcript,
      topicMap,
      keynoteMap,
      existing
    );

    // Dry run preview
    if (dryRun) {
      console.log(`    Would create: ${doc._id}`);
      console.log(`    Slug: ${(doc.slug as { current: string }).current}`);
      console.log(`    Excerpt: ${(doc.excerpt as string).substring(0, 80)}...`);
      skipped.push(video.videoId);
      continue;
    }

    // Import to Sanity
    try {
      await sanityMutate([{ createOrReplace: doc }], dataset);
      imported.push(video.videoId);
      console.log(`    ✅ Imported`);
    } catch (err) {
      skipped.push(video.videoId);
      console.log(`    ❌ Failed: ${err}`);
    }
  }

  console.log(`\n✅ Import complete:`);
  console.log(`   Imported: ${imported.length}`);
  console.log(`   Skipped:  ${skipped.length}`);

  return { imported, skipped };
}

async function main(): Promise<void> {
  const cliArgs = parseArgs();

  if (!YOUTUBE_CHANNEL_ID) {
    console.error(
      "❌ YOUTUBE_CHANNEL_ID not set. Add to .env.local:\n" +
        "   YOUTUBE_CHANNEL_ID=UCTMwZmHH1VNLA2viHKwbvoA"
    );
    process.exit(1);
  }

  if (!SANITY_WRITE_TOKEN) {
    console.error(
      "❌ SANITY_WRITE_TOKEN not set. Add to .env.local or export as env var.\n" +
        "   Create a token at: https://www.sanity.io/manage → project → API → Tokens"
    );
    process.exit(1);
  }

  await importYouTubeVideos({
    dryRun: cliArgs.dryRun,
    limit: cliArgs.limit,
    videoId: cliArgs.videoId,
  });
}

// Run if executed directly
if (require.main === module) {
  main().catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
  });
}
