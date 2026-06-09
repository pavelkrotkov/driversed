(function () {
  const storageKey = "hpt-progress-v1";
  const data = window.HPT_CURRICULUM;
  const app = document.getElementById("app");

  const pageSlug = window.LESSON_SLUG || null;

  function loadProgress() {
    try {
      return JSON.parse(localStorage.getItem(storageKey)) || {};
    } catch (error) {
      return {};
    }
  }

  function saveProgress(progress) {
    localStorage.setItem(storageKey, JSON.stringify(progress));
  }

  function lessonProgress(slug) {
    const progress = loadProgress();
    return progress[slug] || {};
  }

  function updateLesson(slug, patch) {
    const progress = loadProgress();
    progress[slug] = Object.assign({}, progress[slug] || {}, patch, {
      updatedAt: new Date().toISOString()
    });
    saveProgress(progress);
  }

  function completedCount() {
    const progress = loadProgress();
    return data.modules.filter((module) => progress[module.slug]?.complete).length;
  }

  function percentComplete() {
    return Math.round((completedCount() / data.modules.length) * 100);
  }

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
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
    return `<svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths[name] || ""}</svg>`;
  }

  function shell(content) {
    return `
      <div class="site-shell">
        <header class="topbar">
          <a class="brand" href="index.html">
            <span class="brand-mark">${icon("check")}</span>
            <span>${escapeHtml(data.title)}</span>
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
      const text = await file.text();
      const parsed = JSON.parse(text);
      saveProgress(parsed.progress || parsed);
      window.location.reload();
    });
  }

  function renderHome() {
    const done = completedCount();
    const percent = percentComplete();
    const progress = loadProgress();
    const nextModule = data.modules.find((module) => !progress[module.slug]?.complete) || data.modules[data.modules.length - 1];

    const cards = data.modules.map((module) => {
      const item = progress[module.slug] || {};
      return `
        <a class="module-card" href="${module.file}">
          <div class="module-meta">
            <span class="pill green">${String(module.id).padStart(2, "0")}</span>
            <span class="pill blue">${escapeHtml(module.phase)}</span>
            <span class="pill">${escapeHtml(module.cost)}</span>
          </div>
          <h3>${escapeHtml(module.title)}</h3>
          <p class="muted">${escapeHtml(module.objective)}</p>
          <span class="status">${item.complete ? "Complete" : item.started ? "In progress" : "Not started"}</span>
        </a>
      `;
    }).join("");

    const sourceLinks = data.sources.map((source) => `
      <li><a href="${source.url}" target="_blank" rel="noreferrer">${escapeHtml(source.label)}</a>: ${escapeHtml(source.note)}</li>
    `).join("");

    const critique = data.critique.map((item) => `<li>${escapeHtml(item)}</li>`).join("");

    app.innerHTML = shell(`
      <section class="hero">
        <div class="hero-inner">
          <p class="eyebrow">Hazard perception only</p>
          <h1>Before anything bad happens, where could trouble come from?</h1>
          <p class="hero-copy">A 22-step training path that builds from hidden-risk anticipation to real-road scanning, behavior prediction, highway space management, and DVSA-style timed practice.</p>
          <div class="hero-grid">
            <div class="stat"><strong>${done}/${data.modules.length}</strong><span>modules complete</span></div>
            <div class="stat"><strong>${percent}%</strong><span>logged progress</span></div>
            <div class="stat"><strong>${data.sources.length}</strong><span>source groups reviewed</span></div>
            <div class="stat"><strong>0</strong><span>generic driver-ed pages</span></div>
          </div>
        </div>
      </section>
      <main class="layout">
        <section class="progress-band">
          <div>
            <strong>Next up: ${escapeHtml(nextModule.title)}</strong>
            <div class="progress-meter" aria-label="${percent}% complete"><div class="progress-fill" style="width:${percent}%"></div></div>
          </div>
          <a class="button primary" href="${nextModule.file}">${icon("next")} Continue</a>
        </section>

        <section class="insight-grid">
          <div class="panel">
            <h2>Curriculum Verdict</h2>
            <ul>${critique}</ul>
          </div>
          <div class="panel">
            <h2>Research Notes</h2>
            <p>Drivers Ed Direct videos are used where the student needs a watchable U.S. road demonstration. Driving-Tests.org simulators add interactive U.S.-oriented hazard practice, although they cannot be embedded here. The paid DVSA bank cannot be audited clip-by-clip before purchase, so those lessons are organized around the official product's advertised breadth: interactive videos, varied conditions, mock tests, and readiness measurement.</p>
          </div>
        </section>

        <section>
          <div class="section-head">
            <div>
              <h2>Training Sequence</h2>
              <p class="muted">Risk-ATTEND for hidden-risk anticipation -> Drivers Ed Direct for student-facing U.S. road demos -> Driving-Tests.org simulators for interactive U.S. practice -> DVSA for developing-hazard timing and repeated timed practice.</p>
            </div>
          </div>
          <div class="module-grid">${cards}</div>
        </section>

        <section class="panel">
          <h2>Sources Mapped</h2>
          <ul>${sourceLinks}</ul>
        </section>
      </main>
    `);
    bindImportExport();
  }

  function renderLesson(slug) {
    const module = data.modules.find((item) => item.slug === slug);
    if (!module) {
      renderHome();
      return;
    }

    const current = lessonProgress(module.slug);
    const prev = data.modules[module.id - 2];
    const next = data.modules[module.id];
    const hasEmbeddedMedia = Boolean(module.video || module.embedUrl);
    const resourceItems = module.resources.map(([label, url]) => `
      <li><a href="${url}" target="_blank" rel="noreferrer"><span>${escapeHtml(label)}</span>${icon("link")}</a></li>
    `).join("");
    const doItems = module.do.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
    const drillItems = module.drill.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
    const promptItems = module.logPrompts.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
    const preWatch = module.preWatch ? `
      <div class="panel intro-panel">
        <h2>Before You Start</h2>
        <p>${escapeHtml(module.preWatch)}</p>
      </div>
    ` : "";
    const media = module.video ? `
      <div class="media-box">
        <iframe title="${escapeHtml(module.title)} video" src="https://www.youtube-nocookie.com/embed/${module.video}" allowfullscreen></iframe>
      </div>
    ` : module.embedUrl ? `
      <div class="media-box media-box-tall">
        <iframe title="${escapeHtml(module.embedTitle || module.title)}" src="${module.embedUrl}" allowfullscreen></iframe>
      </div>
    ` : "";
    const activity = !media && module.activityUrl ? `
      <div class="panel activity-panel">
        <h2>Activity</h2>
        <p>${escapeHtml(module.activityNote || "Open the activity in a new tab, complete the assigned run, then return here to log what happened.")}</p>
        <a class="button primary" href="${module.activityUrl}" target="_blank" rel="noreferrer">${icon("next")} ${escapeHtml(module.activityLabel || "Open activity")}</a>
      </div>
    ` : "";
    const sourcePanel = hasEmbeddedMedia ? `
      <details class="source-details">
        <summary>Source links</summary>
        <ul class="resource-list quiet">${resourceItems}</ul>
      </details>
    ` : `
      <div class="panel">
        <h2>Resources</h2>
        <ul class="resource-list">${resourceItems}</ul>
      </div>
    `;

    app.innerHTML = shell(`
      <main class="lesson-shell">
        <section class="lesson-header">
          <div class="lesson-title">
            <p class="lesson-number">Module ${String(module.id).padStart(2, "0")} / ${data.modules.length}</p>
            <h1>${escapeHtml(module.title)}</h1>
            <p class="muted">${escapeHtml(module.objective)}</p>
            <div class="pill-row">
              <span class="pill green">${escapeHtml(module.phase)}</span>
              <span class="pill blue">${escapeHtml(module.cost)}</span>
              <span class="pill rust">${escapeHtml(module.time)}</span>
            </div>
          </div>
          <nav class="lesson-nav" aria-label="Lesson navigation">
            ${prev ? `<a class="button" href="${prev.file}">${icon("prev")} Previous</a>` : `<a class="button" href="index.html">${icon("home")} Overview</a>`}
            ${next ? `<a class="button primary" href="${next.file}">${icon("next")} Next</a>` : `<a class="button primary" href="index.html">${icon("check")} Finish</a>`}
          </nav>
        </section>

        <section class="lesson-main">
          <div class="stack">
            ${preWatch}
            ${media}
            ${activity}
            <div class="panel">
              <h2>Why This Goes Here</h2>
              <p>${escapeHtml(module.sourceFit)}</p>
            </div>
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
              <p>${escapeHtml(module.pass)}</p>
            </div>
            <div class="panel">
              <h2>Log Prompts</h2>
              <ul class="lesson-list">${promptItems}</ul>
            </div>
            ${sourcePanel}
          </div>

          <aside class="panel log-panel" aria-label="Progress log">
            <h2>Progress Log</h2>
            <label class="check-row">
              <input id="started" type="checkbox" ${current.started ? "checked" : ""}>
              <span>Started</span>
            </label>
            <label class="check-row">
              <input id="complete" type="checkbox" ${current.complete ? "checked" : ""}>
              <span>Pass criterion met</span>
            </label>
            <div class="field">
              <label for="date">Session date</label>
              <input id="date" type="date" value="${escapeHtml(current.date || "")}">
            </div>
            <div class="field">
              <label for="rating">Confidence</label>
              <select id="rating">
                ${["", "Needs more coaching", "Emerging", "Solid with prompts", "Independent"].map((value) => `
                  <option value="${escapeHtml(value)}" ${current.rating === value ? "selected" : ""}>${value || "Select"}</option>
                `).join("")}
              </select>
            </div>
            <div class="field">
              <label for="notes">Notes</label>
              <textarea id="notes" placeholder="Specific hidden actor, cue, error type, or next drill...">${escapeHtml(current.notes || "")}</textarea>
            </div>
            <p class="small muted" id="save-state">Saved locally in this browser.</p>
          </aside>
        </section>
      </main>
    `);

    bindImportExport();
    bindLessonLog(module.slug);
  }

  function bindLessonLog(slug) {
    const fields = ["started", "complete", "date", "rating", "notes"];
    const save = () => {
      updateLesson(slug, {
        started: document.getElementById("started").checked,
        complete: document.getElementById("complete").checked,
        date: document.getElementById("date").value,
        rating: document.getElementById("rating").value,
        notes: document.getElementById("notes").value
      });
      const state = document.getElementById("save-state");
      if (state) state.textContent = "Saved " + new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) + ".";
    };

    fields.forEach((id) => {
      const field = document.getElementById(id);
      field?.addEventListener("input", save);
      field?.addEventListener("change", save);
    });
  }

  if (pageSlug) {
    renderLesson(pageSlug);
  } else {
    renderHome();
  }
})();
