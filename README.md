# Teen Hazard Perception Lab

A static site for practicing hazard perception: anticipating hidden risks, scanning, timing developing hazards, reading other road users, and managing space.

## Use

Open `index.html` locally or publish the repository root with GitHub Pages.

Progress is saved in the browser with `localStorage`. The site includes export/import buttons so the training log can be backed up as JSON.

A lesson is marked **Started** automatically once the learner has stayed on the page for a few seconds, and the session date is filled in at the same time if it is still empty. The **Pass criterion met** checkbox is self-declared. Either checkbox can be toggled by hand.

The numbered lesson HTML files are tiny clean-URL stubs. Each one only sets `window.LESSON_SLUG` (matching its filename) and loads the shared `curriculum.js` and `app.js` renderer, so they must stay uniform.
