import React from "react";
import SectionTitle from "./SectionTitle";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { getAllPosts, formatDate } from "../lib/blog";

function Posts() {
  const { t, i18n } = useTranslation();
  const posts = getAllPosts().slice(0, 3);
  const locale = i18n.language;

  return (
    <section id="POSTS" className="min-h-screen py-16 bg-white">
      <div className="container mx-auto px-4">
        <SectionTitle
          title={t("posts_section_title", "Erkunde meine")}
          subtitle={t("posts_section_subtitle", "Beiträge")}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-12">
          {posts.length > 0 ? (
            posts.map((post) => (
              <Link key={post.slug} to={`/blog/${post.slug}`}>
                <motion.article
                  whileHover={{ y: -5 }}
                  className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 h-full flex flex-col"
                >
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags?.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <time className="text-sm text-gray-500">
                    {formatDate(post.pubDatetime, locale)}
                  </time>
                  <h3 className="text-xl font-semibold mt-2 mb-3">{post.title}</h3>
                  <p className="text-gray-600 flex-grow line-clamp-3">{post.description}</p>
                  <div className="flex items-center text-blue-600 mt-4">
                    <span>{t("posts_read_more", "Weiterlesen")}</span>
                    <MdOutlineArrowForwardIos size={16} className="ml-2" />
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
            className="flex items-center justify-center bg-blue-600 text-white px-6 py-4 rounded-full hover:bg-blue-700 transition duration-300 whitespace-nowrap w-fit"
          >
            {t("posts_read_all", "Alle Beiträge lesen")}
            <MdOutlineArrowForwardIos size={22} className="ml-4" />
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
      className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
    >
      <span className="text-sm text-gray-500">{date}</span>
      <h3 className="text-xl font-semibold mt-2 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
}

export default Posts;