import { useLayoutEffect } from "react";
import { FaRss } from "react-icons/fa6";
import { getAllPosts } from "../lib/blog";
import { useTranslation } from "react-i18next";
import { PostList } from "../components/PostList";
import Seo from "../components/Seo";
import "./BlogUI.css";

export function BlogIndex() {
  const { t } = useTranslation();
  useLayoutEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);
  const posts = getAllPosts();
  const years = [...new Set(posts.map((post) => new Date(post.pubDatetime).getFullYear()))];
  const title = t("blog_notes", "Notes");
  const description = t("blog_intro", "Notes on software, projects, and things I'm learning.");
  return (
    <div className="reading-page">
      <Seo title={title} description={description} path="/blog" />
      <div>
        <header className="reading-index-header">
          <div className="reading-index-title-row">
            <h1>{title}</h1>
            <a className="reading-rss" href="/rss.xml" aria-label="RSS feed"><FaRss aria-hidden="true" />RSS</a>
          </div>
          <p className="reading-intro">{description}</p>
        </header>
        {years.map((year) => {
          const entries = posts.filter((post) => new Date(post.pubDatetime).getFullYear() === year);
          return <section className="reading-year" key={year} aria-labelledby={`writing-${year}`}>
            <h2 id={`writing-${year}`}>{year}</h2>
            <PostList showCovers posts={entries} label={`${title} ${year}`} />
          </section>;
        })}
        {!posts.length && <p className="reading-intro">{t("posts_no_posts", "No posts yet.")}</p>}
      </div>
    </div>
  );
}
