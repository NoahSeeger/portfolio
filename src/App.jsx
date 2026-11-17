import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useParams, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { PortfolioDock } from "./components/PortfolioDock";
import Hero from "./components/Hero";
import { getPostBySlug, loadPostContent } from "./lib/blog";
import { ThemeProvider } from "./hooks/useTheme";
import { SearchProvider } from "./hooks/useSearch";
import Seo from "./components/Seo";
import { SiteFooter } from "./components/SiteFooter";
import { HomeIntro } from "./components/HomeIntro";
import { CustomCursor } from "./components/CustomCursor";

const BlogIndex = lazy(() => import("./pages/BlogIndex").then(({ BlogIndex: Component }) => ({ default: Component })));
const loadBlogPost = () => import("./pages/Blog").then(({ BlogPost: Component }) => ({ default: Component }));
const BlogPost = lazy(loadBlogPost);
const SearchPage = lazy(() => import("./pages/Search").then(({ SearchPage: Component }) => ({ default: Component })));

function Home() {
  return <Hero />;
}

function BlogPostWrapper() {
  const { slug } = useParams();
  const post = getPostBySlug(slug);
  const [loaded, setLoaded] = useState(null);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!post) return undefined;
    let cancelled = false;
    Promise.all([loadPostContent(slug), loadBlogPost()]).then(
      ([content]) => { if (!cancelled) setLoaded({ slug, content }); },
      () => { if (!cancelled) setLoaded({ slug, error: true }); },
    );
    return () => { cancelled = true; };
  }, [slug, post, attempt]);
  if (!post) return <NotFound />;
  if (loaded?.slug !== slug) return <div className="min-h-[40vh]" aria-busy="true" />;
  if (loaded.error) return <div role="alert">Could not load this article. <button type="button" onClick={() => { setLoaded(null); setAttempt((value) => value + 1); }}>Try again</button></div>;
  return <BlogPost post={{ ...post, content: loaded.content }} />;
}

const NOT_FOUND_ART = String.raw`$$\   $$\  $$$$$$\  $$\   $$\
$$ |  $$ |$$$ __$$\ $$ |  $$ |
$$ |  $$ |$$$$\ $$ |$$ |  $$ |
$$$$$$$$ |$$\$$\$$ |$$$$$$$$ |
\_____$$ |$$ \$$$$ |\_____$$ |
      $$ |$$ |\$$$ |      $$ |
      $$ |\$$$$$$  /      $$ |
      \__| \______/       \__|`;

function NotFound() {
  return (
    <div className="not-found-page">
      <Seo title="Page not found" description="The page you requested does not exist." path="/404" noindex />
      <pre className="not-found-code-art" aria-hidden="true">{NOT_FOUND_ART}</pre>
      <h1>Page not found</h1>
      <a href="/" className="portfolio-section-link">Back home</a>
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <CustomCursor color="#368cff" />
        <BrowserRouter>
          <SearchProvider>
            <BlogRoutes />
          </SearchProvider>
        </BrowserRouter>
      </ThemeProvider>
    </HelmetProvider>
  );
}

function BlogRoutes() {
  const { pathname } = useLocation();
  return (
    <HomeIntro enabled={pathname === "/"}>
      <div className="relative w-full">
        <main className={`portfolio-main mx-auto${pathname === "/" ? " portfolio-main-home" : ""}`}>
          <Suspense fallback={<div className="min-h-[40vh]" aria-busy="true" />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/blog" element={<BlogIndex />} />
              <Route path="/blog/:slug" element={<BlogPostWrapper />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        {pathname === "/" && <SiteFooter />}
        <PortfolioDock />
      </div>
    </HomeIntro>
  );
}

export default App;
