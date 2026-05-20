import React from "react";
import SectionTitle from "./SectionTitle";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { getAllPosts, formatDate, calculateReadTime } from "../lib/blog";

function Posts() {
  const { t, i18n } = useTranslation();
  const posts = getAllPosts().slice(0, 3);
  const locale = i18n.language;

  return (
    <section id="POSTS" className="py-16">
      <div className="container mx-auto px-4">
        <SectionTitle
          title={t("posts_section_title", "Erkunde meine")}
          subtitle={t("posts_section_subtitle", "Beiträge")}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {posts.length > 0 ? (
            posts.map((post) => (
              <Link key={post.slug} to={`/blog/${post.slug}`}>
                <motion.article
                  whileHover={{ y: -5 }}
                  className="p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 h-full flex flex-col"
                  style={{ backgroundColor: "var(--bg-secondary)" }}
                >
                  <time className="text-sm" style={{ color: "var(--text-muted)" }}>
                    {formatDate(post.pubDatetime, locale)}
                  </time>
                  <h3 className="text-lg font-semibold mt-2 mb-3 break-words leading-tight line-clamp-2" style={{ color: "var(--text-primary)" }}>{post.title}</h3>

                  <div className="flex gap-3 mt-auto items-stretch">
                    <p className="line-clamp-3 text-sm flex-1" style={{ color: "var(--text-secondary)" }}>{post.description}</p>
                    {post.heroImage && (
                      <img
                        src={post.heroImage}
                        alt={post.title}
                        className="w-20 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                    )}
                  </div>

                  <div className="flex items-center mt-4 text-sm" style={{ color: "var(--accent)" }}>
                    <span>{calculateReadTime(post.content)} min {t("posts_read", "read")}</span>
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </motion.article>
              </Link>
            ))
          ) : (
            <>
              <PostCard
                title={t("posts_card_placeholder_title", "Bald verfügbar")}
                description={t(
                  "posts_card_placeholder_desc",
                  "Hier werden bald meine neuesten Blog-Beiträge erscheinen."
                )}
                date={t("posts_card_placeholder_date", "Coming soon")}
              />
              <PostCard
                title={t("posts_card_placeholder_title", "Bald verfügbar")}
                description={t(
                  "posts_card_placeholder_desc",
                  "Hier werden bald meine neuesten Blog-Beiträge erscheinen."
                )}
                date={t("posts_card_placeholder_date", "Coming soon")}
              />
              <PostCard
                title={t("posts_card_placeholder_title", "Bald verfügbar")}
                description={t(
                  "posts_card_placeholder_desc",
                  "Hier werden bald meine neuesten Blog-Beiträge erscheinen."
                )}
                date={t("posts_card_placeholder_date", "Coming soon")}
              />
            </>
          )}
        </div>
        <div className="flex justify-center mt-12">
          <Link
            to="/blog"
            className="flex items-center justify-center px-6 py-4 rounded-full hover:opacity-90 transition duration-300 whitespace-nowrap w-fit"
            style={{ backgroundColor: "var(--accent)", color: "white" }}
          >
            {t("posts_read_all", "Alle Beiträge lesen")}
            <svg className="ml-4 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

function PostCard({ title, description, date }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
      style={{ backgroundColor: "var(--bg-secondary)" }}
    >
      <span className="text-sm" style={{ color: "var(--text-muted)" }}>{date}</span>
      <h3 className="text-xl font-semibold mt-2 mb-3" style={{ color: "var(--text-primary)" }}>{title}</h3>
      <p style={{ color: "var(--text-secondary)" }}>{description}</p>
    </motion.div>
  );
}

export default Posts;