import React from "react";
import ReactMarkdown from "react-markdown";
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
        <h1 className="text-4xl font-bold mb-12">{t("posts_all_title", "Alle Beiträge")}</h1>

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
                              <h3 className="text-xl font-bold text-blue-600 group-hover:underline">
                                {post.title}
                              </h3>
                              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <time>{formatDateShort(post.pubDatetime, locale)}</time>
                                <span>·</span>
                                <span>{readTime} min {t("posts_read", "read")}</span>
                              </div>
                              <p className="text-gray-600 mt-2 line-clamp-2">{post.description}</p>
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

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <h1 className="text-2xl">{t("posts_not_found", "Beitrag nicht gefunden")}</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <article className="flex-1 max-w-2xl mx-auto px-6 py-16 w-full">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">{post.title}</h1>

          <div className="flex items-center gap-3 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <time>{formatDateShort(post.pubDatetime, locale)}</time>
            <span className="text-gray-300">·</span>
            <span>{readTime} min {t("posts_read", "read")}</span>
          </div>
        </header>

        <div className="prose prose-lg max-w-none
          prose-headings:font-bold prose-headings:tracking-tight
          prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg
          prose-p:text-gray-700 prose-p:leading-relaxed prose-p:text-[17px]
          prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
          prose-img:rounded-lg prose-img:shadow-lg prose-img:my-8
          prose-blockquote:border-l-4 prose-blockquote:border-gray-200 prose-blockquote:pl-6 prose-blockquote:not-italic prose-blockquote:text-gray-700 prose-blockquote:font-semibold
          prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
          prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-lg
          prose-ul:list-disc prose-ol:list-decimal prose-li:marker:text-gray-400
          prose-strong:font-semibold prose-strong:text-gray-800
          prose-em:not-italic
        ">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </article>

      <footer className="border-t border-gray-200 py-8 px-6 mt-auto">
        <div className="max-w-2xl mx-auto">
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-sm font-medium text-gray-600"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

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