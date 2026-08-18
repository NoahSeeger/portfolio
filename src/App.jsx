import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { PortfolioDock } from "./components/PortfolioDock";
import Hero from "./components/Hero";
import { getPostBySlug } from "./lib/blog";
import { ThemeProvider } from "./hooks/useTheme";
import { SearchProvider } from "./hooks/useSearch";
import Seo from "./components/Seo";

const BlogIndex = lazy(() => import("./pages/Blog").then(({ BlogIndex: Component }) => ({ default: Component })));
const BlogPost = lazy(() => import("./pages/Blog").then(({ BlogPost: Component }) => ({ default: Component })));
const SearchPage = lazy(() => import("./pages/Search").then(({ SearchPage: Component }) => ({ default: Component })));

function Home() {
  return <Hero />;
}

function BlogPostWrapper() {
  const { slug } = useParams();
  const post = getPostBySlug(slug);
  return post ? <BlogPost post={post} /> : <NotFound />;
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
  return (
    <div className="relative w-full">
      <main className="portfolio-main mx-auto max-w-4xl px-6 sm:px-8 lg:px-12">
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
      <PortfolioDock />
    </div>
  );
}

export default App;
