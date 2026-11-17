import { useState, useMemo, useEffect, useRef } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { FaMagnifyingGlass, FaArrowLeft, FaArrowRight, FaXmark } from "react-icons/fa6";
import searchPosts from "virtual:blog/search";
import { useTranslation } from "react-i18next";
import Seo from "../components/Seo";
import { createSearchIndex, searchNotes, highlightParts } from "../lib/search";
import "./BlogUI.css";
import "./Search.css";

const searchIndex = createSearchIndex(searchPosts);

function Highlight({ text, query }) {
  return highlightParts(text, query).map((part, index) => part.match ? <mark key={index}>{part.text}</mark> : part.text);
}

export function SearchPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get("q") || "";
  const [inputValue, setInputValue] = useState(urlQuery);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);
  const query = inputValue.trim();
  const results = useMemo(() => searchNotes(searchIndex, query), [query]);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    setInputValue(urlQuery);
  }, [urlQuery]);
  useEffect(() => () => clearTimeout(debounceRef.current), []);

  const updateUrl = (value) => {
    setSearchParams((params) => {
      const next = new URLSearchParams(params);
      if (value.trim()) next.set("q", value);
      else next.delete("q");
      return next;
    }, { replace: true });
  };
  const clearSearch = () => {
    clearTimeout(debounceRef.current);
    setInputValue("");
    updateUrl("");
    inputRef.current?.focus();
  };
  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => updateUrl(value), 200);
  };
  const resultLabel = !query ? t("search_start", "Type to search")
    : results.length ? t("search_result_count", { count: results.length, defaultValue: "{{count}} notes found" })
    : t("search_no_results", "No results found");

  return (
    <div className="reading-page search-page">
      <Seo title={t("search_title", "Search")} description={t("search_description")} path="/search" noindex />
      <nav className="reading-topbar" aria-label={t("blog_breadcrumb", "Page navigation")}>
        <Link to="/blog" className="reading-back"><FaArrowLeft aria-hidden="true" />{t("blog_notes", "Notes")}</Link>
      </nav>
      <header className="reading-index-header">
        <div className="reading-index-title-row"><h1>{t("search_title", "Search")}</h1></div>
      </header>
      <form role="search" className="search-form" onSubmit={(event) => { event.preventDefault(); clearTimeout(debounceRef.current); updateUrl(inputValue); }}>
        <FaMagnifyingGlass className="search-field-icon" aria-hidden="true" />
        <label htmlFor="post-search" className="sr-only">{t("search_title", "Search")}</label>
        <input ref={inputRef} id="post-search" type="search" value={inputValue} onChange={handleInputChange}
          onKeyDown={(event) => {
            if (event.key !== "Escape" || event.nativeEvent.isComposing) return;
            event.preventDefault();
            if (inputValue) clearSearch();
            else navigate("/blog");
          }}
          placeholder={t("search_placeholder")} autoFocus autoComplete="off" spellCheck={false} maxLength={200}
          aria-controls="search-results" aria-describedby="search-status" />
        {inputValue && <button type="button" className="search-clear" onClick={clearSearch} aria-label={t("search_clear", "Clear search")}><FaXmark aria-hidden="true" /></button>}
      </form>
      <p id="search-status" className="search-status" role="status" aria-live="polite" aria-atomic="true">{resultLabel}</p>
      <ul id="search-results" className="search-results">
        {results.map(({ post, snippet }) => <li key={post.slug}>
          <Link to={`/blog/${post.slug}`} className="search-result">
            <div className="search-result-heading"><h2><Highlight text={post.title} query={query} /></h2><FaArrowRight aria-hidden="true" /></div>
            <p className="search-result-meta"><time dateTime={post.pubDatetime}>{new Date(post.pubDatetime).toLocaleDateString(i18n.language, { year: "numeric", month: "short", day: "numeric" })}</time><span aria-hidden="true">·</span><span>{post.readTime} min {t("posts_read", "read")}</span></p>
            <p className="search-result-excerpt"><Highlight text={snippet} query={query} /></p>
          </Link>
        </li>)}
      </ul>
      {query && !results.length && <p className="search-empty">{t("search_try_again", "Try a different word or fewer search terms.")}</p>}
    </div>
  );
}
