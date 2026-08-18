import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

export const SITE_URL = "https://noahseeger.de";
export const SITE_NAME = "Noah Seeger";
export const DEFAULT_DESCRIPTION = "Notes and projects by Noah Seeger — iOS apps, homelabbing, web development and things I am learning.";

const SOCIAL_LINKS = [
  "https://github.com/NoahSeeger",
  "https://www.linkedin.com/in/noahseeger/",
  "https://x.com/thenoahsee",
];

function absoluteUrl(path = "/") {
  return new URL(path, `${SITE_URL}/`).toString();
}

function buildSchema({ title, description, canonical, type, image, article }) {
  const person = {
    "@type": "Person",
    name: SITE_NAME,
    url: SITE_URL,
    sameAs: SOCIAL_LINKS,
  };

  if (type === "article") {
    return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: title,
      description,
      inLanguage: "en",
      url: canonical,
      mainEntityOfPage: canonical,
      author: person,
      publisher: person,
      ...(image ? { image: absoluteUrl(image) } : {}),
      ...(article?.publishedTime ? { datePublished: article.publishedTime } : {}),
      ...(article?.modifiedTime ? { dateModified: article.modifiedTime } : {}),
    };
  }

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: title,
    description,
    inLanguage: "en",
    url: canonical,
    author: person,
  };
}

export default function Seo({
  title = SITE_NAME,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  image,
  type = "website",
  noindex = false,
  article,
}) {
  const canonical = absoluteUrl(path);
  const schema = buildSchema({ title, description, canonical, type, image, article });
  const fullTitle = title === SITE_NAME ? SITE_NAME : `${title} · ${SITE_NAME}`;

  useEffect(() => {
    document.title = fullTitle;
  }, [fullTitle]);

  return (
    <Helmet>
      <meta name="description" content={description} />
      <meta name="author" content={SITE_NAME} />
      <link rel="canonical" href={canonical} />
      <meta name="robots" content={noindex ? "noindex,follow" : "index,follow"} />
      <meta property="og:type" content={type === "article" ? "article" : "website"} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:locale" content="en_US" />
      {image && <meta property="og:image" content={absoluteUrl(image)} />}
      <meta name="twitter:card" content={image ? "summary_large_image" : "summary"} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={absoluteUrl(image)} />}
      {type === "article" && article?.publishedTime && <meta property="article:published_time" content={article.publishedTime} />}
      {type === "article" && article?.modifiedTime && <meta property="article:modified_time" content={article.modifiedTime} />}
      <script type="application/ld+json">{JSON.stringify(schema).replace(/</g, "\\u003c")}</script>
    </Helmet>
  );
}
