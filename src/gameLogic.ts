export type Category = "Role" | "Goal" | "Context" | "Constraint" | "Format" | "Example" | "QA" | "Tone" | "Evidence";

export type Block = {
  id: string;
  category: Category;
  title: string;
  text: string;
  points: number;
};

export type Level = {
  title: string;
  brief: string;
  required: Category[];
  banned: Category[];
  maxBlocks: number;
  minScore: number;
  twist: string;
};

export type QuestState = {
  levelIndex: number;
  selected: string[];
  bestScore: number;
  feedback: string[];
};

export const blocks: Block[] = [
  { id: "role", category: "Role", title: "Senior operator", text: "Act as a pragmatic workflow consultant for a small business owner.", points: 14 },
  { id: "goal", category: "Goal", title: "Clear outcome", text: "Produce a step-by-step handoff that can be executed within 48 hours.", points: 14 },
  { id: "context", category: "Context", title: "Business context", text: "Use the supplied project notes, current tools, buyer constraints, and approval gates.", points: 13 },
  { id: "constraints", category: "Constraint", title: "Hard boundaries", text: "Do not invent facts, send messages, create accounts, or perform transactions.", points: 16 },
  { id: "format", category: "Format", title: "Output shape", text: "Return a ranked shortlist, exact next action, risk note, and reusable checklist.", points: 12 },
  { id: "examples", category: "Example", title: "Example style", text: "Prefer concise implementation-ready bullets with concrete file paths or fields where relevant.", points: 10 },
  { id: "qa", category: "QA", title: "Quality gate", text: "Before finalizing, identify missing inputs, unclear assumptions, and highest-risk failure points.", points: 17 },
  { id: "reuse", category: "Evidence", title: "Reuse signal", text: "Add a repeatable pattern note only if the workflow could become a durable service.", points: 11 },
  { id: "tone", category: "Tone", title: "Calm tone", text: "Keep the answer direct, friendly, specific, and free of hype.", points: 8 },
  { id: "audit", category: "Evidence", title: "Evidence trail", text: "List assumptions separately from facts and mark any item that needs verification.", points: 13 },
];

export const levels: Level[] = [
  {
    title: "Level 1 · Intake Scroll",
    brief: "Build a safe handoff prompt for a fictional service intake.",
    required: ["Role", "Goal", "Context", "Constraint", "Format", "QA"],
    banned: [],
    maxBlocks: 6,
    minScore: 78,
    twist: "Cover every core gate in six blocks or fewer.",
  },
  {
    title: "Level 2 · Evidence Lock",
    brief: "Upgrade the prompt so a teammate can separate facts from assumptions.",
    required: ["Goal", "Context", "Constraint", "Format", "QA", "Evidence"],
    banned: ["Example"],
    maxBlocks: 6,
    minScore: 82,
    twist: "Examples are locked; use evidence and QA instead.",
  },
  {
    title: "Level 3 · Executive Handoff",
    brief: "Create a concise high-stakes handoff with tone control and no loose edges.",
    required: ["Role", "Goal", "Constraint", "Format", "QA", "Tone", "Evidence"],
    banned: [],
    maxBlocks: 7,
    minScore: 88,
    twist: "Seven slots are available, but every selected block must support the final handoff.",
  },
];

export function createQuestState(bestScore = 0): QuestState {
  return { levelIndex: 0, selected: [], bestScore, feedback: ["Drag or add blocks into the forge to start Level 1."] };
}

export function addBlockToBuild(state: QuestState, blockId: string): QuestState {
  const level = levels[state.levelIndex];
  const block = findBlock(blockId);
  if (!block || state.selected.includes(blockId)) return state;
  if (level.banned.includes(block.category)) return { ...state, feedback: [`${block.category} is locked on this level.`, ...state.feedback].slice(0, 4) };
  if (state.selected.length >= level.maxBlocks) return { ...state, feedback: [`Level slot limit reached (${level.maxBlocks}). Remove or reorder blocks.`, ...state.feedback].slice(0, 4) };
  return { ...state, selected: [...state.selected, blockId], feedback: [`Added ${block.title}.`, ...state.feedback].slice(0, 4) };
}

