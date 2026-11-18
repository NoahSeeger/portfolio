// View transitions are progressive enhancement: theme changes must work even
// when an animation is missing, skipped, rejected or never calls its callback.
export function createThemeTransition({ document, window, commit, onBusy }) {
  const root = document.documentElement;
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let current = null;
  let disposed = false;
  const reset = () => {
    delete root.dataset.themeTransition;
    for (const name of ["--theme-transition-x", "--theme-transition-y", "--theme-transition-radius"]) root.style.removeProperty(name);
  };
  const finish = (job) => {
    window.clearTimeout(job.timer);
    if (current !== job) return;
    current = null;
    reset();
    if (!disposed) onBusy(false);
  };
  const commitOnce = (job) => {
    if (disposed || current !== job || job.committed) return;
    job.committed = true;
    commit();
  };
  const settle = () => {
    const job = current;
    if (!job) return;
    try { job.transition?.skipTransition(); } catch { /* Commit still works. */ }
    try { commitOnce(job); } finally { finish(job); }
  };
  const visibility = () => { if (document.hidden) settle(); };
  const motionChange = () => { if (motion.matches) settle(); };
  document.addEventListener("visibilitychange", visibility);
  window.addEventListener("resize", settle);
  motion.addEventListener("change", motionChange);

  return {
    run(button) {
      if (disposed || current) return false;
      const intro = document.querySelector(".home-intro");
      const introAnimating = intro && intro.dataset.introPhase !== "done";
      if (document.hidden || introAnimating || motion.matches || typeof document.startViewTransition !== "function") {
        commit();
        return true;
      }
      const rect = button.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
      const job = { committed: false, transition: null, timer: null };
      current = job;
      root.dataset.themeTransition = "active";
      root.style.setProperty("--theme-transition-x", `${x}px`);
      root.style.setProperty("--theme-transition-y", `${y}px`);
      root.style.setProperty("--theme-transition-radius", `${Math.ceil(radius)}px`);
      onBusy(true);
      job.timer = window.setTimeout(settle, 1200);
      try {
        job.transition = document.startViewTransition(() => commitOnce(job));
        job.transition.ready?.catch(() => {});
        job.transition.updateCallbackDone?.catch(() => {
          try { commitOnce(job); } finally { finish(job); }
        });
        const complete = () => {
          try { commitOnce(job); } finally { finish(job); }
        };
        job.transition.finished.then(complete, complete);
      } catch {
        try { commitOnce(job); } finally { finish(job); }
      }
      return true;
    },
    dispose() {
      disposed = true;
      const job = current;
      current = null;
      if (job) {
        window.clearTimeout(job.timer);
        try { job.transition?.skipTransition(); } catch { /* No animation remains. */ }
      }
      reset();
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("resize", settle);
      motion.removeEventListener("change", motionChange);
    },
  };
}
