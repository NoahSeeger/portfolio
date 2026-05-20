import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaMagnifyingGlass, FaArrowRight, FaXmark } from "react-icons/fa6";
import { getAllPosts, calculateReadTime } from "../lib/blog";
import { useTranslation } from "react-i18next";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function formatDate(dateString, locale = "en") {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, { year: "numeric", month: "short", day: "numeric" });
}

function highlightMatch(text, query) {
  if (!query.trim() || !text) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} style={{ backgroundColor: "var(--accent)", color: "white", borderRadius: "2px", padding: "0 2px" }}>{part}</mark>
    ) : (
      part
    )
  );
}

function searchPosts(posts, query, locale) {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return posts
    .filter((post) => {
      return (
        post.title?.toLowerCase().includes(q) ||
        post.description?.toLowerCase().includes(q) ||
        post.content?.toLowerCase().includes(q)
      );
    })
    .slice(0, 8);
}

export function SearchModal({ isOpen, onClose }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);
  const locale = i18n.language;

  const posts = useMemo(() => getAllPosts(), []);
  const results = useMemo(() => searchPosts(posts, query, locale), [posts, query, locale]);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (!results.length) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => (i + 1) % results.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => (i - 1 + results.length) % results.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        const post = results[selectedIndex];
        if (post) {
          navigate(`/blog/${post.slug}`);
          onClose();
        }
      }
    },
    [results, selectedIndex, navigate, onClose]
  );

  const handleResultClick = (slug) => {
    navigate(`/blog/${slug}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] px-4"
        onClick={onClose}
      >
        <div className="fixed inset-0 backdrop-blur-sm" style={{ backgroundColor: "rgba(0,0,0,0.4)" }} />

        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.98 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden"
          style={{ backgroundColor: "var(--bg-secondary)" }}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={handleKeyDown}
        >
          <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
            <FaMagnifyingGlass size={20} style={{ color: "var(--text-muted)" }} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("search_placeholder", "Alle Beiträge durchsuchen...")}
              className="flex-1 bg-transparent outline-none text-base"
              style={{ color: "var(--text-primary)" }}
            />
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: "var(--text-muted)" }}
            >
              <FaXmark size={16} />
            </button>
          </div>

          {query.trim() === "" ? (
            <div className="px-5 py-8 text-center" style={{ color: "var(--text-muted)" }}>
              <p className="text-sm">{t("search_hint", "Tippe um Beiträge zu durchsuchen")}</p>
            </div>
          ) : results.length === 0 ? (
            <div className="px-5 py-8 text-center" style={{ color: "var(--text-muted)" }}>
              <p className="text-sm">{t("search_no_results", "Keine Ergebnisse gefunden")}</p>
            </div>
          ) : (
            <ul className="max-h-[60vh] overflow-y-auto py-2">
              {results.map((post, i) => (
                <li key={post.slug}>
                  <button
                    onClick={() => handleResultClick(post.slug)}
                    className="w-full px-5 py-3 flex items-start gap-4 text-left transition-colors"
                    style={{
                      backgroundColor: i === selectedIndex ? "var(--bg-tertiary)" : "transparent"
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-sm font-medium truncate"
                          style={{ color: "var(--accent)" }}
                        >
                          {highlightMatch(post.title, query)}
                        </span>
                        <span className="text-xs flex-shrink-0" style={{ color: "var(--text-muted)" }}>
                          {calculateReadTime(post.content)} min
                        </span>
                      </div>
                      <p
                        className="text-sm line-clamp-1"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {highlightMatch(post.description, query)}
                      </p>
                      <time className="text-xs mt-1 block" style={{ color: "var(--text-muted)" }}>
                        {formatDate(post.pubDatetime, locale)}
                      </time>
                    </div>
                    <FaArrowRight
                      size={14}
                      className="flex-shrink-0 mt-1"
                      style={{ color: "var(--text-muted)" }}
                    />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div
            className="px-5 py-2.5 border-t text-xs flex items-center gap-4"
            style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
          >
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded text-[10px]" style={{ backgroundColor: "var(--bg-tertiary)" }}>↑↓</kbd>
              {t("search_nav", "navigate")}
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded text-[10px]" style={{ backgroundColor: "var(--bg-tertiary)" }}>↵</kbd>
              {t("search_open", "open")}
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded text-[10px]" style={{ backgroundColor: "var(--bg-tertiary)" }}>esc</kbd>
              {t("search_close", "close")}
            </span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}