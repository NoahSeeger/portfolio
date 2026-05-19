import React from "react";
import ReactMarkdown from "react-markdown";
import { getAllPosts, formatDate } from "../lib/blog";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export function BlogIndex() {
  const { t, i18n } = useTranslation();
  const posts = getAllPosts();
  const locale = i18n.language;

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-xl">{t("posts_section_title", "Erkunde meine")}</span>
          <h1 className="font-bold text-4xl mt-2">{t("posts_section_subtitle", "Beiträge")}</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {posts.map((post) => (
            <Link key={post.slug} to={`/blog/${post.slug}`}>
              <article className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 h-full flex flex-col">
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags?.map((tag) => (
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
                <h2 className="text-xl font-semibold mt-2 mb-3">{post.title}</h2>
                <p className="text-gray-600 flex-grow">{post.description}</p>
                <div className="flex items-center text-blue-600 mt-4">
                  <span>{t("posts_read_more", "Weiterlesen")}</span>
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <p className="text-center text-gray-500">
            {t("posts_no_posts", "Noch keine Beiträge vorhanden.")}
          </p>
        )}
      </div>
    </div>
  );
}

export function BlogPost({ post }) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 flex items-center justify-center">
        <h1 className="text-2xl">{t("posts_not_found", "Beitrag nicht gefunden")}</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <article className="max-w-3xl mx-auto px-4">
        <header className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags?.map((tag) => (
              <span
                key={tag}
                className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          <time className="text-gray-500">{formatDate(post.pubDatetime, locale)}</time>
          <h1 className="text-4xl font-bold mt-2">{post.title}</h1>
          <p className="text-xl text-gray-600 mt-4">{post.description}</p>
        </header>

        <div className="prose prose-lg max-w-none bg-white p-8 rounded-lg shadow-md
          prose-headings:font-bold
          prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
          prose-p:text-gray-700 prose-p:leading-relaxed
          prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
          prose-img:rounded-lg prose-img:shadow-md
          prose-blockquote:border-l-blue-500 prose-blockquote:bg-gray-50 prose-blockquote:p-4
          prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
          prose-pre:bg-gray-900 prose-pre:text-gray-100
          prose-ul:list-disc prose-ol:list-decimal
        ">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </article>
    </div>
  );
}