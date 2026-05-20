import React, { useState, useEffect, useCallback, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Helmet } from "react-helmet-async";
import { FaCopy, FaCheck, FaRss } from "react-icons/fa6";
import { getAllPosts, formatDateShort, calculateReadTime, groupPostsByYearMonth } from "../lib/blog";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function BlogIndex() {
  const { t, i18n } = useTranslation();
  const posts = getAllPosts();
  const locale = i18n.language === "de" ? "de" : "en";
  const grouped = groupPostsByYearMonth(posts);
  const years = Object.keys(grouped).sort((a, b) => b - a);

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-12">
          <h1 className="text-4xl font-bold">{t("posts_all_title", "Alle Beiträge")}</h1>
          <a
            href="/rss.xml"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="RSS Feed"
            className="text-blue-600 hover:text-blue-700 transition-colors"
          >
            <FaRss size={24} />
          </a>
        </div>

        {years.map((year) => {
          const yearPosts = grouped[year];
          const months = Object.keys(yearPosts).sort((a, b) => b - a);
          const yearCount = Object.values(yearPosts).flat().length;

          return (
            <section key={year} className="mb-12">
              <div className="flex items-baseline gap-3 mb-6">
                <h2 className="text-3xl font-bold">{year}</h2>
                <span className="text-lg text-gray-400">{yearCount}</span>
              </div>
              <div className="h-px bg-gray-200 mb-8" />

              {months.map((monthIdx) => {
                const monthPosts = yearPosts[monthIdx];
                const monthName = MONTH_NAMES[parseInt(monthIdx)];

                return (
                  <div key={monthIdx} className="mb-8">
                    <div className="flex items-baseline gap-3 mb-4">
                      <h3 className="text-xl font-semibold">{monthName}</h3>
                      <span className="text-sm text-gray-400">{monthPosts.length}</span>
                    </div>

                    <div className="space-y-6">
                      {monthPosts.map((post) => {
                        const readTime = calculateReadTime(post.content);
                        return (
                          <Link
                            key={post.slug}
                            to={`/blog/${post.slug}`}
                            className="block group"
                          >
                            <article className="py-4">
                              <h3 className="text-lg sm:text-xl font-semibold text-blue-600 group-hover:underline break-words">
                                {post.title}
                              </h3>
                              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1 flex-wrap">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <time>{formatDateShort(post.pubDatetime, locale)}</time>
                                <span>·</span>
                                <span>{readTime} min {t("posts_read", "read")}</span>
                              </div>
                              <div className="flex gap-4 mt-3">
                                {post.heroImage && (
                                  <img
                                    src={post.heroImage}
                                    alt={post.title}
                                    className="w-28 sm:w-32 h-auto object-cover rounded-lg flex-shrink-0"
                                  />
                                )}
                                <p className="text-gray-600 text-sm sm:text-base line-clamp-2">{post.description}</p>
                              </div>
                            </article>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </section>
          );
        })}

        {posts.length === 0 && (
          <p className="text-center text-gray-500">
            {t("posts_no_posts", "Noch keine Beiträge vorhanden.")}
          </p>
        )}
      </div>
    </div>
  );
}

export function BlogPost({ post }) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const readTime = post ? calculateReadTime(post.content) : 0;
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        setProgress(scrollPercent);
        rafRef.current = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <h1 className="text-2xl">{t("posts_not_found", "Beitrag nicht gefunden")}</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {post && (
        <Helmet>
          <title>{post.title} - Noah Seeger</title>
          <meta name="description" content={post.description} />
          <meta property="og:title" content={post.title} />
          <meta property="og:description" content={post.description} />
          {post.heroImage && <meta property="og:image" content={post.heroImage} />}
        </Helmet>
      )}
      <div
        className="fixed top-0 left-0 h-[5px] bg-blue-600 z-50"
        style={{ width: `${progress}%` }}
      />

      <article className="flex-1 max-w-3xl mx-auto px-4 py-16 w-full">
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4 break-words">{post.title}</h1>

          <div className="flex items-center gap-3 text-sm text-gray-500 flex-wrap">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <time>{formatDateShort(post.pubDatetime, locale)}</time>
            <span className="text-gray-300">·</span>
            <span>{readTime} min {t("posts_read", "read")}</span>
          </div>
        </header>

        {post.heroImage && (
          <div className="aspect-video bg-gray-200 rounded-lg mb-8 overflow-hidden">
            <img
              src={post.heroImage}
              alt={post.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}

        <div className="prose prose-lg max-w-none font-serif
          prose-headings:font-bold prose-headings:tracking-tight
          prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg
          prose-p:text-gray-700 prose-p:leading-relaxed prose-p:text-[17px]
          prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
          prose-img:rounded-lg prose-img:shadow-lg prose-img:my-8 prose-img:w-full
          prose-blockquote:border-l-4 prose-blockquote:border-gray-200 prose-blockquote:pl-6 prose-blockquote:not-italic prose-blockquote:text-gray-700 prose-blockquote:font-semibold
          prose-pre:m-0 prose-pre:p-0 prose-pre:bg-transparent prose-pre:rounded-lg
          prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono
          prose-ul:list-disc prose-ol:list-decimal prose-li:marker:text-gray-400
          prose-strong:font-semibold prose-strong:text-gray-800
          prose-em:not-italic
          prose-table:table prose-table:border-collapse prose-table:w-full
          prose-th:border prose-th:border-gray-300 prose-th:bg-gray-100 prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:font-semibold
          prose-td:border prose-td:border-gray-300 prose-td:px-4 prose-td:py-2
        ">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              const codeString = String(children).replace(/\n$/, "");
              const [copied, setCopied] = useState(false);

              const handleCopy = async () => {
                await navigator.clipboard.writeText(codeString);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              };

              if (!inline && match) {
                return (
                  <div className="not-prose relative my-6 rounded-lg overflow-hidden bg-[#1e1e1e]">
                    <div className="flex items-center justify-between px-4 py-2 text-xs text-gray-400 border-b border-gray-700">
                      <span className="font-mono">{match[1]}</span>
                      <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
                      >
                        {copied ? <FaCheck size={12} /> : <FaCopy size={12} />}
                        <span>{copied ? "Copied!" : "Copy"}</span>
                      </button>
                    </div>
                    <SyntaxHighlighter
                      style={{
                        ...vscDarkPlus,
                        'pre[class*="language-"]': {
                          ...vscDarkPlus['pre[class*="language-"]'],
                          background: '#1e1e1e',
                          color: '#d4d4d4',
                        },
                        'code[class*="language-"]': {
                          ...vscDarkPlus['code[class*="language-"]'],
                          background: '#1e1e1e',
                          color: '#d4d4d4',
                        },
                      }}
                      language={match[1]}
                      PreTag="pre"
                      customStyle={{
                        margin: 0,
                        padding: '1rem',
                        background: '#1e1e1e',
                        fontSize: '0.875rem',
                        lineHeight: '1.5',
                      }}
                    >
                      {codeString}
                    </SyntaxHighlighter>
                  </div>
                );
              }

              return (
                <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                  {children}
                </code>
              );
            }
          }}>
            {post.content}
          </ReactMarkdown>
        </div>
      </article>

      <footer className="border-t border-gray-200 py-8 px-4 mt-auto">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between text-sm">
            <Link
              to="/blog"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t("posts_back", "Back")}
            </Link>

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
            >
              {t("posts_back_to_top", "Back to top")}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}