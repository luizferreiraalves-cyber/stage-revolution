import React, { useState, useRef } from 'react'

// ─── CHARACTER CARD ──────────────────────────────────────────────────────────
function CharacterCard({ label, value, onChange }) {
  return (
    <div>
      <div style={styles.cardLabel}>{label}</div>
      <input
        style={styles.input}
        placeholder="Character name..."
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  )
}

// ─── SCENARIO SELECTOR ───────────────────────────────────────────────────────
function ScenarioSelector({ value, onChange }) {
  const opts = [
    { id: 'universe', emoji: '🎭', title: "Character's Universe", desc: "Stage fuses both characters' worlds" },
    { id: 'ninja',    emoji: '🥷', title: 'Classic Ninja',         desc: 'Traditional Japanese ninja stage' },
  ]
  return (
    <div style={{ display: 'flex', gap: 10 }}>
      {opts.map(o => (
        <div
          key={o.id}
          onClick={() => onChange(o.id)}
          style={{
            ...styles.scenCard,
            borderColor: value === o.id ? 'rgba(168,85,247,0.6)' : 'rgba(168,85,247,0.15)',
            background:  value === o.id ? 'rgba(168,85,247,0.1)'  : '#0a0d18',
            boxShadow:   value === o.id ? '0 0 16px rgba(168,85,247,0.2)' : 'none',
          }}
        >
          <div style={{ fontSize: 28, marginBottom: 6 }}>{o.emoji}</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: value === o.id ? '#c084fc' : '#94a3b8', marginBottom: 3 }}>{o.title}</div>
          <div style={{ fontSize: 10, color: '#475569', lineHeight: 1.4 }}>{o.desc}</div>
        </div>
      ))}
    </div>
  )
}

// ─── SAFE MODE TOGGLE ────────────────────────────────────────────────────────
function SafeModeToggle({ value, onChange }) {
  return (
    <div style={styles.safeModeBox}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 18 }}>{value ? '🛡️' : '⚡'}</span>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: value ? '#4ade80' : '#c084fc', marginBottom: 2 }}>
              {value ? 'Safe Mode ON' : 'Standard Mode'}
            </div>
            <div style={{ fontSize: 10, color: '#64748b', lineHeight: 1.5 }}>
              {value
                ? 'Uses "actor dressed as" + inspired costume — less likely to be blocked'
                : 'Uses reference photo as exact identity — more accurate but may be blocked'}
            </div>
          </div>
        </div>

        {/* Toggle switch */}
        <div
          onClick={() => onChange(!value)}
          style={{
            width: 44, height: 24, borderRadius: 12, cursor: 'pointer',
            background: value ? 'rgba(74,222,128,0.3)' : 'rgba(168,85,247,0.2)',
            border: `1px solid ${value ? 'rgba(74,222,128,0.5)' : 'rgba(168,85,247,0.3)'}`,
            position: 'relative', flexShrink: 0, transition: 'all 0.2s',
          }}
        >
          <div style={{
            width: 18, height: 18, borderRadius: '50%',
            background: value ? '#4ade80' : '#c084fc',
            position: 'absolute', top: 2,
            left: value ? 22 : 2,
            transition: 'all 0.2s',
            boxShadow: value ? '0 0 8px rgba(74,222,128,0.6)' : '0 0 8px rgba(168,85,247,0.6)',
          }} />
        </div>
      </div>

      {/* Mode details */}
      <div style={styles.safeModeDetail}>
        {value ? (
          <>
            <div style={styles.safeModeTag}>✓ "Professional stunt performer dressed as [character]"</div>
            <div style={styles.safeModeTag}>✓ Costume inspired by — not identical to — the original</div>
            <div style={styles.safeModeTag}>✓ Reference photo used for face + key visual cues only</div>
          </>
        ) : (
          <>
            <div style={{ ...styles.safeModeTag, borderColor: 'rgba(168,85,247,0.2)', color: '#94a3b8' }}>⚡ Reference photo used as exact identity match</div>
            <div style={{ ...styles.safeModeTag, borderColor: 'rgba(168,85,247,0.2)', color: '#94a3b8' }}>⚡ Full costume, face and colors replicated</div>
            <div style={{ ...styles.safeModeTag, borderColor: 'rgba(168,85,247,0.2)', color: '#94a3b8' }}>⚡ Higher fidelity — may trigger content filters</div>
          </>
        )}
      </div>
    </div>
  )
}

