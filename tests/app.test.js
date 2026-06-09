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
          this.listeners[event] = handler;
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
    clearTimeout,
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
    setTimeout,
    window: {
      HPT_CURRICULUM: {
        modules,
        sources: [],
        title: "Test Curriculum"
      },
      HPT_EXPOSE_TESTS: true,
      LESSON_SLUG: null,
      alert() {},
      clearTimeout,
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
      setTimeout
    }
  };
  context.localStorage = context.window.localStorage;
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(root, "app.js"), "utf8"), context, { filename: "app.js" });
  return context.window.HPT_TESTS;
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
