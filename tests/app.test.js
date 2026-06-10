const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const root = path.join(__dirname, "..");

function loadApp(options = {}) {
  const elements = new Map();
  const modules = options.modules || [
    { slug: "lesson-one", file: "lesson-one.html" },
    { slug: "lesson-two", file: "lesson-two.html" }
  ];

  function element(id) {
    if (!elements.has(id)) {
      elements.set(id, {
        checked: false,
        files: [],
        id,
        listeners: {},
        tagName: "INPUT",
        type: "",
        value: "",
        addEventListener(event, handler) {
          (this.listeners[event] || (this.listeners[event] = [])).push(handler);
        },
        dispatch(event) {
          (this.listeners[event] || []).forEach((handler) => handler());
        },
        click() {}
      });
    }
    return elements.get(id);
  }

  const app = element("app");
  const storage = {};
  const context = {
    Blob,
    URL,
    clearTimeout: options.clearTimeout || clearTimeout,
    console,
    document: {
      createElement() {
        return element(`created-${elements.size}`);
      },
      getElementById(id) {
        return id === "app" ? app : element(id);
      }
    },
    localStorage: null,
    setTimeout: options.setTimeout || setTimeout,
    window: {
      HPT_CURRICULUM: {
        modules,
        sources: [],
        title: "Test Curriculum"
      },
      HPT_EXPOSE_TESTS: true,
      LESSON_SLUG: options.pageSlug || null,
      alert() {},
      clearTimeout: options.clearTimeout || clearTimeout,
      location: {
        href: "https://example.test/index.html",
        reload() {}
      },
      localStorage: {
        getItem(key) {
          return storage[key] || null;
        },
        setItem(key, value) {
          storage[key] = value;
        }
      },
      setTimeout: options.setTimeout || setTimeout
    }
  };
  context.localStorage = context.window.localStorage;
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(root, "app.js"), "utf8"), context, { filename: "app.js" });
  return Object.assign({ appHtml: app.innerHTML, elements, storage }, context.window.HPT_TESTS);
}

function loadCurriculum() {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(root, "curriculum.js"), "utf8"), context, { filename: "curriculum.js" });
  return context.window.HPT_CURRICULUM;
}

test("safeUrl rejects dangerous and non-HTTPS external URLs", () => {
  const { safeUrl } = loadApp();

  assert.equal(safeUrl("javascript:alert(1)", { allowRelative: false }), "#");
  assert.equal(safeUrl("data:text/html,hi", { allowRelative: false }), "#");
  assert.equal(safeUrl("//evil.example/path", { allowRelative: false }), "#");
  assert.equal(safeUrl("http://example.test/path", { allowRelative: false }), "#");
});

test("safeUrl preserves safe relative URLs and enforces origin allow-lists", () => {
  const { safeUrl } = loadApp();

  assert.equal(safeUrl("lessons/one.html?x=1#top"), "https://example.test/lessons/one.html?x=1#top");
  assert.equal(safeUrl("https://allowed.example/video", {
    allowRelative: false,
    allowedOrigins: ["https://allowed.example"]
  }), "https://allowed.example/video");
  assert.equal(safeUrl("https://blocked.example/video", {
    allowRelative: false,
    allowedOrigins: ["https://allowed.example"]
  }), "#");
});

test("safeYoutubeEmbed accepts normal IDs and rejects malformed IDs", () => {
  const { safeYoutubeEmbed } = loadApp();

  assert.equal(safeYoutubeEmbed("YUTAimvbfSk"), "https://www.youtube-nocookie.com/embed/YUTAimvbfSk");
  assert.equal(safeYoutubeEmbed("../bad"), "");
  assert.equal(safeYoutubeEmbed("x".repeat(40)), "");
});

test("clampPercent keeps progress finite and bounded", () => {
  const { clampPercent } = loadApp();

  assert.equal(clampPercent(Number.NaN), 0);
  assert.equal(clampPercent(-25), 0);
  assert.equal(clampPercent(42), 42);
  assert.equal(clampPercent(125), 100);
});

test("normalizeProgress keeps only known module entries and expected fields", () => {
  const { normalizeProgress } = loadApp();

  const normalized = normalizeProgress({
    "lesson-one": {
      complete: 1,
      date: "2026-06-09",
      extra: "<script>",
      notes: "Good scan",
      rating: "Emerging",
      started: true,
      updatedAt: "now"
    },
    unknown: {
      started: true
    }
  });

  assert.deepEqual(JSON.parse(JSON.stringify(normalized)), {
    "lesson-one": {
      complete: true,
      date: "2026-06-09",
      notes: "Good scan",
      rating: "Emerging",
      started: true,
      updatedAt: "now"
    }
  });
});

test("Risk-ATTEND modules open externally instead of embedding Toyota app", () => {
  const curriculum = loadCurriculum();
  const riskAttendModules = curriculum.modules.filter((module) => module.slug.includes("risk-attend"));

  assert.equal(riskAttendModules.length, 2);
  for (const module of riskAttendModules) {
    assert.equal(module.embedUrl, undefined);
    assert.equal(module.embedTitle, undefined);
    assert.equal(module.activityUrl, "https://amrd.toyota.com/csrc/risk/");
    assert.equal(module.activityLabel, "Open Risk-ATTEND");
  }
});