// ─── PROMPT BLOCK ────────────────────────────────────────────────────────────
function PromptBlock({ label, content, type }) {
  const [copied, setCopied] = useState(false)
  const isImage = type === 'image'

  const copy = () => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div style={{ ...styles.promptBlock, borderLeftColor: isImage ? '#c084fc' : '#22d3ee' }}>
      <div style={styles.promptBlockHeader}>
        <span style={{
          fontSize: 11, fontFamily: 'Orbitron, monospace', fontWeight: 700,
          color: isImage ? '#c084fc' : '#22d3ee', letterSpacing: '0.1em',
        }}>
          {isImage ? '🖼' : '🎬'} {label}
        </span>
        <button onClick={copy} style={{
          ...styles.copyBtn,
          background:  copied ? 'rgba(34,197,94,0.2)'  : 'rgba(168,85,247,0.1)',
          color:       copied ? '#4ade80'               : '#c084fc',
          borderColor: copied ? 'rgba(34,197,94,0.4)'  : 'rgba(168,85,247,0.3)',
        }}>
          {copied ? '✓ Copied' : '📋 Copy'}
        </button>
      </div>

      <div style={styles.promptText}>{content}</div>

      {isImage ? (
        <div style={styles.imageTip}>
          <span style={{ fontSize: 16 }}>💡</span>
          <span>
            Paste into <strong style={{ color: '#c084fc' }}>ChatGPT Image</strong>, then attach your two reference photos directly in the chat — one for each character.
          </span>
        </div>
      ) : (
        <div style={{ ...styles.imageTip, borderColor: 'rgba(34,211,238,0.15)', background: 'rgba(34,211,238,0.04)' }}>
          <span style={{ fontSize: 16 }}>🎬</span>
          <span>
            Use in <strong style={{ color: '#22d3ee' }}>Seedance</strong> or{' '}
            <strong style={{ color: '#22d3ee' }}>Kling</strong> with the generated image as the starting frame.
          </span>
        </div>
      )}
    </div>
  )
}

