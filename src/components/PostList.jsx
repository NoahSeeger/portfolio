import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { createNotePreviewIntent } from "../lib/note-preview-intent";
import "./PostList.css";

export function NotePreview({ post, expanded }) {
  const { title, description, heroImage } = post;
  const [failedImage, setFailedImage] = useState(null);
  const [hasOpened, setHasOpened] = useState(false);
  useEffect(() => { if (expanded) setHasOpened(true); }, [expanded]);
  const showImage = heroImage && failedImage !== heroImage;
  return (
    <span className="note-preview-expanded" aria-hidden="true" inert data-open={expanded ? "" : undefined}>
      <span className="note-preview-front">
        <span className={`note-preview-content${showImage ? " note-preview-with-image" : ""}`}>
          {(expanded || hasOpened) && showImage && <img className="note-preview-cover" src={heroImage} alt="" width="180" height="78" decoding="async" fetchPriority="low" onError={() => setFailedImage(heroImage)} />}
          <span className="note-preview-text">
            <span className="note-preview-title">{title}</span>
            <span className="note-preview-description">{description}</span>
          </span>
        </span>
      </span>
    </span>
  );
}

function NoteThumb({ title, description }) {
  const words = description.split(/\s+/);
  const lines = [];
  let length = 0;
  for (const word of words) {
    if (length + word.length > 28) { lines.push(length); length = 0; }
    length += word.length + 1;
    if (lines.length === 5) break;
  }
  if (lines.length < 5 && length) lines.push(length);
  return <span className="note-preview" aria-hidden="true">
    <span className="note-preview-paper">
      <span className="note-preview-heading" style={{ width: `${Math.min(90, Math.max(40, title.length * 2))}%` }} />
      {lines.slice(0, 5).map((size, index) => <span key={index} className="note-preview-line" style={{ width: `${Math.min(100, Math.max(30, size / 28 * 100))}%` }} />)}
    </span>
  </span>;
}

export function PostList({ posts, label }) {
  const ref = useRef(null);
  const [activeSlug, setActiveSlug] = useState(null);
  const intent = useRef(null);
  if (intent.current === null) intent.current = createNotePreviewIntent({ onChange: setActiveSlug });
  const { i18n } = useTranslation();
  const identity = posts.map((post) => post.slug).join(",");
  useEffect(() => () => intent.current.dispose(), []);
  useLayoutEffect(() => {
    if (!activeSlug) return;
    const row = ref.current?.querySelector("[data-preview-open]");
    if (!row) return;
    const rect = row.getBoundingClientRect();
    const popup = row.querySelector(".note-preview-expanded");
    const height = popup.offsetHeight;
    const centeredTop = rect.top + rect.height / 2 - height / 2;
    const top = Math.max(12, Math.min(centeredTop, window.innerHeight - height - 12));
    popup.style.setProperty("--preview-offset", `${top - centeredTop}px`);
  }, [activeSlug]);
  useEffect(() => {
    if (!activeSlug) return undefined;
    const dismiss = () => intent.current.close();
    const onKeyDown = (event) => { if (event.key === "Escape") dismiss(); };
    window.addEventListener("scroll", dismiss, { passive: true });
    window.addEventListener("resize", dismiss);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("scroll", dismiss);
      window.removeEventListener("resize", dismiss);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [activeSlug]);
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element || !window.IntersectionObserver || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const section = element.closest("section");
    element.dataset.reveal = "pending";
    if (section) section.dataset.notesReveal = "pending";
    const observer = new window.IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      element.dataset.reveal = "ready";
      if (section) section.dataset.notesReveal = "ready";
      observer.disconnect();
    }, { threshold: 0 });
    const intro = element.closest(".home-intro");
    let introObserver;
    if (intro?.dataset.introContent === "hidden") {
      introObserver = new window.MutationObserver(() => {
        if (intro.dataset.introContent !== "visible") return;
        introObserver.disconnect();
        observer.observe(element);
      });
      introObserver.observe(intro, { attributes: true, attributeFilter: ["data-intro-content"] });
    } else observer.observe(element);
    return () => {
      observer.disconnect();
      introObserver?.disconnect();
      delete element.dataset.reveal;
      if (section) delete section.dataset.notesReveal;
    };
  }, [identity]);

  return (
    <ul ref={ref} className="post-list" aria-label={label}>
      {posts.map((post, index) => (
        <li key={post.slug} data-preview-open={activeSlug === post.slug ? "" : undefined} style={{ "--post-order": Math.min(index, 7) }}>
          <Link className="post-row" to={`/blog/${post.slug}`}
            onPointerEnter={(event) => { if (event.pointerType === "mouse") intent.current.enter(post.slug); }}
            onPointerLeave={() => intent.current.leave(post.slug)}
            onFocus={(event) => { if (event.currentTarget.matches(":focus-visible")) intent.current.enter(post.slug, true); }}
            onBlur={() => intent.current.leave(post.slug)}
          >
            <span className="post-row-title">{post.title}</span>
            <time className="post-row-date" dateTime={post.pubDatetime}>{new Date(post.pubDatetime).toLocaleDateString(i18n.language, { month: "short", day: "numeric", year: "numeric" })}</time>
            <NoteThumb title={post.title} description={post.description} />
          </Link>
          <NotePreview post={post} expanded={activeSlug === post.slug} />
        </li>
      ))}
    </ul>
  );
}