export function removeBlockFromBuild(state: QuestState, blockId: string): QuestState {
  return { ...state, selected: state.selected.filter((selectedId) => selectedId !== blockId), feedback: [`Removed ${findBlock(blockId)?.title ?? blockId}.`, ...state.feedback].slice(0, 4) };
}

export function moveBlockInBuild(state: QuestState, blockId: string, targetIndex: number): QuestState {
  const currentIndex = state.selected.indexOf(blockId);
  if (currentIndex < 0) return state;
  const nextSelected = state.selected.filter((selectedId) => selectedId !== blockId);
  nextSelected.splice(Math.max(0, Math.min(nextSelected.length, targetIndex)), 0, blockId);
  return { ...state, selected: nextSelected, feedback: [`Moved ${findBlock(blockId)?.title ?? blockId}.`, ...state.feedback].slice(0, 4) };
}

export function scoreQuest(state: QuestState) {
  const level = levels[state.levelIndex];
  const selectedBlocks = state.selected.map(findBlock).filter((block): block is Block => Boolean(block));
  const categories = selectedBlocks.map((block) => block.category);
  const requiredMet = level.required.filter((category) => categories.includes(category));
  const missing = level.required.filter((category) => !categories.includes(category));
  const bannedHits = selectedBlocks.filter((block) => level.banned.includes(block.category));
  const base = selectedBlocks.reduce((sum, block) => sum + block.points, 0);
  const orderBonus = categories[0] === "Role" && categories.includes("Goal") ? 6 : 0;
  const coverageBonus = requiredMet.length * 4;
  const conciseBonus = state.selected.length <= level.maxBlocks ? 5 : -10;
  const penalty = missing.length * 12 + bannedHits.length * 20;
  const score = Math.max(0, Math.min(100, base + orderBonus + coverageBonus + conciseBonus - penalty));
  const passed = missing.length === 0 && bannedHits.length === 0 && score >= level.minScore;
  const feedback = [
    passed ? "Challenge passed. Copy the handoff or advance to the next level." : `Need ${level.minScore}+ points and all required gates.`,
    missing.length ? `Missing: ${missing.join(", ")}.` : "All required categories are covered.",
    bannedHits.length ? `Locked categories present: ${bannedHits.map((block) => block.category).join(", ")}.` : "No locked categories selected.",
    orderBonus ? "Ordering bonus earned for leading with Role and Goal." : "Tip: lead with Role and Goal for an ordering bonus.",
  ];
  return { score, passed, missing, bannedHits, requiredMet, feedback, selectedBlocks };
}

export function advanceLevel(state: QuestState): QuestState {
  const result = scoreQuest(state);
  if (!result.passed) return { ...state, feedback: result.feedback };
  const bestScore = Math.max(state.bestScore, result.score);
  if (state.levelIndex >= levels.length - 1) return { ...state, bestScore, feedback: ["Final quest cleared. Export this prompt package for reuse.", ...result.feedback].slice(0, 4) };
  const nextLevel = levels[state.levelIndex + 1];
  return {
    levelIndex: state.levelIndex + 1,
    selected: [],
    bestScore,
    feedback: [`Advanced to ${nextLevel.title}. ${nextLevel.twist}`],
  };
}

export function exportPromptHandoff(state: QuestState): string {
  const level = levels[state.levelIndex];
  const result = scoreQuest(state);
  const prompt = result.selectedBlocks.map((block) => `[${block.category}] ${block.text}`).join("\n\n");
  return [
    "Promptsmith Quest handoff",
    `Challenge: ${level.title}`,
    `Brief: ${level.brief}`,
    `Score: ${result.score}`,
    `Best score: ${Math.max(state.bestScore, result.score)}`,
    `Status: ${result.passed ? "PASSED" : "IN PROGRESS"}`,
    "Final prompt:",
    prompt || "No blocks selected yet.",
    "Scoring feedback:",
    ...result.feedback.map((item) => `- ${item}`),
  ].join("\n");
}

function findBlock(blockId: string) {
  return blocks.find((block) => block.id === blockId);
}
