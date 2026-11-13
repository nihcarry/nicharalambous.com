import { CookieSettingsButton } from "@/components/cookie-consent";
import { OUTPUT_PARADOX_PATH, SOCIAL } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="site-footer pd-foot">
      <div className="wrap">
        <div className="cols">
          <div>
            <a className="wm" href="/">
              <img src="/favicon.svg" alt="" width={30} height={30} />
              Nic Haralambous
            </a>
            <p className="blurb">
              Keynote speaker, entrepreneur and author. Four startup exits, three books and more than 20 years of building technology businesses.
            </p>
          </div>
          <div>
            <h2>Keynotes</h2>
            <ul>
              <li>
                <a href={OUTPUT_PARADOX_PATH}>The Output Paradox</a>
              </li>
              <li>
                <a href={`${OUTPUT_PARADOX_PATH}#formats`}>Virtual lunch and learn</a>
              </li>
              <li>
                <a href={`${OUTPUT_PARADOX_PATH}#formats`}>In-person keynotes</a>
              </li>
              <li>
                <a href="/contact">Enquire</a>
              </li>
            </ul>
          </div>
          <div>
            <h2>Coaching</h2>
            <ul>
              <li>
                <a href={SOCIAL.nobullship}>No Bull Ship (8 weeks)</a>
              </li>
              <li>
                <a href={SOCIAL.nobullship}>nobullship.co</a>
              </li>
              <li>
                <a href="/session">1:1 coaching sessions</a>
              </li>
            </ul>
            <h2 className="later">Content</h2>
            <ul>
              <li>
                <a href="/#newsletter">Newsletter</a>
              </li>
              <li>
                <a href={SOCIAL.youtube}>YouTube</a>
              </li>
              <li>
                <a href="/blog">Blog</a>
              </li>
              <li>
                <a href="/books">Books</a>
              </li>
              <li>
                <a href="/media">Media</a>
              </li>
            </ul>
          </div>
          <div>
            <h2>Elsewhere</h2>
            <ul>
              <li>
                <a href={SOCIAL.linkedin}>LinkedIn</a>
              </li>
              <li>
                <a href={SOCIAL.youtube}>YouTube</a>
              </li>
              <li>
                <a href={SOCIAL.x}>X</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="legal">
          <span>© 2026 Nic Haralambous</span>
          <nav aria-label="Legal">
            <a href="/privacy">Privacy policy</a>
            <CookieSettingsButton />
            <a href="/rss.xml">RSS</a>
            <a href="/sitemap.xml">Sitemap</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
