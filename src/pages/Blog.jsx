import { Children, isValidElement, lazy, Suspense, useState, useEffect, useLayoutEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FaCopy, FaCheck, FaArrowLeft } from "react-icons/fa6";
import { formatDateShort, getAllPosts } from "../lib/blog";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import { PostList } from "../components/PostList";
import { useReadingReveal } from "../hooks/useReadingReveal";
import { remarkReadingSections } from "../lib/reading-sections";
import "./BlogUI.css";
import "./BlogPost.css";

const HighlightedCode = lazy(() => import("../components/HighlightedCode"));

function MarkdownLink({ href, children, title }) {
  const path = href?.split(/[?#]/)[0];
  // Use client navigation for pages, but keep asset downloads and fragment
  // links native. Returning home through a note should not reload its intro.
  const internal = path === "/" || path === "/blog" || path?.startsWith("/blog/") || path === "/search";
  return internal ? <Link to={href} title={title}>{children}</Link> : <a href={href} title={title}>{children}</a>;
}

function PlainCode({ children }) {
  return <pre style={{ margin: 0, padding: "1rem", overflow: "auto", fontSize: "0.875rem", lineHeight: "1.5", color: "#d4d4d4", fontFamily: 'Menlo, Monaco, Consolas, "Andale Mono", "Ubuntu Mono", "Courier New", monospace' }}><code style={{ font: "inherit", tabSize: 4 }}>{children}</code></pre>;
}

const SUPPORTED_LANGUAGES = new Set([
  "javascript", "js", "typescript", "ts", "jsx", "tsx", "python", "py",
  "swift", "bash", "shell", "json", "css", "html", "markup", "markdown", "md",
]);

function MarkdownPre({ children }) {
  const items = Children.toArray(children);
  const language = items.length === 1 && isValidElement(items[0])
    ? /language-(\w+)/.exec(items[0].props.className || "")?.[1]?.toLowerCase()
    : null;
  // Highlighted blocks already own a <pre>; preserve the native wrapper for
  // plain or unknown-language blocks instead of nesting <pre> elements.
  return SUPPORTED_LANGUAGES.has(language) ? children : <pre>{children}</pre>;
}

function MarkdownCodeBlock({ inline, className, children, ...props }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef(null);
  const match = /language-(\w+)/.exec(className || "");
  const codeString = String(children).replace(/\n$/, "");

  useEffect(() => () => window.clearTimeout(copyTimeoutRef.current), []);

  const handleCopy = async () => {
    if (!navigator.clipboard?.writeText) return;

    try {
      await navigator.clipboard.writeText(codeString);
      setCopied(true);
      window.clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const language = match?.[1]?.toLowerCase();

  if (!inline && match && SUPPORTED_LANGUAGES.has(language)) {
    return (
      <div className="reading-code-block relative my-6 overflow-hidden rounded-lg" style={{ backgroundColor: "var(--bg-code, #1e1e1e)" }}>
        <div className="flex items-center justify-between border-b px-4 py-2 text-xs" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
          <span className="font-mono">{match[1]}</span>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded px-2 py-1 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ backgroundColor: "transparent", color: "var(--text-muted)", outlineColor: "var(--text-primary)" }}
            aria-label={copied ? t("code_copied") : t("code_copy")}
          >
            {copied ? <FaCheck size={12} /> : <FaCopy size={12} />}
            <span>{copied ? t("code_copied") : t("code_copy")}</span>
          </button>
        </div>
        <Suspense fallback={<PlainCode>{codeString}</PlainCode>}>
          <HighlightedCode language={language}>{codeString}</HighlightedCode>
        </Suspense>
      </div>
    );
  }

  return (
    <code className="rounded px-1.5 py-0.5 text-sm font-mono" style={{ backgroundColor: "var(--bg-tertiary)" }} {...props}>
      {children}
    </code>
  );
}

export function BlogPost({ post }) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const readTime = post?.readTime ?? 0;
  const articleRef = useRef(null);
  const endRef = useRef(null);
  const fadeRef = useRef(null);
  useReadingReveal(articleRef, post?.slug);
  useLayoutEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [post?.slug]);
  useEffect(() => {
    if (!endRef.current || !window.IntersectionObserver) return undefined;
    const observer = new window.IntersectionObserver(([entry]) => {
      if (fadeRef.current) fadeRef.current.style.opacity = entry.isIntersecting ? "0" : "1";
    }, { rootMargin: "0px 0px -80px 0px" });
    observer.observe(endRef.current);
    return () => observer.disconnect();
  }, [post?.slug]);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--bg-primary)" }}>
        <h1 className="text-2xl" style={{ color: "var(--text-primary)" }}>{t("posts_not_found", "Beitrag nicht gefunden")}</h1>
      </div>
    );
  }

  const backLabel = t("blog_all_notes", "All notes");
  const more = getAllPosts().filter((entry) => entry.slug !== post.slug && !entry.draft && Date.parse(entry.pubDatetime) <= Date.now()).slice(0, 2);

  return (
    <div className="reading-page reading-article-page">
      <Seo title={post.title} description={post.description} path={`/blog/${post.slug}`} image={post.heroImage}
        type="article" noindex={post.status === "archived" || post.draft}
        article={{ publishedTime: post.pubDatetime, modifiedTime: post.updatedDatetime }} />
      <nav className="reading-topbar" aria-label={t("blog_breadcrumb", "Page navigation")}>
        <Link to="/blog" className="reading-back"><FaArrowLeft aria-hidden="true" />{backLabel}</Link>
      </nav>
      <article key={post.slug} ref={articleRef}>
        <header className="reading-article-header" data-reading-reveal="">
          <div className="reading-eyebrow">
            <time dateTime={post.pubDatetime}>{formatDateShort(post.pubDatetime, locale)}</time>
            <span>{t("blog_read_time", "{{count}} min read", { count: readTime })}</span>
            {post.draft && <span className="reading-status">{t("posts_draft")}</span>}
          </div>
          <h1>{post.title}</h1>
          <p className="reading-intro">{post.description}</p>

        </header>
        {post.status === "archived" && <aside className="reading-archive-note">{t("posts_archived_notice")}</aside>}
        {post.heroImage && <figure className="reading-cover" data-reading-reveal="">
          <img src={post.heroImage} alt={post.title} width="1600" height="1000" loading="eager" fetchPriority="high" decoding="async" draggable="false" />
        </figure>}
        <div className="reading-body">
          <ReactMarkdown remarkPlugins={[remarkGfm, remarkReadingSections]} components={{
            a: MarkdownLink,
            code: MarkdownCodeBlock,
            pre: MarkdownPre,
            img: ({ src, alt, title }) => <img src={src} alt={alt || ""} title={title} loading="lazy" decoding="async" />,
            table: ({ children }) => <div className="reading-table"><table>{children}</table></div>,
          }}>{post.content}</ReactMarkdown>
        </div>

      </article>
      {more.length > 0 && <section className="reading-more" aria-labelledby="more-writing">
        <div className="reading-more-heading"><h2 id="more-writing">{t("blog_more_notes", "More notes")}</h2><Link to="/blog">{t("blog_view_all", "View all")}</Link></div>
        <PostList posts={more} label={t("blog_more_notes", "More notes")} />
      </section>}
      <span ref={endRef} className="reading-end-sentinel" aria-hidden="true" />
      <div ref={fadeRef} className="reading-bottom-fade" aria-hidden="true" />
    </div>
  );
}
