import React from "react";
import SectionTitle from "./SectionTitle";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { getAllPosts, formatDateShort, calculateReadTime } from "../lib/blog";

function PostItem({ post, index }) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const readTime = calculateReadTime(post.content);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group grid md:grid-cols-[1fr_2fr] gap-6 md:gap-10 py-8 last:border-b-0"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      {/* Image */}
      <div className="relative overflow-hidden rounded-lg aspect-[4/3]" style={{ backgroundColor: "var(--bg-tertiary)" }}>
        {post.heroImage ? (
          <img
            src={post.heroImage}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            draggable="false"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm" style={{ backgroundColor: "var(--bg-tertiary)", color: "var(--text-muted)" }}>
            No preview
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col justify-center">
        <div className="flex items-start justify-between gap-4 mb-2">
          <Link to={`/blog/${post.slug}`} className="group/title">
            <h3 className="text-xl md:text-2xl font-bold group-hover/title:opacity-80 transition-opacity" style={{ color: "var(--text-primary)" }}>
              {post.title}
            </h3>
          </Link>
          <div className="flex items-center gap-2 shrink-0">
            {post.draft && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold text-white" style={{ backgroundColor: "var(--accent)" }}>
                DRAFT
              </span>
            )}
            <Link
              to={`/blog/${post.slug}`}
              className="shrink-0 transition-opacity mt-1"
              style={{ color: "var(--text-muted)" }}
            >
              →
            </Link>
          </div>
        </div>

        <p className="text-sm md:text-base mb-4 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {post.description}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded text-xs font-mono"
                style={{ backgroundColor: "var(--bg-tertiary)", color: "var(--text-secondary)" }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs md:text-sm" style={{ color: "var(--text-muted)" }}>
          <time>{formatDateShort(post.pubDatetime, locale)}</time>
          <span>·</span>
          <span>{readTime} min {t("posts_read", "read")}</span>
          <Link
            to={`/blog/${post.slug}`}
            className="ml-auto flex items-center gap-1 transition-opacity hover:opacity-80"
            style={{ color: "var(--accent)" }}
          >
            {t("posts_read_more")}
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

function Posts() {
  const { t } = useTranslation();
  const posts = getAllPosts().slice(0, 1);

  return (
    <section id="POSTS" className="w-full">
      <div className="w-full">
        <SectionTitle
          title={t("posts_section_title", "Erkunde meine")}
          subtitle={t("posts_section_subtitle", "Beiträge")}
        />

        <div className="mt-10">
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <PostItem key={post.slug} post={post} index={index} />
            ))
          ) : (
            <p className="text-center py-10" style={{ color: "var(--text-muted)" }}>
              {t("posts_no_posts", "Noch keine Beiträge vorhanden.")}
            </p>
          )}
        </div>

        <div className="pt-8 text-center">
          <Link
            to="/blog"
            className="text-sm transition-opacity hover:opacity-80"
            style={{ color: "var(--text-muted)" }}
          >
            {t("posts_read_all")} →
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Posts;
