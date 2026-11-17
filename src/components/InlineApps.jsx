import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FaArrowUpRightFromSquare, FaXmark } from "react-icons/fa6";
import { featuredApps } from "../content/apps";
import { TextReveal } from "./TextReveal";
import "./InlineApps.css";

// Quanta and Birthday Calendar intentionally share this temporary preview.
const previewUrl = "https://picswipe.noahseeger.de";

export function InlineApps() {
  const [activeId, setActiveId] = useState(null);
  const [position, setPosition] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const anchorRef = useRef(null);
  const panelRef = useRef(null);
  const closeTimer = useRef(null);
  const pinned = useRef(false);
  const panelId = useId();

  const cancelClose = () => window.clearTimeout(closeTimer.current);
  const close = () => {
    cancelClose();
    pinned.current = false;
    setActiveId(null);
  };
  const scheduleClose = () => {
    cancelClose();
    if (!pinned.current) closeTimer.current = window.setTimeout(() => setActiveId(null), 220);
  };

  const open = (app, anchor, pin = false) => {
    cancelClose();
    if (!activeId) setLoaded(false);
    anchorRef.current = anchor;
    pinned.current = pin;
    const rect = anchor.getBoundingClientRect();
    const width = Math.min(560, window.innerWidth - 24);
    const height = width * 0.625 + 48;
    const below = rect.bottom + 14;
    const top = below + height <= window.innerHeight - 12
      ? below
      : Math.max(12, rect.top - height - 14);
    setPosition({
      left: Math.max(12, Math.min(rect.left + rect.width / 2 - width / 2, window.innerWidth - width - 12)),
      top,
      width,
      "--app-preview-scale": (width - 14) / 1120,
    });
    setActiveId(app.id);
  };

  useEffect(() => {
    if (!activeId) return undefined;
    const dismiss = () => {
      pinned.current = false;
      setActiveId(null);
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        anchorRef.current?.focus();
        dismiss();
      }
    };
    const onPointerDown = (event) => {
      if (!panelRef.current?.contains(event.target) && !anchorRef.current?.contains(event.target)) dismiss();
    };
    const onScroll = (event) => {
      if (!panelRef.current?.contains(event.target)) dismiss();
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("resize", dismiss);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("resize", dismiss);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [activeId]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  const chip = (app) => (
    <button
      key={app.id}
      type="button"
      className={`inline-app-chip inline-app-chip-${app.id}`}
      aria-haspopup="dialog"
      aria-expanded={activeId === app.id}
      aria-controls={activeId === app.id ? panelId : undefined}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") open(app, event.currentTarget);
      }}
      onPointerLeave={scheduleClose}
      onFocus={(event) => open(app, event.currentTarget)}
      onBlur={(event) => {
        if (!panelRef.current?.contains(event.relatedTarget)) scheduleClose();
      }}
      onClick={(event) => {
        if (activeId === app.id && pinned.current) close();
        else open(app, event.currentTarget, true);
      }}
    >
      <span className="inline-app-icon" aria-hidden="true">
        {app.id === "picswipe" ? <img src={app.icon} alt="" draggable="false" /> : app.monogram}
      </span>
      {app.name}
      <FaArrowUpRightFromSquare className="inline-app-arrow" aria-hidden="true" />
    </button>
  );

  return (
    <>
      <TextReveal
        content={[
          "Building iOS apps like ",
          chip(featuredApps[0]), ", ",
          chip(featuredApps[1]), " and ",
          chip(featuredApps[2]), " in my free time.",
        ]}
      >
        Building iOS apps like PicSwipe, Quanta and Birthday Calendar in my free time.
      </TextReveal>
      {activeId && position && createPortal(
        <>
          <div className="app-preview-shade" aria-hidden="true" />
          <div
            ref={panelRef}
            id={panelId}
            className="app-preview"
            style={position}
            role="dialog"
            aria-label="PicSwipe live website preview"
            onPointerEnter={cancelClose}
            onPointerLeave={scheduleClose}
            onFocus={cancelClose}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                pinned.current = false;
                scheduleClose();
              }
            }}
          >
            <div className="app-preview-toolbar">
              <img src="/apps/picswipe.png" alt="" />
              <span>PicSwipe <span className="app-preview-live">Live preview</span></span>
              <a href={previewUrl} target="_blank" rel="noopener noreferrer" aria-label="Open PicSwipe website">
                Open website <FaArrowUpRightFromSquare aria-hidden="true" />
              </a>
              <button type="button" aria-label="Close preview" onClick={() => { anchorRef.current?.focus(); close(); }}>
                <FaXmark aria-hidden="true" />
              </button>
            </div>
            <div className="app-preview-viewport" aria-busy={!loaded}>
              {!loaded && <span className="app-preview-loading">Loading PicSwipe…</span>}
              <iframe
                src={previewUrl}
                title="PicSwipe interactive website"
                loading="lazy"
                referrerPolicy="no-referrer"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                onLoad={() => setLoaded(true)}
              />
            </div>
          </div>
        </>, document.body,
      )}
    </>
  );
}
