import { useMemo, useState } from "react";
import "./styles.css";

type Block = { id: string; category: string; title: string; text: string; points: number };
const blocks: Block[] = [
  { id: "role", category: "Role", title: "Senior operator", text: "Act as a pragmatic workflow consultant for a small business owner.", points: 15 },
  { id: "goal", category: "Goal", title: "Clear outcome", text: "Produce a step-by-step handoff that can be executed within 48 hours.", points: 15 },
  { id: "context", category: "Context", title: "Business context", text: "Use the supplied project notes, current tools, buyer constraints, and approval gates.", points: 14 },
  { id: "constraints", category: "Constraint", title: "Hard boundaries", text: "Do not invent facts, send messages, create accounts, or perform transactions.", points: 16 },
  { id: "format", category: "Format", title: "Output shape", text: "Return a ranked shortlist, exact next action, risk note, and reusable checklist.", points: 12 },
  { id: "examples", category: "Example", title: "Example style", text: "Prefer concise implementation-ready bullets with concrete file paths or fields where relevant.", points: 10 },
  { id: "qa", category: "QA", title: "Quality gate", text: "Before finalizing, identify missing inputs, unclear assumptions, and highest-risk failure points.", points: 18 },
  { id: "reuse", category: "Reuse", title: "Pipeline note", text: "Add the reusable pattern if this succeeds once and can become a repeatable service.", points: 10 },
];
const gates = ["Role", "Goal", "Context", "Constraint", "Format", "QA"];

function App() {
  const [selected, setSelected] = useState<string[]>([]);
  const [level, setLevel] = useState(1);
  const usedBlocks = blocks.filter((block) => selected.includes(block.id));
  const score = useMemo(() => Math.min(100, usedBlocks.reduce((sum, block) => sum + block.points, 0) + (level - 1) * 4), [usedBlocks, level]);
  const passedGates = gates.filter((gate) => usedBlocks.some((block) => block.category === gate));
  const won = score >= 84 && passedGates.length === gates.length;
  const prompt = usedBlocks.map((block) => `[${block.category}] ${block.text}`).join("\n\n");
  function toggle(id: string) {
    setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length >= 6 ? current : [...current, id]);
  }
  function nextLevel() {
    if (won) {
      setLevel((current) => current + 1);
      setSelected([]);
    }
  }
  window.render_game_to_text = () => JSON.stringify({ mode: won ? "won" : "building", score, level, selected, passedGates, missingGates: gates.filter((gate) => !passedGates.includes(gate)), prompt });
  window.advanceTime = () => undefined;
  return <div className="game-shell"><header className="site-header"><a className="brand" href="https://foxandhenllc.com"><span className="brand-mark">F&amp;H</span><span><strong>Fox &amp; Hen</strong><small>Promptsmith Quest</small></span></a><nav><a href="#forge">Forge</a><a className="nav-button" href="https://github.com/foxandhenllc/foxhen-promptsmith-quest">Repository</a></nav></header><main><aside className="game-info"><p>Playable prompt puzzle</p><h1>Forge a prompt that passes every gate.</h1><p className="lede">Choose up to six blocks. The prompt wins when it covers the required categories and reaches a high enough quality score.</p><div className="controls"><span>Select up to 6 blocks</span><span>Required gates: {gates.join(", ")}</span><span>Win score: 84+</span></div><div className="action-row"><button onClick={() => setSelected([])}>Reset forge</button><button onClick={nextLevel} disabled={!won}>{won ? "Advance level" : "Pass gates first"}</button></div><div className="stat-grid"><article><span>Score</span><strong>{score}</strong><small>prompt quality</small></article><article><span>Level</span><strong>{level}</strong><small>quest round</small></article><article><span>Blocks</span><strong>{selected.length}/6</strong><small>selected</small></article><article><span>Status</span><strong>{won ? "Won" : "Forge"}</strong><small>{won ? "Prompt package passes QA." : "Missing gates remain."}</small></article></div></aside><section id="forge" className="game-card prompt-board"><div className="block-bank"><h2>Prompt blocks</h2><div className="block-grid">{blocks.map((block) => <button key={block.id} className={selected.includes(block.id) ? "prompt-block used" : "prompt-block"} onClick={() => toggle(block.id)}><strong>{block.title}</strong><small>{block.category} · {block.points} pts</small><small>{block.text}</small></button>)}</div></div><div className="prompt-forge"><h2>Forged prompt</h2><div className="gate-list">{gates.map((gate) => <div key={gate} className={passedGates.includes(gate) ? "gate ok" : "gate"}><span>{gate}</span><strong>{passedGates.includes(gate) ? "passed" : "missing"}</strong></div>)}</div><div className="prompt-slot">{won ? "Quest complete. This prompt is ready for a handoff package." : "Add required blocks until every QA gate passes."}</div><textarea className="prompt-output" value={prompt || "Selected prompt blocks will assemble here."} readOnly /></div></section></main></div>;
}

declare global { interface Window { render_game_to_text?: () => string; advanceTime?: (ms: number) => void; } }
export default App;
