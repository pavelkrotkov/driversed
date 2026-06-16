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
        groups: options.groups || [],
        modules,
        sources: [],
        title: "Test Curriculum"
      },
      HPT_CHECKPOINTS: options.checkpoints || [],
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

function loadCheckpoints() {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(root, "mcq-data.js"), "utf8"), context, { filename: "mcq-data.js" });
  return context.window.HPT_CHECKPOINTS;
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

test("html escapes interpolated values by default", () => {
  const { html, renderHtml } = loadApp();

  const output = renderHtml(html`<h1>${'<img src=x onerror="alert(1)">'}</h1>`);
  assert.equal(output, '<h1>&lt;img src=x onerror=&quot;alert(1)&quot;&gt;</h1>');
});

test("html preserves zero values while escaping", () => {
  const { html, renderHtml } = loadApp();

  assert.equal(renderHtml(html`<span>${0}</span>`), "<span>0</span>");
});

test("html keeps raw() fragments unescaped and composes nested templates", () => {
  const { html, raw, renderHtml } = loadApp();

  const svg = "<svg><path/></svg>";
  const nested = html`<span>${"<b>&"}</span>`;
  const output = renderHtml(html`<div>${raw(svg)}${nested}</div>`);
  assert.equal(output, "<div><svg><path/></svg><span>&lt;b&gt;&amp;</span></div>");
});

test("html renders arrays by escaping each item and dropping nullish values", () => {
  const { html, renderHtml } = loadApp();

  const items = ["a", "<b>", "c&d"].map((value) => html`<li>${value}</li>`);
  const output = renderHtml(html`<ul>${items}</ul>${null}${false}${undefined}`);
  assert.equal(output, "<ul><li>a</li><li>&lt;b&gt;</li><li>c&amp;d</li></ul>");
});

test("renderHome escapes module fields but keeps icon SVGs raw", () => {
  const { appHtml } = loadApp({
    modules: [
      {
        id: 1,
        slug: "x",
        file: "x.html",
        phase: "Phase",
        cost: "Free",
        title: "<script>bad()</script>",
        objective: "Obj & more"
      }
    ]
  });

  assert.match(appHtml, /&lt;script&gt;bad\(\)&lt;\/script&gt;/);
  assert.doesNotMatch(appHtml, /<script>bad\(\)<\/script>/);
  assert.match(appHtml, /Obj &amp; more/);
  assert.match(appHtml, /<svg aria-hidden="true"/);
});

