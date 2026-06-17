// Ambient type declarations for the Teen Hazard Perception Lab.
//
// These are checked by `tsc --noEmit` (see jsconfig.json) but are never
// shipped to the browser — the site stays a buildless static site that loads
// plain .js files via <script> tags. Edit these shapes when the curriculum or
// MCQ data format changes so the type checker keeps app.js honest.

/** A `[label, url]` pair produced by `source()` in curriculum.js. */
type ResourceLink = [label: string, url: string];

/** An optional secondary "commentary" video shown alongside a lesson. */
interface CompanionVideo {
  id: string;
  title: string;
  label: string;
  note: string;
  prompt: string;
}

/** A single lesson unit in the curriculum. */
interface Module {
  id: number;
  slug: string;
  file: string;
  title: string;
  phase: string;
  material: string;
  cost: string;
  time: string;
  /** YouTube video id for video-based lessons. */
  video?: string;
  companionVideo?: CompanionVideo;
  activityUrl?: string;
  activityLabel?: string;
  activityNote?: string;
  /** URL embedded in an iframe (e.g. a hazard simulator). */
  embedUrl?: string;
  embedTitle?: string;
  preWatch: string;
  objective: string;
  do: string[];
  drill: string[];
  pass: string;
  logPrompts: string[];
  resources: ResourceLink[];
}

/** A group bundles several modules and points at an MCQ checkpoint asset. */
interface Group {
  id: string;
  title: string;
  unitIds: number[];
  estimatedStudentMinutes: number;
  knownRuntime: string;
  mcqAsset: string;
}

interface Curriculum {
  title: string;
  updated: string;
  groups: Group[];
  modules: Module[];
}

/** One multiple-choice question inside a checkpoint. */
interface CheckpointQuestion {
  id: string;
  title: string;
  prompt: string;
  choices: string[];
  /** Zero-based index into `choices` of the correct answer. */
  answer: number;
  explanation: string;
  errorCategory: string;
}

/** A graded MCQ checkpoint for a group (generated from assets/mcq-g*.md). */
interface Checkpoint {
  id: string;
  title: string;
  /** Passing score as a percentage, e.g. 80. */
  passTarget: number;
  source: string;
  questions: CheckpointQuestion[];
}

interface Window {
  HPT_CURRICULUM?: Curriculum;
  HPT_CHECKPOINTS?: Checkpoint[];
  LESSON_SLUG?: string | null;
  HPT_EXPOSE_TESTS?: boolean;
  /** Internal functions exposed only for the test harness. */
  // biome-ignore lint/suspicious/noExplicitAny: dynamic test-internals bag.
  HPT_TESTS?: any;
}
