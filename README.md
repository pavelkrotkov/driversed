# Teen Hazard Perception Lab

Static GitHub Pages site for a teen hazard-perception supplement. It is intentionally not generic driver's ed: every module trains hidden-risk anticipation, scanning, developing-hazard timing, road-user intention, conflict, and space.

## Use

Open `index.html` locally or publish the repository root with GitHub Pages.

Progress is saved in the browser with `localStorage`. The site includes export/import buttons so a parent can back up the training log as JSON.

The numbered lesson HTML files are intentionally tiny clean-URL stubs for GitHub Pages. They should stay uniform: each one only sets `window.LESSON_SLUG` and loads the shared `curriculum.js` and `app.js` renderer.

## Curriculum Spine

1. Toyota Risk-ATTEND for hidden-risk anticipation.
2. Drivers Ed Direct selected videos for U.S. student-facing road demonstrations.
3. Driving-Tests.org simulator sessions for interactive U.S.-oriented hazard practice.
4. DVSA free clips for potential-vs-developing timing.
5. Official DVSA online e-learning for repeated timed practice, focused sessions, and mock tests.

No RAPT, AAA, DriverZED, DVDs, parent-coaching lessons, or basic-driving pages are included in the student sequence.

## Source Notes

Drivers Ed Direct pages were checked for embeddable YouTube video URLs. Driving-Tests.org simulator pages were checked in-browser for standalone access status: simulator sessions 1-3 appeared public; sessions 4-7 appeared Premium-gated. The paid DVSA course cannot be audited clip-by-clip before purchase, so the paid modules are organized around the official product description: interactive videos, mock tests, progress tracking, and readiness measurement.