// ─── OUTPUT PARSER ───────────────────────────────────────────────────────────
function parseOutput(text) {
  const blocks = []
  const lines  = text.split('\n')
  let current  = null

  for (const line of lines) {
    const imgMatch = line.match(/##\s*🖼\s*IMAGE PROMPT[^:]*:\s*(.+)/i)
      || line.match(/##\s*🖼\s*PROMPT DE IMAGEM[^:]*:\s*(.+)/i)
      || line.match(/##\s*🖼[^:]*:\s*(.+)/i)
    const vidMatch = line.match(/##\s*🎬\s*VIDEO PROMPT[^:]*:\s*(.+)/i)
      || line.match(/##\s*🎬\s*PROMPT DE VÍDEO[^:]*:\s*(.+)/i)
      || line.match(/##\s*🎬[^:]*:\s*(.+)/i)
    const skip = line.match(/##\s*🗺/) || line.match(/##\s*💡/)

    if (skip) {
      if (current) blocks.push(current)
      current = { type: 'skip', content: '' }
    } else if (imgMatch) {
      if (current) blocks.push(current)
      current = { type: 'image', label: imgMatch[1].trim(), content: '' }
    } else if (vidMatch) {
      if (current) blocks.push(current)
      current = { type: 'video', label: vidMatch[1].trim(), content: '' }
    } else if (current) {
      current.content += line + '\n'
    }
  }
  if (current) blocks.push(current)

  // Safety net: inject camera line in frontend if backend missed it
  const cameraLine = 'POV handheld phone from the audience, slight shake, camera tracking the action from a distance — wide shot, never zooming in, stage fully visible at all times.'
  return blocks
    .filter(b => b.type !== 'skip' && b.content.trim().length > 10)
    .map(b => {
      if (b.type === 'video') {
        const trimmed = b.content.trim()
        if (!trimmed.startsWith('POV')) {
          return { ...b, content: cameraLine + ' ' + trimmed }
        }
      }
      return b
    })
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [charA,    setCharA]    = useState('')
  const [charB,    setCharB]    = useState('')
  const [scenario, setScenario] = useState('universe')
  const [safeMode, setSafeMode] = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [result,   setResult]   = useState(null)
  const [error,    setError]    = useState(null)
  const [rawText,  setRawText]  = useState('')
  const resultRef = useRef(null)

  const canGenerate = charA.trim() && charB.trim()

  const generate = async () => {
    if (!canGenerate) return
    setLoading(true)
    setResult(null)
    setError(null)
    setRawText('')

    try {
      const res = await fetch('/api/generate', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characterA: charA,
          characterB: charB,
          scenario,
          language: 'English',
          safeMode,
        }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)

      const text   = data.result
      const parsed = parseOutput(text)
      setRawText(text)
      setResult(parsed)

      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.app}>

      {/* ── HERO ── */}
      <div style={styles.hero}>
        <div style={styles.heroInner}>
          <div style={styles.heroTag}>PROMPT GENERATOR</div>
          <h1 style={styles.heroTitle}>
            Any character.<br />
            <span style={styles.heroAccent}>A viral show.</span>
          </h1>
          <p style={styles.heroDesc}>
            Type two character names, pick a scenario, and get a full prompt sequence — ready to use with your reference photos in ChatGPT Image and Seedance.
          </p>
        </div>
      </div>

      {/* ── BUILDER ── */}
      <div style={styles.builder}>

        {/* 01 CHARACTERS */}
        <section style={styles.section}>
          <div style={styles.sectionLabel}>
            <span style={{ color: '#c084fc' }}>01</span> CHARACTERS
          </div>
          <div style={styles.charGrid}>
            <CharacterCard label="Character A (left)"  value={charA} onChange={setCharA} />
            <CharacterCard label="Character B (right)" value={charB} onChange={setCharB} />
          </div>
        </section>

        {/* 02 SCENARIO */}
        <section style={styles.section}>
          <div style={styles.sectionLabel}>
            <span style={{ color: '#c084fc' }}>02</span> SCENARIO
          </div>
          <ScenarioSelector value={scenario} onChange={setScenario} />
        </section>

        {/* 03 SAFE MODE */}
        <section style={styles.section}>
          <div style={styles.sectionLabel}>
            <span style={{ color: '#c084fc' }}>03</span> FILTER MODE
          </div>
          <SafeModeToggle value={safeMode} onChange={setSafeMode} />
        </section>

        {/* REFERENCE TIP */}
        <div style={styles.refTip}>
          <div style={{ fontSize: 22 }}>📎</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#c084fc', marginBottom: 3 }}>
              How reference photos work
            </div>
            <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.6 }}>
              After generating, paste the image prompt directly into <strong style={{ color: '#c084fc' }}>ChatGPT Image</strong> and attach your two reference photos there — one per character, in order (A first, B second). The prompt already instructs the AI to use each photo as an identity reference.
            </div>
          </div>
        </div>

        {/* GENERATE BUTTON */}
        <button
          onClick={generate}
          disabled={loading || !canGenerate}
          style={{
            ...styles.generateBtn,
            opacity: loading || !canGenerate ? 0.5 : 1,
            cursor:  loading || !canGenerate ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={styles.spinner} />
              Generating prompts...
            </span>
          ) : '🎬 Generate Prompts'}
        </button>

        {!canGenerate && !loading && (
          <div style={styles.validationHint}>⚠ Both character names are required</div>
        )}

        {error && (
          <div style={styles.errorBox}>⚠️ {error}</div>
        )}

        {/* RESULTS */}
        {result && result.length > 0 && (
          <div ref={resultRef} style={styles.resultSection}>
            <div style={styles.resultHeader}>
              <div style={styles.sectionLabel}>
                <span style={{ color: '#c084fc' }}>✓</span> PROMPTS GENERATED
                {safeMode && (
                  <span style={{
                    fontSize: 9, background: 'rgba(74,222,128,0.15)',
                    border: '1px solid rgba(74,222,128,0.3)', color: '#4ade80',
                    borderRadius: 4, padding: '2px 6px', marginLeft: 6,
                  }}>🛡️ SAFE MODE</span>
                )}
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(rawText)}
                style={styles.copyAllBtn}
              >
                📋 Copy all
              </button>
            </div>

            <div style={styles.promptsGrid}>
              {result.map((block, i) => (
                <PromptBlock
                  key={i}
                  type={block.type}
                  label={block.label}
                  content={block.content.trim()}
                />
              ))}
            </div>

            {/* WORKFLOW */}
            <div style={styles.workflowBox}>
              <div style={styles.workflowTitle}>📋 WORKFLOW</div>
              <div style={styles.workflowSteps}>
                {[
                  {
                    n: '1', t: 'Copy the image prompt',
                    d: 'Paste into ChatGPT Image and attach both reference photos in the same chat message — Character A first, then B',
                  },
                  {
                    n: '2', t: 'Generate the initial image',
                    d: 'The confrontation scene with both characters positioned on stage',
                  },
                  {
                    n: '3', t: 'Use the video prompts',
                    d: 'Paste each prompt into Seedance or Kling with the generated image as the starting frame',
                  },
                  {
                    n: '4', t: 'Assemble the sequence',
                    d: '4 videos × ~8 seconds = complete viral sequence',
                  },
                ].map(s => (
                  <div key={s.n} style={styles.workflowStep}>
                    <div style={styles.workflowNum}>{s.n}</div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0' }}>{s.t}</div>
                      <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{s.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── FOOTER ── */}
      <footer style={styles.footer}>
        <span>© 2026</span>
        <span style={{ color: '#1f2937' }}>•</span>
        <span style={{
          fontFamily: 'Orbitron, monospace', fontSize: '0.6rem', fontWeight: 700,
          background: 'linear-gradient(135deg, #c084fc, #22d3ee)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>DKTUBE</span>
        <span style={{ color: '#1f2937' }}>•</span>
        <span>henweb.com.br/dktube</span>
      </footer>
    </div>
  )
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const styles = {
  app: {
    minHeight: '100vh', background: '#000', color: '#e2e8f0',
    fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column',
  },
  hero: {
    padding: '40px 24px 32px',
    background: 'linear-gradient(180deg, #060914 0%, #000 100%)',
    borderBottom: '1px solid rgba(168,85,247,0.1)',
  },
  heroInner:  { maxWidth: 680, margin: '0 auto', textAlign: 'center' },
  heroTag: {
    fontFamily: 'Orbitron, monospace', fontSize: '0.55rem',
    letterSpacing: '0.3em', color: '#64748b', marginBottom: 14,
  },
  heroTitle: {
    fontFamily: 'Orbitron, monospace', fontSize: 'clamp(24px, 5vw, 40px)',
    fontWeight: 900, lineHeight: 1.2, color: '#e2e8f0', marginBottom: 14,
  },
  heroAccent: {
    background: 'linear-gradient(135deg, #c084fc, #22d3ee)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
  },
  heroDesc: { fontSize: 14, color: '#64748b', lineHeight: 1.7, maxWidth: 480, margin: '0 auto' },
  builder: {
    maxWidth: 780, margin: '0 auto', padding: '32px 24px 60px',
    display: 'flex', flexDirection: 'column', gap: 28, width: '100%',
  },
  section:      { display: 'flex', flexDirection: 'column', gap: 12 },
  sectionLabel: {
    fontFamily: 'Orbitron, monospace', fontSize: '0.6rem', fontWeight: 700,
    letterSpacing: '0.25em', textTransform: 'uppercase', color: '#64748b',
    display: 'flex', alignItems: 'center', gap: 8,
  },
  charGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14,
  },
  cardLabel: {
    fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 6, letterSpacing: '0.05em',
  },
  input: {
    width: '100%', padding: '11px 14px', background: '#0a0d18',
    border: '1px solid rgba(168,85,247,0.25)', borderRadius: 8,
    color: '#e2e8f0', fontSize: 13, outline: 'none',
    fontFamily: 'Inter, sans-serif', transition: 'border-color 0.15s', boxSizing: 'border-box',
  },
  scenCard: {
    flex: 1, padding: '16px 14px', borderRadius: 10, border: '1px solid',
    cursor: 'pointer', textAlign: 'center', transition: 'all 0.18s',
  },
  safeModeBox: {
    padding: '16px', borderRadius: 10, background: '#0a0d18',
    border: '1px solid rgba(168,85,247,0.2)', display: 'flex', flexDirection: 'column', gap: 12,
  },
  safeModeDetail: { display: 'flex', flexDirection: 'column', gap: 5 },
  safeModeTag: {
    fontSize: 10, color: '#4ade80', padding: '4px 8px', borderRadius: 5,
    border: '1px solid rgba(74,222,128,0.2)', background: 'rgba(74,222,128,0.05)',
  },
  refTip: {
    display: 'flex', gap: 14, alignItems: 'flex-start', padding: '14px 16px',
    borderRadius: 10, background: 'rgba(168,85,247,0.05)', border: '1px solid rgba(168,85,247,0.15)',
  },
  generateBtn: {
    width: '100%', padding: '16px',
    background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    border: 'none', borderRadius: 10, color: '#fff', fontSize: 15, fontWeight: 700,
    fontFamily: 'Orbitron, monospace', letterSpacing: '0.05em',
    boxShadow: '0 0 24px rgba(168,85,247,0.4)', transition: 'all 0.2s',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  validationHint: { fontSize: 11, color: '#64748b', textAlign: 'center', marginTop: -16 },
  spinner: {
    width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)',
    borderTop: '2px solid #fff', borderRadius: '50%',
    animation: 'spin 0.8s linear infinite', display: 'inline-block',
  },
  errorBox: {
    padding: '12px 16px', borderRadius: 8,
    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
    color: '#f87171', fontSize: 12,
  },
  resultSection: { display: 'flex', flexDirection: 'column', gap: 16 },
  resultHeader:  { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  promptsGrid:   { display: 'flex', flexDirection: 'column', gap: 12 },
  promptBlock: {
    background: '#0a0d18', border: '1px solid rgba(168,85,247,0.2)',
    borderLeft: '3px solid', borderRadius: 10, padding: 16,
    display: 'flex', flexDirection: 'column', gap: 10,
  },
  promptBlockHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  promptText: {
    fontSize: 12, lineHeight: 1.8, color: '#94a3b8', whiteSpace: 'pre-wrap',
    background: '#060914', padding: '12px 14px', borderRadius: 7,
    border: '1px solid rgba(168,85,247,0.1)',
  },
  copyBtn: {
    padding: '5px 12px', borderRadius: 6, border: '1px solid',
    cursor: 'pointer', fontSize: 10, fontWeight: 600, transition: 'all 0.15s',
  },
  copyAllBtn: {
    padding: '6px 14px', borderRadius: 6, background: 'rgba(168,85,247,0.1)',
    border: '1px solid rgba(168,85,247,0.3)', color: '#c084fc',
    fontSize: 11, fontWeight: 600, cursor: 'pointer',
  },
  imageTip: {
    display: 'flex', gap: 8, alignItems: 'flex-start', padding: '8px 12px', borderRadius: 7,
    background: 'rgba(168,85,247,0.05)', border: '1px solid rgba(168,85,247,0.15)',
    fontSize: 11, color: '#64748b', lineHeight: 1.5,
  },
  workflowBox: {
    padding: '20px', borderRadius: 10, background: '#060914',
    border: '1px solid rgba(168,85,247,0.15)',
  },
  workflowTitle: {
    fontFamily: 'Orbitron, monospace', fontSize: '0.65rem', fontWeight: 700,
    letterSpacing: '0.2em', color: '#64748b', marginBottom: 16,
  },
  workflowSteps: { display: 'flex', flexDirection: 'column', gap: 12 },
  workflowStep:  { display: 'flex', gap: 12, alignItems: 'flex-start' },
  workflowNum: {
    width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
    background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 11, fontWeight: 700, color: '#fff',
  },
  footer: {
    padding: '13px 20px', borderTop: '1px solid rgba(168,85,247,0.18)',
    textAlign: 'center', fontSize: 10, color: '#374151', background: '#0a0d18',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 'auto',
  },
}

// ─── GLOBAL STYLES ───────────────────────────────────────────────────────────
const styleEl = document.createElement('style')
styleEl.textContent = `
  @keyframes spin { to { transform: rotate(360deg); } }
  html, body { scrollbar-width: none; -ms-overflow-style: none; }
  html::-webkit-scrollbar, body::-webkit-scrollbar { display: none; }
`
document.head.appendChild(styleEl)
document.documentElement.style.background = '#000'
document.body.style.background = '#000'
document.body.style.margin = '0'
document.body.style.padding = '0'
document.body.style.overflowX = 'hidden'

const root = document.getElementById('root')
if (root) {
  root.style.background = '#000'
  root.style.minHeight = '100vh'
}
