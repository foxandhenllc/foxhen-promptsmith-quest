import { DragEvent, useMemo, useState } from "react";
import "./styles.css";
import {
  addBlockToBuild,
  advanceLevel,
  blocks,
  createQuestState,
  exportPromptHandoff,
  levels,
  moveBlockInBuild,
  removeBlockFromBuild,
  scoreQuest,
  type QuestState,
} from "./gameLogic";

const bestScoreKey = "promptsmith-quest.bestScore";

function loadBestScore() {
  const rawValue = window.localStorage.getItem(bestScoreKey);
  return rawValue ? Number.parseInt(rawValue, 10) || 0 : 0;
}

function App() {
  const [state, setState] = useState<QuestState>(() => createQuestState(typeof window === "undefined" ? 0 : loadBestScore()));
  const result = useMemo(() => scoreQuest(state), [state]);
  const level = levels[state.levelIndex];
  const prompt = result.selectedBlocks.map((block) => `[${block.category}] ${block.text}`).join("\n\n");
  const handoff = useMemo(() => exportPromptHandoff(state), [state]);

  function updateState(nextState: QuestState) {
    const nextResult = scoreQuest(nextState);
    const withBest = { ...nextState, bestScore: Math.max(nextState.bestScore, nextResult.score) };
    window.localStorage.setItem(bestScoreKey, String(withBest.bestScore));
    setState(withBest);
  }

  function addBlock(id: string) {
    updateState(addBlockToBuild(state, id));
  }

  function removeBlock(id: string) {
    updateState(removeBlockFromBuild(state, id));
  }

  function dropBlock(event: DragEvent<HTMLElement>, targetIndex?: number) {
    event.preventDefault();
    const blockId = event.dataTransfer.getData("text/plain");
    if (!blockId) return;
    if (state.selected.includes(blockId)) updateState(moveBlockInBuild(state, blockId, targetIndex ?? state.selected.length));
    else updateState(addBlockToBuild(state, blockId));
  }

  function dragBlock(event: DragEvent<HTMLElement>, blockId: string) {
    event.dataTransfer.setData("text/plain", blockId);
    event.dataTransfer.effectAllowed = "move";
  }

  function resetForge() {
    updateState({ ...state, selected: [], feedback: [`Reset ${level.title}.`] });
  }

  function nextLevel() {
    updateState(advanceLevel(state));
  }

  async function copyHandoff() {
    try {
      await navigator.clipboard?.writeText(exportPromptHandoff(state));
      setState({ ...state, feedback: ["Prompt handoff copied to clipboard.", ...state.feedback].slice(0, 4) });
    } catch {
      setState({ ...state, feedback: ["Clipboard permission denied. Use Export .txt instead.", ...state.feedback].slice(0, 4) });
    }
  }

  function downloadHandoff() {
    const blob = new Blob([exportPromptHandoff(state)], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "promptsmith-quest-handoff.txt";
    link.click();
    URL.revokeObjectURL(url);
  }

  window.render_game_to_text = () => JSON.stringify({
    mode: result.passed ? "passed" : "building",
    level,
    score: result.score,
    bestScore: state.bestScore,
    selected: state.selected,
    requiredMet: result.requiredMet,
    missing: result.missing,
    bannedHits: result.bannedHits.map((block) => block.id),
    prompt,
    feedback: result.feedback,
  });
  window.advanceTime = () => undefined;
  return (
    <div className="game-shell">
      <header className="site-header">
        <a className="brand" href="https://foxandhenllc.com"><span className="brand-mark">F&amp;H</span><span><strong>Fox &amp; Hen</strong><small>Promptsmith Quest</small></span></a>
        <nav><a href="#forge">Forge</a><a className="nav-button" href="https://github.com/foxandhenllc/foxhen-promptsmith-quest">Repository</a></nav>
      </header>
      <main>
        <aside className="game-info">
          <p>Playable prompt puzzle</p>
          <h1>Forge a prompt that passes every gate.</h1>
          <p className="lede">Drag prompt blocks into a staged forge, satisfy each level’s constraints, and export a clean prompt handoff without calling any model.</p>
          <div className="controls">
            <span>{level.title}</span>
            <span>{level.twist}</span>
            <span>Required: {level.required.join(", ")}</span>
            {level.banned.length > 0 && <span>Locked: {level.banned.join(", ")}</span>}
          </div>
          <div className="action-row">
            <button onClick={resetForge}>Reset forge</button>
            <button onClick={nextLevel} disabled={!result.passed}>{result.passed ? "Advance level" : "Pass challenge first"}</button>
            <button onClick={copyHandoff}>Copy handoff</button>
            <button onClick={downloadHandoff}>Export .txt</button>
          </div>
          <div className="stat-grid">
            <article><span>Score</span><strong>{result.score}</strong><small>best {state.bestScore}</small></article>
            <article><span>Level</span><strong>{state.levelIndex + 1}/3</strong><small>{level.minScore}+ to pass</small></article>
            <article><span>Blocks</span><strong>{state.selected.length}/{level.maxBlocks}</strong><small>selected slots</small></article>
            <article><span>Status</span><strong>{result.passed ? "Passed" : "Forge"}</strong><small>{result.missing.length ? `Missing ${result.missing.join(", ")}` : "All gates covered"}</small></article>
          </div>
          <div className="feedback-list">
            {result.feedback.map((item) => <p key={item}>{item}</p>)}
          </div>
        </aside>
        <section id="forge" className="game-card prompt-board">
          <div className="block-bank">
            <h2>Prompt blocks</h2>
            <p>{level.brief}</p>
            <div className="block-grid">
              {blocks.map((block) => {
                const locked = level.banned.includes(block.category);
                const used = state.selected.includes(block.id);
                return <button key={block.id} draggable={!locked} onDragStart={(event) => dragBlock(event, block.id)} className={used ? "prompt-block used" : locked ? "prompt-block locked" : "prompt-block"} onClick={() => addBlock(block.id)} disabled={locked || used}><strong>{block.title}</strong><small>{block.category} · {block.points} pts</small><small>{block.text}</small></button>;
              })}
            </div>
          </div>
          <div className="prompt-forge" onDragOver={(event) => event.preventDefault()} onDrop={(event) => dropBlock(event)}>
            <h2>Forged prompt</h2>
            <div className="gate-list">
              {level.required.map((gate) => <div key={gate} className={result.requiredMet.includes(gate) ? "gate ok" : "gate"}><span>{gate}</span><strong>{result.requiredMet.includes(gate) ? "passed" : "missing"}</strong></div>)}
            </div>
            <div className="forge-slots">
              {Array.from({ length: level.maxBlocks }).map((_, index) => {
                const block = result.selectedBlocks[index];
                return <div key={index} className={block ? "prompt-slot filled" : "prompt-slot"} onDragOver={(event) => event.preventDefault()} onDrop={(event) => dropBlock(event, index)}>
                  {block ? <><strong draggable onDragStart={(event) => dragBlock(event, block.id)}>{index + 1}. {block.title}</strong><small>{block.category} · {block.points} pts</small><button onClick={() => removeBlock(block.id)}>Remove</button></> : <span>Drop block {index + 1}</span>}
                </div>;
              })}
            </div>
            <textarea className="prompt-output" value={prompt || "Selected prompt blocks will assemble here."} readOnly />
            <details className="handoff-preview"><summary>Export preview</summary><pre>{handoff}</pre></details>
          </div>
        </section>
      </main>
    </div>
  );
}

declare global { interface Window { render_game_to_text?: () => string; advanceTime?: (ms: number) => void; } }
export default App;
