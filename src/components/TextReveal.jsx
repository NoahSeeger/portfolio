import { Fragment, useLayoutEffect, useRef } from "react";
import "./TextReveal.css";

// Inspired by the masked line reveal at https://www.lorenzodossi.com/.
// Measure real line wraps so the same motion works with any font or viewport.
export function TextReveal({ as: Tag = "p", children, content, className = "", delay = 0 }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const element = ref.current;
    let disposed = false;
    let frame = 0;

    const measure = () => {
      const group = element.closest("[data-reveal-lines]");
      const blocks = group ? [...group.querySelectorAll(".text-reveal")] : [element];
      // Number lines across the complete intro, as the live reference does.
      const geometry = blocks.map((block) => [...block.querySelectorAll(".text-reveal-word")].map((word) => ({ word, top: word.offsetTop })));
      let nextLine = 0;
      geometry.forEach((block) => {
        let line = nextLine - 1;
        let previousTop = -Infinity;
        block.forEach(({ word, top }) => {
          if (Math.abs(top - previousTop) > 2) {
            line += 1;
            previousTop = top;
          }
          word.style.setProperty("--reveal-line", line);
        });
        nextLine = line + 1;
      });
    };

    const scheduleMeasure = () => {
      if (disposed) return;
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(measure);
    };

    measure();
    element.dataset.reveal = "ready";
    // Font completion may refine line wraps, but never delays the animation.
    document.fonts?.ready.then(scheduleMeasure);

    const observer = window.ResizeObserver ? new window.ResizeObserver(scheduleMeasure) : null;
    observer?.observe(element);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [children]);

  return (
    <Tag ref={ref} className={`text-reveal ${className}`} style={{ "--reveal-delay": `${delay}ms` }}>
      {!content && <span className="sr-only">{children}</span>}
      <span className="text-reveal-perspective" aria-hidden={content ? undefined : true}>
        <span className="text-reveal-block">
          {(content ?? [children]).map((part, partIndex) => typeof part === "string" ? (
            <Fragment key={partIndex}>
              {part.split(/(\s+)/).map((word, index) => /^\s+$/.test(word) ? word : (
                <span key={index} className="text-reveal-word"><span>{word}</span></span>
              ))}
            </Fragment>
          ) : (
            <span key={partIndex} className="text-reveal-word text-reveal-interactive"><span>{part}</span></span>
          ))}
        </span>
      </span>
    </Tag>
  );
}
