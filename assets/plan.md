# Curriculum Grouping and MCQ Implementation Plan

This file is for the implementor agent that picks up the curriculum grouping and quiz integration work.

## Goal

Group the current 32 units into fewer higher-level lessons that better spread student effort, then attach a short scenario-based MCQ checkpoint to the end of each group.

The MCQs are already drafted as markdown banks in `assets/mcq-g*.md`. They should be treated as content assets first, not as final UI copy.

## Source Assets

- `curriculum.js` is the source of truth for the current 32 units, their order, titles, phases, times, activity URLs, videos, and instructions.
- `assets/driversed.md` contains video transcripts with timings for embedded video lessons.
- `assets/generate_driversed_md.py` regenerates `assets/driversed.md` and should preserve all 20 transcript sections.
- `assets/mcq-g01-hidden-risk-baseline.md` through `assets/mcq-g10-dvsa-conditions-mock-checkpoint.md` contain the proposed group-end question banks.

## Grouping Logic

The grouping is based on effort balance and skill progression, not just the current phase labels.

The sequence should move from:

1. Baseline hidden-risk recognition.
2. Residential sightlines, space, and curves.
3. Intersection scanning.
4. Conflict checks around the vehicle.
5. Lane-change execution.
6. High-speed, large-vehicle, and low-visibility driving.
7. Timed simulator practice.
8. DVSA format transfer and first scored calibration.
9. DVSA focused occlusion and intention practice.
10. DVSA adverse conditions and mock-test consistency.

This keeps long units from being buried inside already-heavy groups. In particular, the left lane change video is long enough to stand as its own checkpoint group.

## Proposed Groups

| Group | Lesson name | Current units | MCQ asset |
|---|---|---:|---|
| G1 | Hidden-Risk Baseline | 1-2 | `assets/mcq-g01-hidden-risk-baseline.md` |
| G2 | Residential Sightlines and Space | 3-6 | `assets/mcq-g02-residential-sightlines-and-space.md` |
| G3 | Intersection Scanning Ladder | 7-9 | `assets/mcq-g03-intersection-scanning-ladder.md` |
| G4 | Conflict Checks Around the Car | 10-13 | `assets/mcq-g04-conflict-checks-around-the-car.md` |
| G5 | Lane Change Deep Dive | 14 | `assets/mcq-g05-lane-change-deep-dive.md` |
| G6 | High-Speed, Large-Vehicle, Low-Visibility Driving | 15-18 | `assets/mcq-g06-high-speed-large-vehicle-low-visibility.md` |
| G7 | U.S. Simulator Set | 19-25 | `assets/mcq-g07-us-simulator-set.md` |
| G8 | DVSA Format Transfer + First Paid Calibration | 26-28 | `assets/mcq-g08-dvsa-format-transfer-first-paid-calibration.md` |
| G9 | DVSA Focused Practice: Occlusion + Intention | 29-30 | `assets/mcq-g09-dvsa-occlusion-intention.md` |
| G10 | DVSA Conditions + Mock Checkpoint | 31-32 | `assets/mcq-g10-dvsa-conditions-mock-checkpoint.md` |

## Estimated Effort

Use these as planning values when displaying group totals or deciding how to split sessions. They are intentionally point estimates, not promises.

| Group | Known raw clip/runtime sum | Student effort |
|---|---:|---:|
| G1 | n/a | 75 min |
| G2 | 32:00 | 70 min |
| G3 | 31:50 | 55 min |
| G4 | 33:06 | 55 min |
| G5 | 45:06 | 55 min |
| G6 | 47:20 | 75 min |
| G7 | 15:39 | 70 min |
| G8 | 1:25 known | 70 min |
| G9 | n/a | 70 min |
| G10 | n/a | 65 min |

Known raw runtime only includes available video and simulator clip lengths. Student effort includes watching, pausing, replaying, reviewing misses, and logging.

## MCQ Design Rules

