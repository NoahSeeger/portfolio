import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getAllPosts } from "../lib/blog";
import profileImage from "../assets/personal/me.webp";
import Seo from "./Seo";
import { InlineApps } from "./InlineApps";
import { TextReveal } from "./TextReveal";
import { PostList } from "./PostList";

function SectionHeading({ title, link, linkLabel }) {
  return (
    <div className="portfolio-section-heading">
      <div>
        <h2>{title}</h2>
      </div>
      {link && (
        <Link to={link} className="portfolio-section-link">
          {linkLabel}
        </Link>
      )}
    </div>
  );
}

function Hero() {
  const { t } = useTranslation();
  const posts = getAllPosts()
    .filter((post) => !post.draft && Date.parse(post.pubDatetime) <= Date.now())
    .slice(0, 3);

  return (
    <div className="portfolio-home">
      <Seo />
      <section className="portfolio-hero">
        <div className="portfolio-portrait">
          <img src={profileImage} alt={t("hero_img_alt", "Noah Seeger")} decoding="async" />
        </div>

        <TextReveal as="h1">Noah Seeger</TextReveal>
        <TextReveal className="portfolio-meta">{t("about_line1", "Student @ HdM Stuttgart, Mobile Media.")}</TextReveal>

        <div className="portfolio-intro" data-reveal-lines>
          <TextReveal className="portfolio-intro-lead">{t("home_intro_line1", "Exploring everything in tech and engineering.")}</TextReveal>
          <InlineApps />
          <TextReveal>{t("home_intro_line3", "Recently got into 3D printing (A1 Mini) and homelabbing with Proxmox on my Raspi + T480s.")}</TextReveal>
          <TextReveal>{t("home_intro_line4", "Always looking for interesting people to work with.")}</TextReveal>
        </div>
      </section>

      <div className="portfolio-content">
        <section id="notes" className="portfolio-section portfolio-notes">
          <SectionHeading
            title={t("blog_notes", "Notes")}
            link="/blog"
            linkLabel={t("blog_view_all", "View all")}
          />
          {posts.length > 0 ? <PostList posts={posts} label={t("blog_notes", "Notes")} /> : (
            <p className="portfolio-empty">{t("posts_no_posts", "No notes yet.")}</p>
          )}
        </section>
      </div>
    </div>
  );
}

export default Hero;
