export const sample = {
  "repoName": "foxhen-promptsmith-quest",
  "title": "Promptsmith Quest",
  "subtitle": "A prompt-building puzzle",
  "serviceLine": "AI workflow game demo",
  "heroTitle": "Forge a better prompt by satisfying constraints.",
  "heroCopy": "A puzzle-like AI workflow demo where players combine role, context, constraints, examples, and QA checks to improve handoff quality.",
  "primaryAction": "Forge prompt",
  "secondaryAction": "Inspect quality",
  "repositoryUrl": "https://github.com/foxandhenllc/foxhen-promptsmith-quest",
  "liveDemoUrl": "https://foxhen-promptsmith-quest.vercel.app",
  "theme": {
    "accent": "#513177",
    "accent2": "#f4c95d",
    "ink": "#0d0718",
    "soft": "#f5eeff",
    "warm": "#fff6db",
    "surface": "#fffaf4",
    "muted": "#5c667a",
    "border": "rgba(7, 18, 31, 0.12)"
  },
  "metrics": [
    {
      "label": "Prompt quality",
      "value": "87%",
      "note": "+33 pts"
    },
    {
      "label": "Constraints met",
      "value": "9/11",
      "note": "near complete"
    },
    {
      "label": "QA gates",
      "value": "5",
      "note": "visible"
    }
  ],
  "stages": [
    {
      "label": "Role Rune",
      "detail": "Choose the operator role and expected output format.",
      "status": "ready",
      "owner": "Player",
      "index": 1
    },
    {
      "label": "Context Forge",
      "detail": "Add task context, examples, and boundaries.",
      "status": "active",
      "owner": "Player",
      "index": 2
    },
    {
      "label": "Constraint Lock",
      "detail": "Satisfy length, safety, tone, and evidence requirements.",
      "status": "waiting",
      "owner": "QA",
      "index": 3
    },
    {
      "label": "Handoff Scroll",
      "detail": "Package the prompt with tests and revision notes.",
      "status": "queued",
      "owner": "Studio",
      "index": 4
    }
  ],
  "workItems": [
    {
      "title": "Role block",
      "detail": "Clarifies the assistant's job",
      "status": "ready"
    },
    {
      "title": "Context shard",
      "detail": "Adds realistic task data",
      "status": "active"
    },
    {
      "title": "Missing test",
      "detail": "Waiting on QA gate",
      "status": "waiting"
    },
    {
      "title": "Prompt scroll",
      "detail": "Queued for export",
      "status": "queued"
    }
  ],
  "deliverables": [
    {
      "title": "Prompt builder",
      "detail": "A structured view of what makes a prompt reusable."
    },
    {
      "title": "Quality gates",
      "detail": "Checks that prevent vague or risky output."
    },
    {
      "title": "Handoff card",
      "detail": "A reusable prompt package ready for a workflow."
    }
  ],
  "timeline": [
    {
      "time": "Round 1",
      "detail": "Assemble role and task context"
    },
    {
      "time": "Round 2",
      "detail": "Add constraints and examples"
    },
    {
      "time": "Round 3",
      "detail": "Pass QA and package the prompt"
    }
  ],
  "proof": [
    "Demonstrates AI workflow craft in a more playful format.",
    "Maps directly to prompt and automation setup services.",
    "No model call or external account is required."
  ]
} as const;

export type StageStatus = "ready" | "active" | "waiting" | "queued";
export type DemoStage = (typeof sample.stages)[number];
export type WorkItem = (typeof sample.workItems)[number];
