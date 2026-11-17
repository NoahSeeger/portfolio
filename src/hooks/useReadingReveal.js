import { useLayoutEffect } from "react";

export function useReadingReveal(ref, identity) {
  useLayoutEffect(() => {
    const elements = [...(ref.current?.querySelectorAll("[data-reading-reveal]") || [])];
    if (!window.IntersectionObserver || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const observer = new window.IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.dataset.readingReveal = "visible";
        observer.unobserve(entry.target);
      }
    }, { threshold: 0, rootMargin: "0px 0px -24px 0px" });
    for (const element of elements) {
      element.dataset.readingReveal = "pending";
      observer.observe(element);
    }
    return () => {
      observer.disconnect();
      for (const element of elements) delete element.dataset.readingReveal;
    };
  }, [ref, identity]);
}