The MCQs should remain scenario-based. Do not convert them into transcript-recall trivia.

Good questions ask the learner to identify:

- The hidden space.
- The likely hidden actor.
- The first gentle action.
- When a potential hazard becomes developing.
- Which scan zone is missing.
- Whether the miss was timing, occlusion, intention, over-focus, or space management.

Bad questions ask for:

- Narrator names.
- Exact wording from a video.
- Source/channel trivia.
- Memorized timestamps.

Each question currently includes:

- Four options, A-D.
- One answer.
- Explanation.
- Error category.
- Answer key.

## Suggested Implementation

Prefer a structured representation for the groups and MCQs rather than parsing markdown at runtime.

Recommended steps:

1. Add a `groups` array to `curriculum.js` or a separate `curriculum-groups.js` file.
2. Each group should define:
   - `id`: `g01`, `g02`, etc.
   - `title`
   - `unitIds`
   - `estimatedStudentMinutes`
   - `knownRuntime`
   - `mcqAsset`
3. Keep current module IDs stable unless the UI is intentionally being redesigned around grouped lessons.
4. Add a grouped overview UI that shows:
   - Group title.
   - Included unit range.
   - Estimated student effort.
   - Completion state derived from child units.
   - Checkpoint status.
5. Add a checkpoint view at the end of each group.
6. Store MCQ attempt state in `localStorage`, parallel to existing lesson progress.
7. Mark a checkpoint complete when the learner meets the pass target or explicitly self-declares completion, depending on the existing site pattern.

## Data Shape Suggestion

Use a data shape close to this:

```js
{
  id: "g02",
  title: "Residential Sightlines and Space",
  unitIds: [3, 4, 5, 6],
  estimatedStudentMinutes: 70,
  knownRuntime: "32:00",
  mcqAsset: "assets/mcq-g02-residential-sightlines-and-space.md"
}
```

For MCQs, prefer converting markdown into JSON or JS objects before wiring the UI:

```js
{
  id: "g02-q01",
  prompt: "You are driving down a residential street...",
  choices: [
    "No hazard, because it is parked",
    "Potential hazard, because it could hide...",
    "Developing hazard, because every parked car...",
    "Emergency hazard, because you must stop..."
  ],
  answer: 1,
  explanation: "A parked car that blocks sightlines is a potential hazard...",
  errorCategory: "Potential-vs-developing timing"
}
```

The markdown files are fine as authoring assets. A build-time or manual conversion to JSON will make the frontend simpler and less brittle.

## Acceptance Checks

Before opening or updating an implementation PR:

1. Confirm all 32 existing modules are assigned to exactly one group.
2. Confirm each group has exactly one MCQ bank.
3. Confirm each MCQ bank has matching question count, answer count, and answer-key count.
4. Confirm generated transcript markdown still contains 20 video sections.
5. Run the existing app tests.
6. If UI changes are made, manually check the grouped overview and at least one checkpoint in a browser.

## Current Validation Commands

These commands were used while preparing the assets:

```sh
python3 assets/generate_driversed_md.py
git diff --check
python3 -m py_compile assets/generate_driversed_md.py
node - <<'NODE'
const fs = require('fs');
const files = fs.readdirSync('assets').filter(f => /^mcq-.*\.md$/.test(f)).sort();
let total = 0;
for (const file of files) {
  const text = fs.readFileSync(`assets/${file}`, 'utf8');
  const questions = (text.match(/^## Q\d+/gm) || []).length;
  const answers = (text.match(/^\*\*Answer:\*\*/gm) || []).length;
  const key = (text.match(/^\d+\. [A-D]$/gm) || []).length;
  if (questions !== answers || answers !== key) {
    throw new Error(`${file}: questions=${questions} answers=${answers} key=${key}`);
  }
  total += questions;
}
console.log(`Validated ${files.length} MCQ files with ${total} questions.`);
NODE
```