test("Smart Drive Test companions are only added to the four approved DED modules", () => {
  const curriculum = loadCurriculum();
  const companionModules = curriculum.modules.filter((module) => module.companionVideo);

  assert.equal(curriculum.modules.length, 28);
  assert.deepEqual(JSON.parse(JSON.stringify(companionModules.map((module) => module.id))), [3, 4, 5, 8]);
  assert.deepEqual(JSON.parse(JSON.stringify(companionModules.map((module) => module.companionVideo.id))), [
    "91fc2N1-5sw",
    "TrtgVbd87SY",
    "J_UKNOGJ2tU",
    "v0Soc-kicOQ"
  ]);

  for (const module of companionModules) {
    assert.match(module.companionVideo.note, /Canadian, right-side-of-road/);
    assert.match(module.companionVideo.prompt, /Before|before/);
    assert.match(module.preWatch, /DED/);
    assert.match(module.preWatch, /Smart Drive Test/);
  }
});

test("renderLesson renders primary and companion YouTube embeds", () => {
  const { appHtml } = loadApp({
    pageSlug: "lesson-one",
    modules: [
      {
        id: 1,
        slug: "lesson-one",
        file: "lesson-one.html",
        title: "Lesson One",
        phase: "Phase",
        cost: "Free",
        time: "10 min",
        objective: "Observe safely.",
        video: "YUTAimvbfSk",
        companionVideo: {
          id: "91fc2N1-5sw",
          label: "Commentary & method (Smart Drive Test)",
          note: "Canadian, right-side-of-road context.",
          prompt: "Predict aloud before watching."
        },
        preWatch: "Before watching.",
        sourceFit: "Fits here.",
        do: ["Watch."],
        drill: ["Scan."],
        pass: "Explain it.",
        logPrompts: ["What changed?"],
        resources: []
      }
    ]
  });

  assert.match(appHtml, /youtube-nocookie\.com\/embed\/YUTAimvbfSk/);
  assert.match(appHtml, /youtube-nocookie\.com\/embed\/91fc2N1-5sw/);
  assert.match(appHtml, /Commentary &amp; method \(Smart Drive Test\)/);
  assert.match(appHtml, /Active prompt:/);
});

test("renderLesson auto-marks the lesson as started once the dwell timer fires", () => {
  const timers = [];
  const { elements, storage } = loadApp({
    pageSlug: "lesson-one",
    setTimeout: (fn) => timers.push(fn),
    modules: [
      {
        id: 1,
        slug: "lesson-one",
        file: "lesson-one.html",
        title: "Lesson One",
        phase: "Phase",
        cost: "Free",
        time: "10 min",
        objective: "Observe safely.",
        sourceFit: "Fits here.",
        do: ["Watch."],
        drill: ["Scan."],
        pass: "Explain it.",
        logPrompts: ["What changed?"],
        resources: []
      }
    ]
  });

  assert.equal(storage["hpt-progress-v1"], undefined);

  timers.forEach((fn) => fn());

  const saved = JSON.parse(storage["hpt-progress-v1"]);
  assert.equal(saved["lesson-one"].started, true);
  assert.equal(elements.get("started").checked, true);
  // Date must reflect the learner's local calendar day, not UTC.
  const now = new Date();
  const expectedDate = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0")
  ].join("-");
  assert.equal(elements.get("date").value, expectedDate);
});

test("manually toggling Started cancels the pending auto-start timer", () => {
  const timers = new Map();
  let nextId = 0;
  const { elements, storage } = loadApp({
    pageSlug: "lesson-one",
    setTimeout: (fn) => {
      const id = ++nextId;
      timers.set(id, fn);
      return id;
    },
    clearTimeout: (id) => timers.delete(id),
    modules: [
      {
        id: 1,
        slug: "lesson-one",
        file: "lesson-one.html",
        title: "Lesson One",
        phase: "Phase",
        cost: "Free",
        time: "10 min",
        objective: "Observe safely.",
        sourceFit: "Fits here.",
        do: ["Watch."],
        drill: ["Scan."],
        pass: "Explain it.",
        logPrompts: ["What changed?"],
        resources: []
      }
    ]
  });

  // The learner checks Started, then changes their mind and unchecks it,
  // both within the dwell window. Each toggle runs every "change" handler.
  const startedEl = elements.get("started");
  startedEl.checked = true;
  startedEl.dispatch("change");
  startedEl.checked = false;
  startedEl.dispatch("change");

  // The first manual toggle must have cleared the pending dwell timer.
  assert.equal(timers.size, 0);

  // Firing any remaining timers must not override the learner's choice.
  timers.forEach((fn) => fn());

  const saved = JSON.parse(storage["hpt-progress-v1"]);
  assert.equal(saved["lesson-one"].started, false);
  assert.equal(elements.get("date").value, "");
});
