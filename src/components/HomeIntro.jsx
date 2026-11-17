import { useLayoutEffect, useRef, useState } from "react";
import { introWordmark } from "./introWordmarkPath";
import "./HomeIntro.css";

function Wordmark({ settled }) {
  const { coreWidth, coreHeight, paths, travel, maskEdge, initialOffset, maskCorrection, fullWidth } = introWordmark;
  // Once the motion ends, keep only the finished outlines. The oversized black
  // occluders and difference layer must not survive into elastic scrolling.
  if (settled) {
    return (
      <svg className="intro-wordmark" viewBox={`0 0 ${coreWidth} ${coreHeight}`} aria-hidden="true">
        <g transform={`translate(${-travel} 0)`}>
          <path d={paths.left} />
          <path d={paths.center} />
        </g>
      </svg>
    );
  }
  return (
    <svg className="intro-wordmark" viewBox={`0 0 ${coreWidth} ${coreHeight}`} aria-hidden="true"
      style={{ "--intro-travel": `${travel}px`, "--intro-mask-correction": `${maskCorrection}px` }}>
      <g className="intro-letter-center">
        <path d={paths.center} />
      </g>
      <g className="intro-letter-left">
        <rect x={-fullWidth * 2} y="-6" width={fullWidth * 2 + maskEdge} height="32" />
        <path d={paths.left} />
      </g>
      <g className="intro-letter-right">
        <g className="intro-correction">
          <rect x={maskEdge} y="-6" width={fullWidth * 2} height="32" />
          <rect className="intro-terminal" x={maskEdge - 0.7} y="0.5" width="1.4" height="15" />
        </g>
        <path className="intro-cap-initial" d={paths.initial} transform={`translate(${initialOffset} 0)`} />
      </g>
    </svg>
  );
}

export function HomeIntro({ enabled, children }) {
  const [flatScale] = useState(() => {
    if (typeof navigator === "undefined") return false;
    const ua = navigator.userAgent;
    return /firefox|iphone|ipad|ipod|android.*mobile/i.test(ua) || (/safari/i.test(ua) && !/chrome|chromium|android/i.test(ua));
  });
  const [phase, setPhase] = useState(enabled ? "signature" : "done");
  const [canInteract, setCanInteract] = useState(!enabled);
  const [contentVisible, setContentVisible] = useState(!enabled);
  const [brandState, setBrandState] = useState(enabled ? "visible" : "hidden");
  const hasPlayed = useRef(false);

  useLayoutEffect(() => {
    if (!enabled || hasPlayed.current) {
      setPhase("done");
      setCanInteract(true);
      setContentVisible(true);
      setBrandState("hidden");
      return undefined;
    }
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) {
      setPhase("done");
      setCanInteract(true);
      setContentVisible(true);
      setBrandState("hidden");
      hasPlayed.current = true;
      return undefined;
    }

    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    setPhase("signature");
    setCanInteract(false);
    setContentVisible(false);
    setBrandState("visible");
    const unlock = () => { document.documentElement.style.overflow = previousOverflow; };
    const timers = [];
    const brandTimers = [];
    let dismissing = false;
    let scrollEnabled = false;
    const dismissBrand = (immediate = false) => {
      if (dismissing && !immediate) return;
      dismissing = true;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onScroll);
      window.removeEventListener("touchmove", onScroll);
      setBrandState(immediate ? "hidden" : "hiding");
      if (!immediate) brandTimers.push(window.setTimeout(() => setBrandState("hidden"), 280));
    };
    const finish = () => {
      timers.forEach(window.clearTimeout);
      hasPlayed.current = true;
      setPhase("done");
      setCanInteract(true);
      setContentVisible(true);
      unlock();
    };
    const onKeyDown = (event) => { if (event.key === "Escape") { finish(); dismissBrand(true); } };
    const onMotionChange = () => { if (media.matches) { finish(); dismissBrand(true); } };
    const onScroll = () => { if (scrollEnabled) dismissBrand(); };

    // Keep the original class milestones. Setup is separate from motion start.
    timers.push(window.setTimeout(() => setPhase("setup"), 25));
    timers.push(window.setTimeout(() => setPhase("reveal"), 200));
    // Keep the approved SVG clock intact. Reveal the page only when the slow
    // upward curve reaches visible movement (~10% of its travel at 700 ms).
    // Content animations already share that clock, rather than starting late.
    timers.push(window.setTimeout(() => setContentVisible(true), 700));
    timers.push(window.setTimeout(() => { scrollEnabled = true; setCanInteract(true); unlock(); }, 1300));
    // The reference's end-intro flags do not truncate its staggered CSS motion.
    timers.push(window.setTimeout(() => setPhase("settled"), 2300));
    timers.push(window.setTimeout(finish, 4000));
    brandTimers.push(window.setTimeout(() => dismissBrand(), 4800));
    document.addEventListener("keydown", onKeyDown);
    media.addEventListener("change", onMotionChange);
    window.addEventListener("scroll", onScroll, { passive: true });
    // Wheel/touch also catch attempts to scroll beyond the top at scrollY=0.
    window.addEventListener("wheel", onScroll, { passive: true });
    window.addEventListener("touchmove", onScroll, { passive: true });

    return () => {
      timers.forEach(window.clearTimeout);
      brandTimers.forEach(window.clearTimeout);
      document.removeEventListener("keydown", onKeyDown);
      media.removeEventListener("change", onMotionChange);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onScroll);
      window.removeEventListener("touchmove", onScroll);
      unlock();
    };
  }, [enabled]);

  const concealed = enabled && !canInteract;
  const settled = phase === "settled" || phase === "done";
  return (
    <div className={enabled ? "home-intro" : undefined} data-intro-phase={enabled ? phase : undefined}
      data-intro-flat={flatScale ? "" : undefined} data-intro-interactive={canInteract ? "" : undefined}
      data-intro-brand={brandState} data-intro-static={settled ? "" : undefined}
      data-intro-content={contentVisible ? "visible" : "hidden"}>
      {enabled && (
        <>
          <div className="intro-curtain" aria-hidden="true" />
          {brandState !== "hidden" && (
            <div className="intro-brand-position" aria-hidden="true">
              <div className="intro-brand">
                <Wordmark settled={settled} />
              </div>
            </div>
          )}
        </>
      )}
      <div className={enabled ? "intro-page" : undefined} inert={concealed}>
        {children}
      </div>
    </div>
  );
}
