import test from "node:test";
import assert from "node:assert/strict";
import { createNotePreviewIntent } from "../src/lib/note-preview-intent.js";

function setup() {
  let time = 0;
  let id = 0;
  const jobs = new Map();
  const changes = [];
  const intent = createNotePreviewIntent({
    onChange: (slug) => changes.push(slug),
    now: () => time,
    schedule: (callback, delay) => { jobs.set(++id, { callback, at: time + delay }); return id; },
    cancel: (key) => jobs.delete(key),
  });
  const advance = (duration) => {
    const target = time + duration;
    for (;;) {
      const next = [...jobs].filter(([, job]) => job.at <= target).sort((a, b) => a[1].at - b[1].at)[0];
      if (!next) break;
      time = next[1].at;
      jobs.delete(next[0]);
      next[1].callback();
    }
    time = target;
  };
  return { intent, changes, advance, jobs };
}

test("passing over a row does not open it; deliberate hover opens after 350ms", () => {
  const { intent, changes, advance } = setup();
  intent.enter("first");
  advance(200);
  intent.leave("first");
  advance(500);
  assert.deepEqual(changes, []);
  intent.enter("second");
  advance(349);
  assert.deepEqual(changes, []);
  advance(1);
  assert.deepEqual(changes, ["second"]);
});

test("switching rows is immediate within the 300ms grace period", () => {
  const { intent, changes, advance } = setup();
  intent.enter("first");
  advance(350);
  intent.leave("first");
  advance(299);
  intent.enter("second");
  assert.deepEqual(changes, ["first", null, "second"]);
  intent.leave("second");
  advance(300);
  intent.enter("third");
  assert.equal(changes.at(-1), null);
  advance(350);
  assert.equal(changes.at(-1), "third");
});

test("stale leave events cannot close a newer row, and disposal cancels pending work", () => {
  const { intent, changes, advance, jobs } = setup();
  intent.enter("first", true);
  intent.enter("second");
  intent.leave("first");
  assert.deepEqual(changes, ["first", "second"]);
  intent.close();
  advance(500);
  intent.enter("third");
  intent.dispose();
  assert.equal(jobs.size, 0);
  advance(500);
  assert.deepEqual(changes, ["first", "second", null]);
});
