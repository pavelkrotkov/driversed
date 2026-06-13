# Teen Hazard Perception Lab

Static GitHub Pages site for a teen hazard-perception supplement. It is intentionally not generic driver's ed: every module trains hidden-risk anticipation, scanning, developing-hazard timing, road-user intention, conflict, and space.

## Use

Open `index.html` locally or publish the repository root with GitHub Pages.

Progress is saved in the browser with `localStorage`. The site includes export/import buttons so a parent can back up the training log as JSON.

A lesson is marked **Started** automatically once the learner has stayed on the page for a few seconds, so attendance no longer depends on remembering to tick the box. The session date is filled in at the same time if it is still empty. The **Pass criterion met** checkbox stays self-declared, since a static page cannot verify mastery. Either checkbox can still be toggled by hand.

The numbered lesson HTML files are intentionally tiny clean-URL stubs for GitHub Pages. They should stay uniform: each one only sets `window.LESSON_SLUG` and loads the shared `curriculum.js` and `app.js` renderer.

## Curriculum Spine

1. Toyota Risk-ATTEND for hidden-risk anticipation.
2. Drivers Ed Direct selected videos for U.S. student-facing road demonstrations. The right-of-way series is now complete through Part 3, adding freeway-speed merging and limited-sightline canyon roads.
3. A large-vehicle No-Zone lesson (Smart Drive Test demo plus FMCSA's official No-Zone guidance) and a free night/adverse-conditions primer extend hazard perception to truck blind zones and low-visibility driving before the interactive practice.
4. Driving-Tests.org simulator sessions for interactive U.S.-oriented hazard practice.
5. DVSA free clips for potential-vs-developing timing, followed by an embedded official DVSA explainer of how the scored test works, placed right before the paid bank.
6. Official DVSA online e-learning for repeated timed practice, focused sessions, and mock tests.

No RAPT, AAA, DriverZED, DVDs, parent-coaching lessons, or basic-driving pages are included in the student sequence.

## Source Notes

Drivers Ed Direct pages were checked for embeddable YouTube video URLs. Driving-Tests.org simulator pages were checked in-browser for standalone access status: simulator sessions 1-3 appeared public; sessions 4-7 appeared Premium-gated. The paid DVSA course cannot be audited clip-by-clip before purchase, so the paid modules are organized around the official product description: interactive videos, mock tests, progress tracking, and readiness measurement.

Embedded YouTube clips are restricted to the source channels' own uploads, verified embeddable via the YouTube oEmbed endpoint. For DVSA material this is a hard licensing rule: only DVSA's own channel (`@dvsagovuk`) uploads are embedded — the explainer module uses the official DVSA "Hazard perception test: official DVSA guide" video. The scored CGI test clips are never embedded from third-party re-uploads; the real scored practice stays as the free Safe Driving for Life link-out and the paid bank.
