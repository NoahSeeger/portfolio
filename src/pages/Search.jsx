import { useState, useMemo, useEffect, useRef } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { FaMagnifyingGlass, FaArrowRight, FaXmark } from "react-icons/fa6";
import { getAllPosts, calculateReadTime } from "../lib/blog";
import { useTranslation } from "react-i18next";
import Seo from "../components/Seo";

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
    i % 2 === 1 ? (
      <mark key={i} style={{ backgroundColor: "var(--accent)", color: "white", borderRadius: "2px", padding: "0 2px" }}>{part}</mark>
    ) : part
  );
}

export function SearchPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get("q") || "";
  const [inputValue, setInputValue] = useState(urlQuery);
  const locale = i18n.language;
  const debounceRef = useRef(null);

  // Sync input when URL changes (e.g. back/forward navigation)
  useEffect(() => {
    setInputValue(urlQuery);
  }, [urlQuery]);

  // Escape to go back
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        navigate(-1);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  useEffect(() => () => clearTimeout(debounceRef.current), []);

  const posts = useMemo(() => getAllPosts().filter((post) => post.status !== "archived"), []);

  // Live filter using inputValue (instant, no Enter needed)
  const results = useMemo(() => {
    if (!inputValue.trim()) return [];
    const q = inputValue.toLowerCase();
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
  }, [posts, inputValue]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (value.trim()) {
        setSearchParams({ q: value });
      } else {
        setSearchParams({});
      }
    }, 250);
  };

  const clearSearch = () => {
    setInputValue("");
    setSearchParams({});
  };

  return (
    <div className="min-h-screen w-full pt-16 md:pt-20" style={{ backgroundColor: "var(--bg-primary)" }}>
      <Seo title={t("search_title", "Search")} description={t("search_description", "Search Noah Seeger's notes and project write-ups.")} path="/search" noindex />
        <h1 className="text-4xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
          {t("search_title", "Search")}
        </h1>
        <p className="mb-8 text-sm" style={{ color: "var(--text-muted)" }} aria-live="polite">
          {results.length > 0
            ? `${results.length} ${t("search_results", "results")}${inputValue ? ` ${t("search_for", "for")} "${inputValue}"` : ""}`
            : inputValue
            ? `${t("search_no_results", "No results for")} "${inputValue}"`
            : t("search_start", "Type to search")}
        </p>

        <div className="relative mb-10">
          <FaMagnifyingGlass size={20} className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--text-muted)" }} />
          <label htmlFor="post-search" className="sr-only">{t("search_title", "Search")}</label>
          <input
            id="post-search"
            type="search"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={t("search_placeholder", "Search all posts...")}
            autoFocus
            className="w-full rounded-2xl py-4 pl-14 pr-12 text-base outline-none transition-shadow focus-visible:ring-2"
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
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ color: "var(--text-muted)" }}
              aria-label={t("search_clear", "Clear search")}
            >
              <FaXmark size={18} />
            </button>
          )}
        </div>

        {results.length > 0 && (
          <div className="space-y-6">
            {results.map((post) => (
              <div
                key={post.slug}
                className="search-result-enter rounded-2xl p-6 transition-shadow"
                style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)" }}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <Link to={`/blog/${post.slug}`} className="group">
                      <h2 className="text-xl font-bold group-hover:underline break-words leading-tight" style={{ color: "var(--accent)" }}>
                        {highlightAll(post.title, inputValue)}
                      </h2>
                    </Link>
                    <div className="mt-1 flex items-center gap-3 text-sm" style={{ color: "var(--text-muted)" }}>
                      <time dateTime={post.pubDatetime}>{formatDate(post.pubDatetime, locale)}</time>
                      <span>·</span>
                      <span>{calculateReadTime(post.content)} min {t("posts_read", "read")}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: "var(--accent)" }}
                    >
                      {post._totalCount} {t("search_matches", "Treffer")}
                    </span>
                  </div>
                </div>

                <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
                  {highlightAll(post.description, inputValue)}
                </p>

                {post._snippets.length > 0 && (
                  <div className="space-y-2">
                    {post._snippets.map((s, i) => (
                      <div key={i} className="text-sm p-3 rounded-lg" style={{ backgroundColor: "var(--bg-tertiary)", color: "var(--text-secondary)" }}>
                        {highlightAll(s.text, inputValue)}
                      </div>
                    ))}
                  </div>
                )}

                <Link
                  to={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 mt-4 text-sm font-medium transition-colors"
                  style={{ color: "var(--accent)" }}
                >
                  {t("search_read_post", "Read post")}
                  <FaArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}
