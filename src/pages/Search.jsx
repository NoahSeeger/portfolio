import React, { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FaMagnifyingGlass, FaArrowRight, FaXmark } from "react-icons/fa6";
import { getAllPosts, calculateReadTime } from "../lib/blog";
import { useTranslation } from "react-i18next";

function formatDate(dateString, locale = "en") {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, { year: "numeric", month: "short", day: "numeric" });
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function countOccurrences(text, query) {
  if (!query.trim() || !text) return 0;
  const regex = new RegExp(escapeRegex(query), "gi");
  return (text.match(regex) || []).length;
}

function getMatchSnippets(content, query, maxSnippets = 3, ctxChars = 80) {
  if (!query.trim() || !content) return [];
  const regex = new RegExp(escapeRegex(query), "gi");
  const matches = [];
  let match;
  while ((match = regex.exec(content)) !== null && matches.length < maxSnippets) {
    const start = Math.max(0, match.index - ctxChars);
    const end = Math.min(content.length, match.index + match[0].length + ctxChars);
    const snippet = (start > 0 ? "…" : "") + content.slice(start, end) + (end < content.length ? "…" : "");
    matches.push({ text: snippet, index: match.index - start });
  }
  return matches;
}

function highlightAll(text, query) {
  if (!query.trim() || !text) return text;
  const regex = new RegExp(`(${escapeRegex(query)})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} style={{ backgroundColor: "var(--accent)", color: "white", borderRadius: "2px", padding: "0 2px" }}>{part}</mark>
    ) : part
  );
}

export function SearchPage() {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [inputValue, setInputValue] = useState(query);
  const locale = i18n.language;

  useEffect(() => {
    setInputValue(query);
  }, [query]);

  const posts = useMemo(() => getAllPosts(), []);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return posts
      .map((post) => {
        const titleCount = countOccurrences(post.title || "", q);
        const descCount = countOccurrences(post.description || "", q);
        const contentCount = countOccurrences(post.content || "", q);
        const totalCount = titleCount + descCount + contentCount;
        const snippets = getMatchSnippets(post.content || "", q, 3);
        return { ...post, _totalCount: totalCount, _titleCount: titleCount, _descCount: descCount, _contentCount: contentCount, _snippets: snippets };
      })
      .filter((p) => p._totalCount > 0)
      .sort((a, b) => b._totalCount - a._totalCount);
  }, [posts, query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchParams({ q: inputValue });
  };

  const clearSearch = () => {
    setInputValue("");
    setSearchParams({});
  };

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "var(--bg-primary)" }}>
        <h1 className="text-4xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
          {t("search_title", "Search")}
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
          {results.length > 0
            ? `${results.length} ${t("search_results", "resultaten")}${query ? ` ${t("search_for", "für")} "${query}"` : ""}`
            : query
            ? `${t("search_no_results", "Keine Ergebnisse für")} "${query}"`
            : t("search_start", "Tippe um zu suchen")}
        </p>

        <form onSubmit={handleSubmit} className="relative mb-10">
          <FaMagnifyingGlass size={20} className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--text-muted)" }} />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={t("search_placeholder", "Alle Beiträge durchsuchen...")}
            autoFocus
            className="w-full pl-14 pr-12 py-4 rounded-2xl text-base outline-none transition-shadow"
            style={{
              backgroundColor: "var(--bg-secondary)",
              color: "var(--text-primary)",
              border: "1px solid var(--border)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          />
          {inputValue && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors"
              style={{ color: "var(--text-muted)" }}
            >
              <FaXmark size={18} />
            </button>
          )}
        </form>

        {results.length > 0 && (
          <div className="space-y-6">
            {results.map((post) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl p-6 transition-shadow"
                style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)" }}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <Link to={`/blog/${post.slug}`} className="group">
                      <h2 className="text-xl font-bold group-hover:underline break-words leading-tight" style={{ color: "var(--accent)" }}>
                        {highlightAll(post.title, query)}
                      </h2>
                    </Link>
                    <div className="flex items-center gap-3 text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                      <time>{formatDate(post.pubDatetime, locale)}</time>
                      <span>·</span>
                      <span>{calculateReadTime(post.content)} min {t("posts_read", "read")}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex flex-col items-end gap-1">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: "var(--accent)" }}
                    >
                      {post._totalCount} {t("search_matches", "Treffer")}
                    </span>
                    <div className="flex gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
                      {post._titleCount > 0 && <span>{post._titleCount}× title</span>}
                      {post._descCount > 0 && <span>{post._descCount}× desc</span>}
                      {post._contentCount > 0 && <span>{post._contentCount}× content</span>}
                    </div>
                  </div>
                </div>

                <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
                  {highlightAll(post.description, query)}
                </p>

                {post._snippets.length > 0 && (
                  <div className="space-y-2">
                    {post._snippets.map((s, i) => (
                      <div key={i} className="text-sm p-3 rounded-lg" style={{ backgroundColor: "var(--bg-tertiary)", color: "var(--text-secondary)" }}>
                        {highlightAll(s.text, query)}
                      </div>
                    ))}
                  </div>
                )}

                <Link
                  to={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 mt-4 text-sm font-medium transition-colors"
                  style={{ color: "var(--accent)" }}
                >
                  {t("search_read_post", "Zum Beitrag")}
                  <FaArrowRight size={14} />
                </Link>
              </motion.div>
            ))}
          </div>
        )}
    </div>
  );
}