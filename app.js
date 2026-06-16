(function () {
  const storageKey = "hpt-progress-v1";
  const STARTED_DWELL_MS = 8000;
  const EMBED_ORIGINS = ["https://amrd.toyota.com", "https://www.youtube-nocookie.com", "https://www.youtube.com"];
  const data = window.HPT_CURRICULUM || {};
  const modules = Array.isArray(data.modules) ? data.modules : [];
  const groups = Array.isArray(data.groups) ? data.groups : [];
  const checkpoints = Array.isArray(window.HPT_CHECKPOINTS) ? window.HPT_CHECKPOINTS : [];
  const checkpointById = new Map(checkpoints.map((checkpoint) => [checkpoint.id, checkpoint]));
  const app = document.getElementById("app");

  const pageSlug = window.LESSON_SLUG || null;

  function loadProgress() {
    try {
      return normalizeProgress(JSON.parse(localStorage.getItem(storageKey)) || {});
    } catch (error) {
      return {};
    }
  }

  function saveProgress(progress) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(normalizeProgress(progress)));
    } catch (error) {
      console.error("Failed to save progress to localStorage:", error);
    }
  }

  function lessonProgress(slug) {
    const progress = loadProgress();
    return progress[slug] || {};
  }

  function checkpointStorageKey(id) {
    return `checkpoint:${id}`;
  }

  function checkpointProgress(id) {
    const progress = loadProgress();
    return progress[checkpointStorageKey(id)] || {};
  }

  function updateLesson(slug, patch) {
    const progress = loadProgress();
    progress[slug] = Object.assign({}, progress[slug] || {}, patch, {
      updatedAt: new Date().toISOString()
    });
    saveProgress(progress);
  }

  function updateCheckpoint(id, patch) {
    const key = checkpointStorageKey(id);
    const progress = loadProgress();
    progress[key] = Object.assign({}, progress[key] || {}, patch, {
      updatedAt: new Date().toISOString()
    });
    saveProgress(progress);
  }

  function completedCount() {
    const progress = loadProgress();
    return modules.filter((module) => progress[module.slug]?.complete).length;
  }

  function percentComplete() {
    return modules.length > 0 ? Math.round((completedCount() / modules.length) * 100) : 0;
  }

  function clampPercent(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return 0;
    return Math.min(100, Math.max(0, number));
  }

  function todayLocalDate() {
    const now = new Date();
    return [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0")
    ].join("-");
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  // Escape-by-default templating. `html` is a tagged template that escapes
  // every interpolation with escapeHtml, so a value such as module.title is
  // safe even if it later starts carrying user-influenced text. Known-safe
  // fragments (icon SVGs, nested html`` output) must be wrapped in raw(...) so
  // that every unescaped HTML insertion is explicit and greppable.
  function raw(value) {
    return { __raw: value == null ? "" : String(value) };
  }

  function isRaw(value) {
    return Boolean(value) && typeof value === "object" && typeof value.__raw === "string";
  }

  // Turn any interpolated value into an HTML string: raw markers (including
  // nested html`` results) pass through untouched, arrays are flattened element
  // by element, null/false/undefined render as empty, everything else escapes.
  function interpolate(value) {
    if (value == null || value === false) return "";
    if (isRaw(value)) return value.__raw;
    if (Array.isArray(value)) return value.map(interpolate).join("");
    return escapeHtml(value);
  }

  function html(strings, ...values) {
    let out = strings[0];
    for (let i = 0; i < values.length; i += 1) {
      out += interpolate(values[i]) + strings[i + 1];
    }
    return raw(out);
  }

  function mount(target, template) {
    target.innerHTML = interpolate(template);
  }

  function safeUrl(value, options = {}) {
    const { allowRelative = true, allowExternal = true, allowedOrigins = null } = options;
    const raw = String(value || "").trim();
    if (!raw) return "#";

    try {
      const url = new URL(raw, window.location.href);
      const isProtocolRelative = raw.startsWith("//");
      if (isProtocolRelative) return "#";
      const isRelative = !/^[a-z][a-z\d+.-]*:/i.test(raw) && !isProtocolRelative;
      const hasSafeProtocol = url.protocol === "https:";
      const hasAllowedOrigin = !allowedOrigins || allowedOrigins.includes(url.origin);

      // Return the validated href unescaped; the html`` template performs the
      // attribute-context escaping when it is interpolated into markup. This
      // keeps URLs flowing through safeUrl validation rather than raw(...).
      if (isRelative && allowRelative) {
        return url.href;
      }

      if (!isRelative && allowExternal && hasSafeProtocol && hasAllowedOrigin) {
        return url.href;
      }
    } catch (error) {
      return "#";
    }

    return "#";
  }

  function safeYoutubeEmbed(videoId) {
    const id = String(videoId || "");
    return /^[A-Za-z0-9_-]{6,32}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : "";
  }

  function groupForModuleId(moduleId) {
    return groups.find((group) => Array.isArray(group.unitIds) && group.unitIds.includes(moduleId)) || null;
  }

  function modulesForGroup(group) {
    const ids = new Set(Array.isArray(group?.unitIds) ? group.unitIds : []);
    return modules.filter((module) => ids.has(module.id));
  }

  function groupCompletion(group, progress = loadProgress()) {
    const groupModules = modulesForGroup(group);
    const complete = groupModules.filter((module) => progress[module.slug]?.complete).length;
    return { complete, total: groupModules.length };
  }

  function checkpointIsComplete(groupId, progress = loadProgress()) {
    return Boolean(progress[checkpointStorageKey(groupId)]?.complete);
  }

  function normalizeCheckpointAnswers(rawAnswers, checkpoint) {
    if (!rawAnswers || typeof rawAnswers !== "object" || Array.isArray(rawAnswers) || !checkpoint || !Array.isArray(checkpoint.questions)) return {};

    return checkpoint.questions.reduce((result, question) => {
      const rawValue = rawAnswers[question.id];
      const canConvert = typeof rawValue === "number" || (typeof rawValue === "string" && rawValue.trim() !== "");
      if (canConvert) {
        const value = Number(rawValue);
        if (Number.isInteger(value) && value >= 0 && value < question.choices.length) {
          result[question.id] = value;
        }
      }
      return result;
    }, {});
  }

  function scoreCheckpoint(checkpoint, answers) {
    if (!checkpoint || !Array.isArray(checkpoint.questions) || checkpoint.questions.length === 0) {
      return { answered: 0, correct: 0, total: 0, score: 0 };
    }

    const safeAnswers = answers && typeof answers === "object" && !Array.isArray(answers) ? answers : {};
    const result = checkpoint.questions.reduce((summary, question) => {
      if (Number.isInteger(safeAnswers[question.id])) {
        summary.answered += 1;
        if (safeAnswers[question.id] === question.answer) {
          summary.correct += 1;
        }
      }
      return summary;
    }, { answered: 0, correct: 0 });

    return {
      answered: result.answered,
      correct: result.correct,
      total: checkpoint.questions.length,
      score: Math.round((result.correct / checkpoint.questions.length) * 100)
    };
  }

  function normalizeProgress(raw) {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};

    const result = modules.reduce((memo, module) => {
      const entry = raw[module.slug];
      if (!entry || typeof entry !== "object" || Array.isArray(entry)) return memo;

      memo[module.slug] = {
        started: Boolean(entry.started),
        complete: Boolean(entry.complete),
        date: typeof entry.date === "string" ? entry.date : "",
        rating: typeof entry.rating === "string" ? entry.rating : "",
        notes: typeof entry.notes === "string" ? entry.notes : "",
        updatedAt: typeof entry.updatedAt === "string" ? entry.updatedAt : ""
      };
      return memo;
    }, {});

    groups.forEach((group) => {
      const checkpoint = checkpointById.get(group.id);
      const entry = raw[checkpointStorageKey(group.id)];
      if (!entry || typeof entry !== "object" || Array.isArray(entry)) return;

      result[checkpointStorageKey(group.id)] = {
        started: Boolean(entry.started),
        complete: Boolean(entry.complete),
        selfDeclared: Boolean(entry.selfDeclared),
        answers: normalizeCheckpointAnswers(entry.answers, checkpoint),
        score: entry.score != null && !(typeof entry.score === "string" && entry.score.trim() === "") && Number.isFinite(Number(entry.score)) ? clampPercent(Number(entry.score)) : null,
        correct: entry.correct != null && !(typeof entry.correct === "string" && entry.correct.trim() === "") && Number.isFinite(Number(entry.correct)) ? Math.max(0, Number(entry.correct)) : null,
        submittedAt: typeof entry.submittedAt === "string" ? entry.submittedAt : "",
        updatedAt: typeof entry.updatedAt === "string" ? entry.updatedAt : ""
      };
    });

    return result;
  }

  if (window.HPT_EXPOSE_TESTS) {
    window.HPT_TESTS = {
      clampPercent,
      escapeHtml,
      html,
      normalizeProgress,
      raw,
      renderHtml: interpolate,
      safeUrl,
      safeYoutubeEmbed,
      scoreCheckpoint,
      todayLocalDate
    };
  }

  function icon(name) {
    const paths = {
      home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9 21v-7h6v7"/>',
      export: '<path d="M12 3v12"/><path d="m7 8 5-5 5 5"/><path d="M5 14v5h14v-5"/>',
      import: '<path d="M12 15V3"/><path d="m7 10 5 5 5-5"/><path d="M5 14v5h14v-5"/>',
      check: '<path d="m4 12 5 5L20 6"/>',
      next: '<path d="M5 12h14"/><path d="m13 5 7 7-7 7"/>',
      prev: '<path d="M19 12H5"/><path d="m11 5-7 7 7 7"/>',
      link: '<path d="M10 13a5 5 0 0 0 7.1 0l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1"/><path d="M14 11a5 5 0 0 0-7.1 0l-2 2A5 5 0 0 0 12 20.1l1.1-1.1"/>'
    };
    // SVG markup is built from a fixed allow-list of names, so it is a known
    // raw fragment; returning a raw marker lets it pass through html`` intact.
    return raw(`<svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths[name] || ""}</svg>`);
  }

  function shell(content) {
    return html`
      <div class="site-shell">
        <header class="topbar">
          <a class="brand" href="index.html">
            <span class="brand-mark">${icon("check")}</span>
            <span>${data.title || "Teen Hazard Perception Lab"}</span>
          </a>
          <div class="top-actions">
            <a class="button ghost" href="index.html">${icon("home")} Home</a>
            <button type="button" id="export-progress">${icon("export")} Export</button>
            <button type="button" id="import-progress">${icon("import")} Import</button>
            <input class="hidden-file" id="import-file" type="file" accept="application/json">
          </div>
        </header>
        ${content}
        <footer class="footer">
          Hazard-perception supplement for supervised practice. It does not replace licensed instruction, state law, or a parent/guardian's judgment in live traffic.
        </footer>
      </div>
    `;
  }

  function bindImportExport() {
    const exportButton = document.getElementById("export-progress");
    const importButton = document.getElementById("import-progress");
    const importFile = document.getElementById("import-file");

    exportButton?.addEventListener("click", () => {
      const payload = {
        exportedAt: new Date().toISOString(),
        curriculumUpdated: data.updated,
        progress: loadProgress()
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "hazard-perception-progress.json";
      link.click();
      URL.revokeObjectURL(url);
    });

    importButton?.addEventListener("click", () => importFile?.click());
    importFile?.addEventListener("change", async () => {
      const file = importFile.files?.[0];
      if (!file) return;
      if (file.size > 1048576) {
        window.alert("File too large. Maximum size is 1MB.");
        importFile.value = "";
        return;
      }
      try {
        const text = await file.text();
        const parsed = JSON.parse(text);
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
          throw new Error("Progress import must be a JSON object.");
        }
        saveProgress(parsed.progress || parsed);
        window.location.reload();
      } catch (error) {
        window.alert("Invalid progress file. Please upload a valid exported JSON file.");
      } finally {
        importFile.value = "";
      }
    });
  }

  function renderHome() {
    const done = completedCount();
    const percent = percentComplete();
    const progressPercent = clampPercent(percent);
    const progress = loadProgress();
    const completedGroups = groups.filter((group) => {
      const completion = groupCompletion(group, progress);
      return completion.total > 0 && completion.complete === completion.total;
    }).length;
    const completedCheckpoints = groups.filter((group) => checkpointIsComplete(group.id, progress)).length;
    const pendingModule = modules.find((module) => !progress[module.slug]?.complete);
    const fallbackModule = modules.length > 0 ? modules[modules.length - 1] : null;
    const nextModule = pendingModule || fallbackModule;

    const groupCards = groups.map((group) => {
      const groupModules = modulesForGroup(group);
      const completion = groupCompletion(group, progress);
      const firstModule = groupModules[0];
      const lastModule = groupModules[groupModules.length - 1];
      const nextGroupModule = groupModules.find((module) => !progress[module.slug]?.complete) || lastModule;
      const checkpointDone = checkpointIsComplete(group.id, progress);
      const checkpoint = checkpointById.get(group.id);
      const checkpointLabel = checkpoint && Array.isArray(checkpoint.questions) ? `${checkpoint.questions.length} questions` : "Checkpoint";
      const unitRange = firstModule && lastModule ? `Modules ${String(firstModule.id).padStart(2, "0")}-${String(lastModule.id).padStart(2, "0")}` : "Modules";
      const runtime = group.knownRuntime && group.knownRuntime !== "n/a" ? `${group.knownRuntime} video` : "Interactive";
      const href = safeUrl((completion.complete === completion.total && !checkpointDone ? lastModule : nextGroupModule)?.file || "index.html", { allowExternal: false });
      const status = checkpointDone ? "Checkpoint complete" : completion.complete === completion.total ? "Checkpoint ready" : `${completion.complete}/${completion.total} modules`;

      return html`
        <article class="group-card">
          <div class="module-meta">
            <span class="pill green">${group.id.toUpperCase()}</span>
            <span class="pill blue">${unitRange}</span>
            <span class="pill">${group.estimatedStudentMinutes} min</span>
          </div>
          <h3>${group.title}</h3>
          <p class="muted">${runtime} - ${checkpointLabel}</p>
          <div class="group-progress" aria-label="${status}">
            <span style="width:${completion.total > 0 ? clampPercent((completion.complete / completion.total) * 100) : 0}%"></span>
          </div>
          <a class="button ${checkpointDone ? "ghost" : "primary"}" href="${href}">${checkpointDone ? icon("check") : icon("next")} ${status}</a>
        </article>
      `;
    });

    const cards = modules.map((module) => {
      const item = progress[module.slug] || {};
      return html`
        <a class="module-card" href="${safeUrl(module.file, { allowExternal: false })}">
          <div class="module-meta">
            <span class="pill green">${String(module.id).padStart(2, "0")}</span>
            <span class="pill blue">${module.phase}</span>
            <span class="pill">${module.cost}</span>
          </div>
          <h3>${module.title}</h3>
          <p class="muted">${module.objective}</p>
          <span class="status">${item.complete ? "Complete" : item.started ? "In progress" : "Not started"}</span>
        </a>
      `;
    });

    const nextModuleTitle = nextModule ? nextModule.title : "No modules configured";
    const nextModuleFile = nextModule ? safeUrl(nextModule.file, { allowExternal: false }) : "#";

    mount(app, shell(html`
      <section class="hero">
        <div class="hero-inner">
          <p class="eyebrow">Hazard perception only</p>
          <h1>Before anything bad happens, where could trouble come from?</h1>
          <p class="hero-copy">A step-by-step training path that builds from spotting hidden risks to scanning real roads, predicting what other road users will do, and timed hazard practice.</p>
          <div class="hero-grid">
            <div class="stat"><strong>${done}/${modules.length}</strong><span>modules complete</span></div>
            <div class="stat"><strong>${progressPercent}%</strong><span>logged progress</span></div>
            <div class="stat"><strong>${completedGroups}/${groups.length}</strong><span>groups complete</span></div>
            <div class="stat"><strong>${completedCheckpoints}/${groups.length}</strong><span>checkpoints complete</span></div>
          </div>
        </div>
      </section>
      <main class="layout">
        <section class="progress-band">
          <div>
            <strong>Next up: ${nextModuleTitle}</strong>
            <div class="progress-meter" role="progressbar" aria-valuenow="${progressPercent}" aria-valuemin="0" aria-valuemax="100" aria-label="${progressPercent}% complete"><div class="progress-fill" style="width:${progressPercent}%"></div></div>
          </div>
          <a class="button primary" href="${nextModuleFile}">${icon("next")} Continue</a>
        </section>

        <section>
          <div class="section-head">
            <div>
              <h2>Lesson Groups</h2>
              <p class="muted">Balanced checkpoints for hidden-risk recognition, road scanning, simulator timing, and DVSA transfer.</p>
            </div>
          </div>
          <div class="group-grid">${groupCards}</div>
        </section>

        <section>
          <div class="section-head">
            <div>
              <h2>Training Sequence</h2>
              <p class="muted">Spot hidden risks, scan real roads, practice on interactive clips, then sharpen your timing on developing hazards.</p>
            </div>
          </div>
          <div class="module-grid">${cards}</div>
        </section>
      </main>
    `));
    bindImportExport();
  }

  function renderCheckpoint(group, checkpoint) {
    if (!group || !checkpoint || !Array.isArray(checkpoint.questions)) return "";

    const current = checkpointProgress(group.id);
    const answers = current.answers || {};
    const submitted = Boolean(current.submittedAt);
    const summary = submitted ? scoreCheckpoint(checkpoint, answers) : null;
    const passed = Boolean(current.complete);
    const status = passed
      ? current.selfDeclared ? "Complete by instructor review" : `Complete: ${current.score}%`
      : submitted ? `${current.score}% - review misses` : "Not submitted";

    const questions = checkpoint.questions.map((question, questionIndex) => {
      const selected = answers[question.id];
      const showFeedback = submitted && Number.isInteger(selected);
      const correct = showFeedback && selected === question.answer;
      const choices = question.choices.map((choice, choiceIndex) => {
        const inputId = `choice-${question.id}-${choiceIndex}`;
        return html`
          <label class="choice-row" for="${inputId}">
            <input
              id="${inputId}"
              type="radio"
              name="checkpoint-${group.id}-${question.id}"
              value="${choiceIndex}"
              ${selected === choiceIndex ? raw("checked") : ""}
            >
            <span>${String.fromCharCode(65 + choiceIndex)}. ${choice}</span>
          </label>
        `;
      });

      return html`
        <fieldset class="question-block">
          <legend>${questionIndex + 1}. ${question.title}</legend>
          <p>${question.prompt}</p>
          <div class="choice-list">${choices}</div>
          ${showFeedback ? html`
            <div class="answer-feedback ${correct ? "correct" : "review"}">
              <strong>${correct ? "Correct" : "Review"} - ${question.errorCategory}</strong>
              <p>${question.explanation}</p>
            </div>
          ` : ""}
        </fieldset>
      `;
    });

    return html`
      <section class="panel checkpoint-panel" aria-label="${group.title} checkpoint">
        <div class="checkpoint-head">
          <div>
            <p class="lesson-number">${group.id.toUpperCase()} Checkpoint</p>
            <h2>${group.title}</h2>
            <p class="muted">Pass target: ${checkpoint.passTarget}% - ${checkpoint.questions.length} questions</p>
          </div>
          <span class="checkpoint-status ${passed ? "complete" : ""}">${status}</span>
        </div>
        ${submitted && summary ? html`
          <div class="score-strip">
            <strong>${summary.correct}/${summary.total}</strong>
            <span>${summary.answered}/${summary.total} answered</span>
          </div>
        ` : ""}
        <form id="checkpoint-form" class="checkpoint-form">${questions}</form>
        <div class="checkpoint-actions">
          <button class="primary" type="button" id="submit-checkpoint">${icon("check")} Score checkpoint</button>
          <button type="button" id="complete-checkpoint">${icon("next")} Mark complete after review</button>
        </div>
        <p class="small muted" id="checkpoint-save-state">Saved locally in this browser.</p>
      </section>
    `;
  }

  function renderLesson(slug) {
    const module = modules.find((item) => item.slug === slug);
    if (!module) {
      renderHome();
      return;
    }

    const current = lessonProgress(module.slug);
    const currentIndex = modules.findIndex((item) => item.slug === slug);
    const prev = modules[currentIndex - 1];
    const next = modules[currentIndex + 1];
    const group = groupForModuleId(module.id);
    const groupModules = group ? modulesForGroup(group) : [];
    const isGroupFinalModule = groupModules.length > 0 && groupModules[groupModules.length - 1].id === module.id;
    const checkpoint = group ? checkpointById.get(group.id) : null;
    const checkpointPanel = isGroupFinalModule ? renderCheckpoint(group, checkpoint) : "";
    const hasEmbeddedMedia = Boolean(module.video || module.embedUrl);
    const resourceItems = (Array.isArray(module.resources) ? module.resources : []).map(([label, url]) => html`
      <li><a href="${safeUrl(url, { allowRelative: false })}" target="_blank" rel="noreferrer"><span>${label}</span>${icon("link")}</a></li>
    `);
    const doItems = (Array.isArray(module.do) ? module.do : []).map((item) => html`<li>${item}</li>`);
    const drillItems = (Array.isArray(module.drill) ? module.drill : []).map((item) => html`<li>${item}</li>`);
    const promptItems = (Array.isArray(module.logPrompts) ? module.logPrompts : []).map((item) => html`<li>${item}</li>`);
    const preWatch = module.preWatch ? html`
      <div class="panel intro-panel">
        <h2>Before You Start</h2>
        <p>${module.preWatch}</p>
      </div>
    ` : "";
    const videoEmbed = safeYoutubeEmbed(module.video);
    const companionVideo = module.companionVideo && typeof module.companionVideo === "object" ? module.companionVideo : null;
    const companionEmbed = safeYoutubeEmbed(companionVideo?.id);
    const embedUrl = safeUrl(module.embedUrl, {
      allowRelative: false,
      allowedOrigins: EMBED_ORIGINS
    });
    const media = videoEmbed ? html`
      <div class="media-box">
        <iframe title="${module.title} video" src="${videoEmbed}" allowfullscreen></iframe>
      </div>
    ` : embedUrl !== "#" ? html`
      <div class="media-box media-box-tall">
        <iframe title="${module.embedTitle || module.title}" src="${embedUrl}" allowfullscreen></iframe>
      </div>
    ` : "";
    const companionMedia = companionEmbed ? html`
      <section class="companion-video" aria-label="${companionVideo.label || "Companion video"}">
        <div class="companion-copy">
          <h2>${companionVideo.label || "Companion Video"}</h2>
          ${companionVideo.note ? html`<p>${companionVideo.note}</p>` : ""}
          ${companionVideo.prompt ? html`<p><strong>Active prompt:</strong> ${companionVideo.prompt}</p>` : ""}
        </div>
        <div class="media-box">
          <iframe title="${companionVideo.title || companionVideo.label || "Companion video"}" src="${companionEmbed}" allowfullscreen></iframe>
        </div>
      </section>
    ` : "";
    const activity = !media && module.activityUrl ? html`
      <div class="panel activity-panel">
        <h2>Activity</h2>
        <p>${module.activityNote || "Open the activity in a new tab, complete the assigned run, then return here to log what happened."}</p>
        <a class="button primary" href="${safeUrl(module.activityUrl, { allowRelative: false })}" target="_blank" rel="noreferrer">${icon("next")} ${module.activityLabel || "Open activity"}</a>
      </div>
    ` : "";
    const sourcePanel = hasEmbeddedMedia ? html`
      <details class="source-details">
        <summary>Source links</summary>
        <ul class="resource-list quiet">${resourceItems}</ul>
      </details>
    ` : html`
      <div class="panel">
        <h2>Resources</h2>
        <ul class="resource-list">${resourceItems}</ul>
      </div>
    `;

    mount(app, shell(html`
      <main class="lesson-shell">
        <section class="lesson-header">
          <div class="lesson-title">
            <p class="lesson-number">Module ${String(module.id).padStart(2, "0")} / ${modules.length}</p>
            <h1>${module.title}</h1>
            <p class="muted">${module.objective}</p>
            <div class="pill-row">
              ${group ? html`<span class="pill">${group.id.toUpperCase()}: ${group.title}</span>` : ""}
              <span class="pill green">${module.phase}</span>
              <span class="pill blue">${module.cost}</span>
              <span class="pill rust">${module.time}</span>
            </div>
          </div>
          <nav class="lesson-nav" aria-label="Lesson navigation">
            ${prev ? html`<a class="button" href="${safeUrl(prev.file, { allowExternal: false })}">${icon("prev")} Previous</a>` : html`<a class="button" href="index.html">${icon("home")} Overview</a>`}
            ${next ? html`<a class="button primary" href="${safeUrl(next.file, { allowExternal: false })}">${icon("next")} Next</a>` : html`<a class="button primary" href="index.html">${icon("check")} Finish</a>`}
          </nav>
        </section>

        <section class="lesson-main">
          <div class="stack">
            ${preWatch}
            ${media}
            ${companionMedia}
            ${activity}
            <div class="panel">
              <h2>Do</h2>
              <ul class="lesson-list">${doItems}</ul>
            </div>
            <div class="panel">
              <h2>Drill</h2>
              <ul class="lesson-list">${drillItems}</ul>
            </div>
            <div class="callout">
              <strong>Pass criterion</strong>
              <p>${module.pass}</p>
            </div>
            <div class="panel">
              <h2>Log Prompts</h2>
              <ul class="lesson-list">${promptItems}</ul>
            </div>
            ${sourcePanel}
            ${checkpointPanel}
          </div>

          <aside class="panel log-panel" aria-label="Progress log">
            <h2>Progress Log</h2>
            <label class="check-row">
              <input id="started" type="checkbox" ${current.started ? raw("checked") : ""}>
              <span>Started</span>
            </label>
            <label class="check-row">
              <input id="complete" type="checkbox" ${current.complete ? raw("checked") : ""}>
              <span>Pass criterion met</span>
            </label>
            <div class="field">
              <label for="date">Session date</label>
              <input id="date" type="date" value="${current.date || ""}">
            </div>
            <div class="field">
              <label for="rating">Confidence</label>
              <select id="rating">
                ${["", "Needs more coaching", "Emerging", "Solid with prompts", "Independent"].map((value) => html`
                  <option value="${value}" ${current.rating === value ? raw("selected") : ""}>${value || "Select"}</option>
                `)}
              </select>
            </div>
            <div class="field">
              <label for="notes">Notes</label>
              <textarea id="notes" placeholder="Specific hidden actor, cue, error type, or next drill...">${current.notes || ""}</textarea>
            </div>
            <p class="small muted" id="save-state">Saved locally in this browser.</p>
          </aside>
        </section>
      </main>
    `));

    bindImportExport();
    bindLessonLog(module.slug);
    if (isGroupFinalModule && checkpoint) {
      bindCheckpoint(group.id);
    }
  }

  function bindLessonLog(slug) {
    const fields = ["started", "complete", "date", "rating", "notes"];
    const debounce = (fn, delay) => {
      let timeout;
      return () => {
        window.clearTimeout(timeout);
        timeout = window.setTimeout(fn, delay);
      };
    };

    const save = () => {
      const startedEl = document.getElementById("started");
      const completeEl = document.getElementById("complete");
      const dateEl = document.getElementById("date");
      const ratingEl = document.getElementById("rating");
      const notesEl = document.getElementById("notes");

      updateLesson(slug, {
        started: startedEl ? startedEl.checked : false,
        complete: completeEl ? completeEl.checked : false,
        date: dateEl ? dateEl.value : "",
        rating: ratingEl ? ratingEl.value : "",
        notes: notesEl ? notesEl.value : ""
      });
      const state = document.getElementById("save-state");
      if (state) state.textContent = "Saved " + new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) + ".";
    };
    const debouncedSave = debounce(save, 250);

    fields.forEach((id) => {
      const field = document.getElementById(id);
      if (!field) return;

      if (field.type === "checkbox" || field.tagName === "SELECT") {
        field.addEventListener("change", save);
      } else {
        field.addEventListener("input", debouncedSave);
        field.addEventListener("change", save);
      }
    });

    // Automatically mark the lesson as started once the learner has stayed on
    // the page past the dwell threshold. A manual toggle of the checkbox
    // cancels the timer so the auto-mark never overrides an explicit choice.
    const startedEl = document.getElementById("started");
    if (startedEl && !lessonProgress(slug).started) {
      const dwellTimer = window.setTimeout(() => {
        if (startedEl.checked) return;
        const dateEl = document.getElementById("date");
        if (dateEl && !dateEl.value) {
          dateEl.value = todayLocalDate();
        }
        startedEl.checked = true;
        save();
        const state = document.getElementById("save-state");
        if (state) state.textContent = "Marked as started automatically.";
      }, STARTED_DWELL_MS);
      startedEl.addEventListener("change", () => window.clearTimeout(dwellTimer));
    }
  }

  function bindCheckpoint(groupId) {
    const checkpoint = checkpointById.get(groupId);
    if (!checkpoint || !Array.isArray(checkpoint.questions)) return;

    const collectAnswers = () => checkpoint.questions.reduce((answers, question) => {
      question.choices.forEach((_, choiceIndex) => {
        const input = document.getElementById(`choice-${question.id}-${choiceIndex}`);
        if (input?.checked) {
          answers[question.id] = choiceIndex;
        }
      });
      return answers;
    }, {});

    const saveAnswers = () => {
      updateCheckpoint(groupId, {
        started: true,
        answers: collectAnswers()
      });
      const state = document.getElementById("checkpoint-save-state");
      if (state) state.textContent = "Saved checkpoint answers.";
    };

    checkpoint.questions.forEach((question) => {
      question.choices.forEach((_, choiceIndex) => {
        document.getElementById(`choice-${question.id}-${choiceIndex}`)?.addEventListener("change", saveAnswers);
      });
    });

    document.getElementById("submit-checkpoint")?.addEventListener("click", () => {
      const answers = collectAnswers();
      const summary = scoreCheckpoint(checkpoint, answers);
      if (summary.answered < summary.total) {
        updateCheckpoint(groupId, {
          started: true,
          answers,
          complete: false,
          selfDeclared: false
        });
        const state = document.getElementById("checkpoint-save-state");
        if (state) state.textContent = `Answer all ${summary.total} questions before scoring.`;
        return;
      }

      updateCheckpoint(groupId, {
        started: true,
        answers,
        complete: summary.score >= checkpoint.passTarget,
        selfDeclared: false,
        score: summary.score,
        correct: summary.correct,
        submittedAt: new Date().toISOString()
      });
      renderLesson(pageSlug);
    });

    document.getElementById("complete-checkpoint")?.addEventListener("click", () => {
      const answers = collectAnswers();
      const summary = scoreCheckpoint(checkpoint, answers);
      updateCheckpoint(groupId, {
        started: true,
        answers,
        complete: true,
        selfDeclared: true,
        score: summary.score,
        correct: summary.correct,
        submittedAt: new Date().toISOString()
      });
      renderLesson(pageSlug);
    });
  }

  if (pageSlug) {
    renderLesson(pageSlug);
  } else {
    renderHome();
  }
})();
