// Delayed first hover; immediate switching while the reader explores the list.
// The preview never becomes an input surface or changes the row's hitbox.
export function createNotePreviewIntent({ onChange, now = Date.now, schedule = setTimeout, cancel = clearTimeout }) {
  let active = null;
  let pending = null;
  let timer = null;
  let warmUntil = 0;
  const cancelPending = () => {
    if (timer !== null) cancel(timer);
    timer = null;
    pending = null;
  };
  const show = (slug) => {
    cancelPending();
    if (active === slug) return;
    active = slug;
    onChange(slug);
  };
  const close = () => {
    cancelPending();
    if (active === null) return;
    warmUntil = now() + 300;
    active = null;
    onChange(null);
  };
  return {
    enter(slug, immediate = false) {
      if (active === slug) { cancelPending(); return; }
      cancelPending();
      if (immediate || active !== null || now() < warmUntil) { show(slug); return; }
      pending = slug;
      timer = schedule(() => show(slug), 350);
    },
    leave(slug) {
      if (pending === slug) cancelPending();
      if (active === slug) close();
    },
    close,
    dispose() { cancelPending(); active = null; warmUntil = 0; },
  };
}
