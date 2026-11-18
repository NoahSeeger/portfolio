import test from "node:test";
import assert from "node:assert/strict";
import { createThemeTransition } from "../src/lib/theme-transition.js";

function deferred() {
  let resolve, reject;
  const promise = new Promise((ok, fail) => { resolve = ok; reject = fail; });
  return { promise, resolve, reject };
}
function fixture({ reduced = false, hidden = false, missing = false, throws = false, intro = false } = {}) {
  const document = new EventTarget();
  const window = new EventTarget();
  const motion = Object.assign(new EventTarget(), { matches: reduced });
  const properties = new Map(), timers = new Map(), jobs = [], busy = [];
  let commits = 0, timerId = 0;
  document.hidden = hidden;
  document.querySelector = () => intro ? { dataset: { introPhase: "reveal" } } : null;
  document.documentElement = { dataset: {}, style: { setProperty: (key, value) => properties.set(key, value), removeProperty: (key) => properties.delete(key) } };
  Object.assign(window, { innerWidth: 1000, innerHeight: 800, matchMedia: () => motion,
    setTimeout: (callback) => { timers.set(++timerId, callback); return timerId; }, clearTimeout: (id) => timers.delete(id) });
  if (!missing) document.startViewTransition = (callback) => {
    const done = deferred(), updated = deferred();
    const job = { callback, done, updated, skips: 0 };
    jobs.push(job);
    if (throws) throw new Error("API failed");
    return { ready: Promise.resolve(), finished: done.promise, updateCallbackDone: updated.promise, skipTransition: () => { job.skips += 1; } };
  };
  const controller = createThemeTransition({ document, window, commit: () => { commits += 1; }, onBusy: (value) => busy.push(value) });
  const button = { getBoundingClientRect: () => ({ left: 900, top: 10, width: 36, height: 36 }) };
  return { controller, button, jobs, busy, timers, properties, document, window, motion, commits: () => commits };
}
const flush = async () => { await Promise.resolve(); await Promise.resolve(); };

function clean(f) {
  assert.equal(f.document.documentElement.dataset.themeTransition, undefined);
  assert.equal(f.properties.size, 0);
  assert.equal(f.timers.size, 0);
}

test("theme reveal commits once, blocks rapid repeats and releases all transition state", async () => {
  const f = fixture();
  assert.equal(f.controller.run(f.button), true);
  assert.equal(f.controller.run(f.button), false);
  assert.equal(f.commits(), 0);
  assert.ok(Number.parseInt(f.properties.get("--theme-transition-radius")) > 1000);
  f.jobs[0].callback(); f.jobs[0].callback();
  assert.equal(f.commits(), 1);
  f.jobs[0].updated.resolve(); f.jobs[0].done.resolve(); await flush();
  assert.deepEqual(f.busy, [true, false]); clean(f); f.controller.dispose();
});

test("reduced motion, hidden documents, active intros and missing APIs switch immediately", () => {
  for (const options of [{ reduced: true }, { hidden: true }, { missing: true }, { intro: true }]) {
    const f = fixture(options);
    f.controller.run({ getBoundingClientRect: () => { throw new Error("Unneeded layout read"); } });
    assert.equal(f.commits(), 1); assert.deepEqual(f.busy, []); clean(f); f.controller.dispose();
  }
});

test("throwing or rejecting view transition APIs cannot leave the switch locked", async () => {
  const thrown = fixture({ throws: true }); thrown.controller.run(thrown.button);
  assert.equal(thrown.commits(), 1); clean(thrown);
  thrown.jobs[0].callback(); assert.equal(thrown.commits(), 1); thrown.controller.dispose();
  const rejected = fixture(); rejected.controller.run(rejected.button);
  rejected.jobs[0].done.reject(new Error("failed")); await flush();
  assert.equal(rejected.commits(), 1); clean(rejected); rejected.controller.dispose();
});

test("timeout commits once; late callbacks cannot toggle or unlock a newer transition", async () => {
  const f = fixture(); f.controller.run(f.button);
  [...f.timers.values()][0]();
  assert.equal(f.commits(), 1); assert.equal(f.jobs[0].skips, 1); clean(f);
  f.controller.run(f.button);
  f.jobs[0].callback(); f.jobs[0].done.resolve(); await flush();
  assert.equal(f.commits(), 1); assert.equal(f.document.documentElement.dataset.themeTransition, "active");
  f.jobs[1].callback(); f.jobs[1].done.resolve(); await flush();
  assert.equal(f.commits(), 2); clean(f); f.controller.dispose();
});

test("resize, hiding the tab and enabling reduced motion settle an active transition", () => {
  for (const action of [f => f.window.dispatchEvent(new Event("resize")), f => { f.document.hidden = true; f.document.dispatchEvent(new Event("visibilitychange")); }, f => { f.motion.matches = true; f.motion.dispatchEvent(new Event("change")); }]) {
    const f = fixture(); f.controller.run(f.button); action(f);
    assert.equal(f.commits(), 1); assert.equal(f.jobs[0].skips, 1); clean(f); f.controller.dispose();
  }
});

test("unmount cancels pending work without committing or updating unmounted UI", async () => {
  const f = fixture(); f.controller.run(f.button); f.controller.dispose();
  f.jobs[0].callback(); f.jobs[0].done.resolve(); await flush();
  assert.equal(f.commits(), 0); assert.deepEqual(f.busy, [true]); clean(f);
  assert.equal(f.controller.run(f.button), false);
});
