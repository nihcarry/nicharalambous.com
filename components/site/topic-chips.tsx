import { BLOG_TOPICS, blogPagePath } from "@/lib/blog-index";

export function TopicChips({ active }: { active?: string }) {
  return (
    <nav className="topic-chips" aria-label="Topics">
      <a className={!active ? "is-on" : undefined} href={blogPagePath(1)}>
        All
      </a>
      {BLOG_TOPICS.map((topic) => (
        <a
          key={topic.slug}
          className={active === topic.slug ? "is-on" : undefined}
          href={`/topics/${topic.slug}`}
        >
          {topic.title}
        </a>
      ))}
    </nav>
  );
}