test("URLs flow through safeUrl and are escaped once at the template boundary", () => {
  const { appHtml } = loadApp({
    modules: [
      {
        id: 1,
        slug: "x",
        file: "x.html?a=1&b=2",
        phase: "Phase",
        cost: "Free",
        title: "Title",
        objective: "Objective"
      }
    ]
  });

  // safeUrl validates and returns the href; html`` escapes it exactly once,
  // so the ampersand is encoded a single time (no double-escaped &amp;amp;).
  assert.match(appHtml, /href="https:\/\/example\.test\/x\.html\?a=1&amp;b=2"/);
  assert.doesNotMatch(appHtml, /&amp;amp;/);
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

test("normalizeProgress keeps checkpoint entries separate from lessons", () => {
  const { normalizeProgress } = loadApp({
    groups: [{ id: "g01", unitIds: [1] }],
    checkpoints: [
      {
        id: "g01",
        questions: [
          { id: "g01-q01", choices: ["A", "B"], answer: 1 }
        ]
      }
    ]
  });

  const normalized = normalizeProgress({
    "checkpoint:g01": {
      answers: {
        "g01-q01": 1,
        unknown: 0
      },
      complete: 1,
      score: 125,
      correct: 1,
      selfDeclared: false,
      submittedAt: "2026-06-15T00:00:00.000Z",
      updatedAt: "now"
    }
  });

  assert.deepEqual(JSON.parse(JSON.stringify(normalized)), {
    "checkpoint:g01": {
      answers: {
        "g01-q01": 1
      },
      complete: true,
      correct: 1,
      score: 100,
      selfDeclared: false,
      started: false,
      submittedAt: "2026-06-15T00:00:00.000Z",
      updatedAt: "now"
    }
  });
});

test("scoreCheckpoint counts answered and correct questions", () => {
  const { scoreCheckpoint } = loadApp();
  const checkpoint = {
    questions: [
      { id: "q1", choices: ["A", "B"], answer: 1 },
      { id: "q2", choices: ["A", "B"], answer: 0 }
    ]
  };

  assert.deepEqual(JSON.parse(JSON.stringify(scoreCheckpoint(checkpoint, { q1: 1 }))), {
    answered: 1,
    correct: 1,
    total: 2,
    score: 50
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

  assert.equal(curriculum.modules.length, 32);
  assert.deepEqual(JSON.parse(JSON.stringify(companionModules.map((module) => module.id))), [4, 5, 7, 9]);
  assert.deepEqual(JSON.parse(JSON.stringify(companionModules.map((module) => module.companionVideo.id))), [
    "91fc2N1-5sw",
    "J_UKNOGJ2tU",
    "TrtgVbd87SY",
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

test("renderLesson scores the final module checkpoint", () => {
  const checkpoint = {
    id: "g01",
    passTarget: 80,
    questions: [
      {
        id: "g01-q01",
        title: "Hidden space",
        prompt: "What should you predict?",
        choices: ["Ignore it", "Hidden actor"],
        answer: 1,
        explanation: "Look for the hidden space.",
        errorCategory: "Hidden-space recognition"
      }
    ]
  };
  const { appHtml, elements, storage } = loadApp({
    pageSlug: "lesson-two",
    groups: [
      {
        id: "g01",
        title: "Hidden-Risk Baseline",
        unitIds: [1, 2],
        estimatedStudentMinutes: 75,
        knownRuntime: "n/a"
      }
    ],
    checkpoints: [checkpoint],
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
        do: ["Watch."],
        drill: ["Scan."],
        pass: "Explain it.",
        logPrompts: ["What changed?"],
        resources: []
      },
      {
        id: 2,
        slug: "lesson-two",
        file: "lesson-two.html",
        title: "Lesson Two",
        phase: "Phase",
        cost: "Free",
        time: "10 min",
        objective: "Observe safely.",
        do: ["Watch."],
        drill: ["Scan."],
        pass: "Explain it.",
        logPrompts: ["What changed?"],
        resources: []
      }
    ]
  });

  assert.match(appHtml, /G01 Checkpoint/);
  assert.match(appHtml, /Hidden space/);

  elements.get("choice-g01-q01-1").checked = true;
  elements.get("submit-checkpoint").dispatch("click");

  const saved = JSON.parse(storage["hpt-progress-v1"]);
  assert.equal(saved["checkpoint:g01"].complete, true);
  assert.equal(saved["checkpoint:g01"].score, 100);
  assert.deepEqual(saved["checkpoint:g01"].answers, { "g01-q01": 1 });
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

function stubSlug(name) {
  const match = fs.readFileSync(path.join(root, name), "utf8").match(/LESSON_SLUG\s*=\s*"([^"]+)"/);
  return match ? match[1] : null;
}

function numberedStubs() {
  return fs.readdirSync(root).filter((name) => /^\d.*\.html$/.test(name)).sort();
}

test("every curriculum module has a matching stub whose slug matches its filename", () => {
  const { modules } = loadCurriculum();

  for (const module of modules) {
    assert.equal(module.file, `${module.slug}.html`, `file must equal slug for ${module.slug}`);
    assert.ok(fs.existsSync(path.join(root, module.file)), `missing stub file ${module.file}`);
    // This is the exact failure that broke 13 tiles: a stub whose LESSON_SLUG
    // did not match any module, so app.js silently fell back to the home page.
    assert.equal(stubSlug(module.file), module.slug, `stub ${module.file} declares the wrong slug`);
  }
});

test("every numbered stub maps to a module and loads the shared scripts", () => {
  const { modules } = loadCurriculum();
  const slugs = new Set(modules.map((module) => module.slug));
  const stubs = numberedStubs();

  assert.equal(stubs.length, modules.length, "stub count must match module count");
  for (const name of stubs) {
    assert.ok(slugs.has(stubSlug(name)), `stub ${name} has no matching module`);
    const html = fs.readFileSync(path.join(root, name), "utf8");
    assert.match(html, /curriculum\.js/, `${name} must load curriculum.js`);
    assert.match(html, /mcq-data\.js/, `${name} must load mcq-data.js`);
    assert.match(html, /app\.js/, `${name} must load app.js`);
  }
});

test("index loads curriculum, checkpoint data, and the app in order", () => {
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const curriculumIndex = html.indexOf("curriculum.js");
  const checkpointIndex = html.indexOf("mcq-data.js");
  const appIndex = html.indexOf("app.js");

  assert.ok(curriculumIndex > -1, "index must load curriculum.js");
  assert.ok(checkpointIndex > curriculumIndex, "index must load mcq-data.js after curriculum.js");
  assert.ok(appIndex > checkpointIndex, "index must load app.js after mcq-data.js");
});

test("renderHome links every module to an existing file and never to '#'", () => {
  const { modules } = loadCurriculum();
  const { appHtml } = loadApp({ modules });

  const hrefs = [...appHtml.matchAll(/class="module-card" href="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(hrefs.length, modules.length, "one card per module");
  for (const href of hrefs) {
    assert.notEqual(href, "#", "module cards must resolve to a real file");
  }
  for (const module of modules) {
    assert.ok(appHtml.includes(module.file), `home should link to ${module.file}`);
    assert.ok(fs.existsSync(path.join(root, module.file)), `${module.file} must exist`);
  }
});

test("curriculum ids are sequential and slugs/required fields are well formed", () => {
  const { modules } = loadCurriculum();
  const ids = modules.map((module) => module.id);
  const slugs = modules.map((module) => module.slug);

  assert.equal(new Set(ids).size, ids.length, "ids must be unique");
  assert.equal(new Set(slugs).size, slugs.length, "slugs must be unique");
  assert.deepEqual(ids, modules.map((_, index) => index + 1), "ids must run 1..N in order");

  for (const module of modules) {
    for (const field of ["slug", "file", "title", "phase", "cost", "time", "objective", "pass"]) {
      assert.equal(typeof module[field], "string", `${module.slug} ${field} must be a string`);
      assert.ok(module[field].length > 0, `${module.slug} ${field} must not be empty`);
    }
    for (const field of ["do", "drill", "logPrompts", "resources"]) {
      assert.ok(Array.isArray(module[field]), `${module.slug} ${field} must be an array`);
    }
  }
});

test("curriculum groups assign all 32 modules exactly once", () => {
  const { groups, modules } = loadCurriculum();
  const moduleIds = modules.map((module) => module.id);
  const assigned = groups.flatMap((group) => group.unitIds);

  assert.equal(groups.length, 10);
  assert.deepEqual(
    JSON.parse(JSON.stringify([...assigned].sort((a, b) => a - b))),
    JSON.parse(JSON.stringify(moduleIds))
  );
  assert.equal(new Set(assigned).size, moduleIds.length, "module ids must not be assigned twice");

  for (const group of groups) {
    assert.match(group.id, /^g\d\d$/);
    assert.equal(typeof group.title, "string");
    assert.ok(group.title.length > 0);
    assert.ok(Array.isArray(group.unitIds));
    assert.equal(typeof group.estimatedStudentMinutes, "number");
    assert.equal(typeof group.knownRuntime, "string");
    assert.match(group.mcqAsset, /^assets\/mcq-.*\.md$/);
    assert.ok(fs.existsSync(path.join(root, group.mcqAsset)), `${group.mcqAsset} must exist`);
  }
});

test("generated checkpoint data matches the markdown MCQ banks", () => {
  const { groups } = loadCurriculum();
  const checkpoints = loadCheckpoints();

  assert.equal(checkpoints.length, groups.length);
  for (const group of groups) {
    const checkpoint = checkpoints.find((item) => item.id === group.id);
    assert.ok(checkpoint, `missing checkpoint ${group.id}`);
    assert.equal(checkpoint.source, group.mcqAsset);
    assert.equal(checkpoint.passTarget, 80);

    const markdown = fs.readFileSync(path.join(root, group.mcqAsset), "utf8");
    const questionCount = (markdown.match(/^## Q\d+/gm) || []).length;
    const answerCount = (markdown.match(/^\*\*Answer:\*\*/gm) || []).length;
    const keyCount = (markdown.match(/^\d+\. [A-D]$/gm) || []).length;

    assert.equal(checkpoint.questions.length, questionCount, `${group.mcqAsset} question count`);
    assert.equal(questionCount, answerCount, `${group.mcqAsset} answer count`);
    assert.equal(answerCount, keyCount, `${group.mcqAsset} answer key count`);
    for (const question of checkpoint.questions) {
      assert.equal(question.choices.length, 4);
      assert.ok(Number.isInteger(question.answer));
      assert.ok(question.answer >= 0 && question.answer < question.choices.length);
      assert.ok(question.explanation.length > 0);
      assert.ok(question.errorCategory.length > 0);
    }
  }
});

test("generated transcript markdown still contains 20 video sections", () => {
  const transcript = fs.readFileSync(path.join(root, "assets/driversed.md"), "utf8");
  const sections = transcript.match(/^## /gm) || [];

  assert.equal(sections.length, 20);
});

test("module media ids and links pass the app's URL validators", () => {
  const { modules } = loadCurriculum();
  const { safeUrl, safeYoutubeEmbed } = loadApp();

  for (const module of modules) {
    if (module.video) {
      assert.notEqual(safeYoutubeEmbed(module.video), "", `${module.slug} has an invalid video id`);
    }
    if (module.companionVideo) {
      assert.notEqual(safeYoutubeEmbed(module.companionVideo.id), "", `${module.slug} has an invalid companion id`);
    }
    if (module.activityUrl) {
      assert.notEqual(safeUrl(module.activityUrl, { allowRelative: false }), "#", `${module.slug} has a rejected activityUrl`);
    }
    for (const [, url] of module.resources) {
      assert.notEqual(safeUrl(url, { allowRelative: false }), "#", `${module.slug} has a rejected resource URL: ${url}`);
    }
  }
});

test("site-construction metadata stays out of the curriculum", () => {
  const curriculum = loadCurriculum();

  assert.equal("critique" in curriculum, false, "critique should be removed");
  assert.equal("sources" in curriculum, false, "sources should be removed");
  for (const module of curriculum.modules) {
    assert.equal("sourceFit" in module, false, `${module.slug} should not carry sourceFit`);
  }
});
