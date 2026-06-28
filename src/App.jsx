import React, { useState, useRef } from 'react'

const POPULAR = [
  { name: 'Naruto Uzumaki', universe: 'Naruto', emoji: '🥷' },
  { name: 'Goku', universe: 'Dragon Ball', emoji: '🐉' },
  { name: 'Spider-Man', universe: 'Marvel', emoji: '🕷️' },
  { name: 'Batman', universe: 'DC', emoji: '🦇' },
  { name: 'Monkey D. Luffy', universe: 'One Piece', emoji: '🏴‍☠️' },
  { name: 'Sasuke Uchiha', universe: 'Naruto', emoji: '⚡' },
  { name: 'Iron Man', universe: 'Marvel', emoji: '🤖' },
  { name: 'Gandalf', universe: 'Lord of the Rings', emoji: '🧙' },
  { name: 'Vegeta', universe: 'Dragon Ball', emoji: '👑' },
  { name: 'Black Panther', universe: 'Marvel', emoji: '🐾' },
  { name: 'Ichigo Kurosaki', universe: 'Bleach', emoji: '⚔️' },
  { name: 'Link', universe: 'Zelda', emoji: '🗡️' },
]

function CharacterCard({ label, value, onChange, hasPhoto, onPhotoChange }) {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const filtered = value.length > 0
    ? POPULAR.filter(p => p.name.toLowerCase().includes(value.toLowerCase())).slice(0, 6)
    : POPULAR.slice(0, 6)

  return (
    <div style={{ position: 'relative' }}>
      <div style={styles.cardLabel}>{label}</div>
      <div style={styles.inputWrap}>
        <input
          style={styles.input}
          placeholder="Character name..."
          value={value}
          onChange={e => { onChange(e.target.value); setShowSuggestions(true) }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
        />
      </div>
      {showSuggestions && (
        <div style={styles.suggestions}>
          {filtered.map(p => (
            <div
              key={p.name}
              style={styles.suggItem}
              onMouseDown={() => { onChange(p.name); setShowSuggestions(false) }}
            >
              <span style={{ fontSize: 18 }}>{p.emoji}</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0' }}>{p.name}</div>
                <div style={{ fontSize: 10, color: '#64748b' }}>{p.universe}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      <label style={styles.photoCheckLabel}>
        <input
          type="checkbox"
          checked={hasPhoto}
          onChange={e => onPhotoChange(e.target.checked)}
          style={styles.photoCheckInput}
        />
        <span>📷 I have a reference photo to attach</span>
      </label>
    </div>
  )
}

function ScenarioSelector({ value, onChange }) {
  const opts = [
    { id: 'universe', emoji: '🎭', title: "Character's Universe", desc: "Stage adapted to the character's world" },
    { id: 'ninja', emoji: '🥷', title: 'Classic Ninja', desc: 'Traditional Japanese ninja stage' },
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
            background: value === o.id ? 'rgba(168,85,247,0.1)' : '#0a0d18',
            boxShadow: value === o.id ? '0 0 16px rgba(168,85,247,0.2)' : 'none',
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
    <div style={{
      ...styles.promptBlock,
      borderLeftColor: isImage ? '#c084fc' : '#22d3ee',
    }}>
      <div style={styles.promptBlockHeader}>
        <span style={{
          fontSize: 11,
          fontFamily: 'Orbitron, monospace',
          fontWeight: 700,
          color: isImage ? '#c084fc' : '#22d3ee',
          letterSpacing: '0.1em',
        }}>
          {isImage ? '🖼' : '🎬'} {label}
        </span>
        <button onClick={copy} style={{
          ...styles.copyBtn,
          background: copied ? 'rgba(34,197,94,0.2)' : 'rgba(168,85,247,0.1)',
          color: copied ? '#4ade80' : '#c084fc',
          borderColor: copied ? 'rgba(34,197,94,0.4)' : 'rgba(168,85,247,0.3)',
        }}>
          {copied ? '✓ Copied' : '📋 Copy'}
        </button>
      </div>
      <div style={styles.promptText}>{content}</div>
      {isImage && (
        <div style={styles.imageTip}>
          <span style={{ fontSize: 16 }}>💡</span>
          <span>Paste this prompt into <strong style={{ color: '#c084fc' }}>ChatGPT Image</strong> or <strong style={{ color: '#22d3ee' }}>Nano Banana</strong> and attach your reference images.</span>
        </div>
      )}
      {!isImage && (
        <div style={{ ...styles.imageTip, borderColor: 'rgba(34,211,238,0.15)', background: 'rgba(34,211,238,0.04)' }}>
          <span style={{ fontSize: 16 }}>🎬</span>
          <span>Use in <strong style={{ color: '#22d3ee' }}>Seedance</strong> or <strong style={{ color: '#22d3ee' }}>Kling</strong> with the generated image as the starting frame.</span>
        </div>
      )}
    </div>
  )
}

function parseOutput(text) {
  const blocks = []
  const lines = text.split('\n')
  let current = null

  for (const line of lines) {
    const imgMatch = line.match(/##\s*🖼\s*IMAGE PROMPT[^:]*:\s*(.+)/i)
      || line.match(/##\s*🖼\s*PROMPT DE IMAGEM[^:]*:\s*(.+)/i)
      || line.match(/##\s*🖼[^:]*:\s*(.+)/i)
    const vidMatch = line.match(/##\s*🎬\s*VIDEO PROMPT[^:]*:\s*(.+)/i)
      || line.match(/##\s*🎬\s*PROMPT DE VÍDEO[^:]*:\s*(.+)/i)
      || line.match(/##\s*🎬[^:]*:\s*(.+)/i)
    const mapMatch = line.match(/##\s*🗺/)
    const howMatch = line.match(/##\s*💡/)

    if (mapMatch || howMatch) {
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

  return blocks.filter(b => b.type !== 'skip' && b.content.trim().length > 10)
}

export default function App() {
  const [charA, setCharA] = useState('')
  const [charB, setCharB] = useState('')
  const [hasPhotoA, setHasPhotoA] = useState(false)
  const [hasPhotoB, setHasPhotoB] = useState(false)
  const [scenario, setScenario] = useState('universe')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [rawText, setRawText] = useState('')
  const resultRef = useRef(null)

  const generate = async () => {
    if (!charA.trim()) return
    setLoading(true)
    setResult(null)
    setError(null)
    setRawText('')

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characterA: charA,
          characterB: charB || null,
          hasPhotoA,
          hasPhotoB,
          scenario,
          language: 'English'
        })
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)

      const text = data.result
      setRawText(text)
      const parsed = parseOutput(text)
      setResult(parsed)

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const copyAll = () => {
    navigator.clipboard.writeText(rawText)
  }

  return (
    <div style={styles.app}>

      {/* HERO */}
      <div style={styles.hero}>
        <div style={styles.heroInner}>
          <div style={styles.heroTag}>PROMPT GENERATOR</div>
          <h1 style={styles.heroTitle}>
            Any character.<br />
            <span style={styles.heroAccent}>A viral show.</span>
          </h1>
          <p style={styles.heroDesc}>
            Pick your characters, choose a scenario, and generate optimized prompts for image and video — ready for ChatGPT Image, Nano Banana and Seedance.
          </p>
        </div>
      </div>

      {/* BUILDER */}
      <div style={styles.builder}>

        {/* CHARACTERS */}
        <section style={styles.section}>
          <div style={styles.sectionLabel}>
            <span style={{ color: '#c084fc' }}>01</span> CHARACTERS
          </div>
          <div style={styles.charGrid}>
            <CharacterCard
              label="Character A (left)"
              value={charA}
              onChange={setCharA}
              hasPhoto={hasPhotoA}
              onPhotoChange={setHasPhotoA}
            />
            <CharacterCard
              label="Character B (right) — optional"
              value={charB}
              onChange={setCharB}
              hasPhoto={hasPhotoB}
              onPhotoChange={setHasPhotoB}
            />
          </div>
        </section>

        {/* SCENARIO */}
        <section style={styles.section}>
          <div style={styles.sectionLabel}>
            <span style={{ color: '#c084fc' }}>02</span> SCENARIO
          </div>
          <ScenarioSelector value={scenario} onChange={setScenario} />
        </section>

        {/* REFERENCE TIP */}
        <div style={styles.refTip}>
          <div style={{ fontSize: 22 }}>📎</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#c084fc', marginBottom: 3 }}>How to use reference images</div>
            <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.6 }}>
              Check "I have a reference photo" for each character you plan to attach later in <strong style={{ color: '#c084fc' }}>ChatGPT Image</strong> or <strong style={{ color: '#22d3ee' }}>Nano Banana</strong>. If left unchecked, the AI will write the character's full appearance directly in the prompt — no photo needed.
            </div>
          </div>
        </div>

        {/* GENERATE */}
        <button
          onClick={generate}
          disabled={loading || !charA.trim()}
          style={{
            ...styles.generateBtn,
            opacity: loading || !charA.trim() ? 0.5 : 1,
            cursor: loading || !charA.trim() ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={styles.spinner} />
              Generating prompts...
            </span>
          ) : '🎬 Generate Prompts'}
        </button>

        {error && (
          <div style={styles.errorBox}>
            ⚠️ {error}
          </div>
        )}

        {/* RESULTS */}
        {result && result.length > 0 && (
          <div ref={resultRef} style={styles.resultSection}>
            <div style={styles.resultHeader}>
              <div style={styles.sectionLabel}>
                <span style={{ color: '#c084fc' }}>✓</span> PROMPTS GENERATED
              </div>
              <button onClick={copyAll} style={styles.copyAllBtn}>
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

            <div style={styles.workflowBox}>
              <div style={styles.workflowTitle}>📋 WORKFLOW</div>
              <div style={styles.workflowSteps}>
                {[
                  { n: '1', t: 'Copy the image prompt', d: 'Paste into ChatGPT Image or Nano Banana + attach your reference images (if you checked having them)' },
                  { n: '2', t: 'Generate the initial image', d: 'The confrontation scene with both characters positioned on stage' },
                  { n: '3', t: 'Use the video prompts', d: 'Paste each prompt into Seedance or Kling with the generated image as the starting frame' },
                  { n: '4', t: 'Assemble the sequence', d: '4 videos × 8 seconds = complete viral sequence' },
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

      {/* FOOTER */}
      <footer style={styles.footer}>
        <span>© 2026</span>
        <span style={{ color: '#1f2937' }}>•</span>
        <span style={{
          fontFamily: 'Orbitron, monospace',
          fontSize: '0.6rem',
          fontWeight: 700,
          background: 'linear-gradient(135deg, #c084fc, #22d3ee)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>DKTUBE</span>
        <span style={{ color: '#1f2937' }}>•</span>
        <span>henweb.com.br/dktube</span>
      </footer>
    </div>
  )
}

const styles = {
  app: {
    minHeight: '100vh',
    background: '#000',
    color: '#e2e8f0',
    fontFamily: 'Inter, sans-serif',
  },
  hero: {
    padding: '40px 24px 32px',
    background: 'linear-gradient(180deg, #060914 0%, #000 100%)',
    borderBottom: '1px solid rgba(168,85,247,0.1)',
  },
  heroInner: { maxWidth: 680, margin: '0 auto', textAlign: 'center' },
  heroTag: {
    fontFamily: 'Orbitron, monospace',
    fontSize: '0.55rem', letterSpacing: '0.3em',
    color: '#64748b', marginBottom: 14,
  },
  heroTitle: {
    fontFamily: 'Orbitron, monospace',
    fontSize: 'clamp(24px, 5vw, 40px)',
    fontWeight: 900, lineHeight: 1.2,
    color: '#e2e8f0', marginBottom: 14,
  },
  heroAccent: {
    background: 'linear-gradient(135deg, #c084fc, #22d3ee)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  heroDesc: {
    fontSize: 14, color: '#64748b', lineHeight: 1.7, maxWidth: 480, margin: '0 auto',
  },
  builder: {
    maxWidth: 780, margin: '0 auto',
    padding: '32px 24px 60px',
    display: 'flex', flexDirection: 'column', gap: 28,
  },
  section: { display: 'flex', flexDirection: 'column', gap: 12 },
  sectionLabel: {
    fontFamily: 'Orbitron, monospace',
    fontSize: '0.6rem', fontWeight: 700,
    letterSpacing: '0.25em', textTransform: 'uppercase',
    color: '#64748b', display: 'flex', alignItems: 'center', gap: 8,
  },
  charGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: 14,
  },
  cardLabel: {
    fontSize: 11, fontWeight: 600, color: '#64748b',
    marginBottom: 6, letterSpacing: '0.05em',
  },
  inputWrap: { position: 'relative' },
  input: {
    width: '100%', padding: '11px 14px',
    background: '#0a0d18',
    border: '1px solid rgba(168,85,247,0.25)',
    borderRadius: 0, color: '#e2e8f0',
    fontSize: 13, outline: 'none',
    fontFamily: 'Inter, sans-serif',
    transition: 'border-color 0.15s',
  },
  suggestions: {
    position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
    background: '#0d1020',
    border: '1px solid rgba(168,85,247,0.3)',
    borderRadius: 0, marginTop: 4,
    overflow: 'hidden',
    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
  },
  suggItem: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '9px 12px', cursor: 'pointer',
    borderBottom: '1px solid rgba(168,85,247,0.08)',
    transition: 'background 0.1s',
  },
  photoCheckLabel: {
    display: 'flex', alignItems: 'center', gap: 7,
    marginTop: 8, fontSize: 11, color: '#94a3b8',
    cursor: 'pointer', userSelect: 'none',
  },
  photoCheckInput: {
    width: 14, height: 14, cursor: 'pointer', accentColor: '#a855f7',
  },
  scenCard: {
    flex: 1, padding: '16px 14px', borderRadius: 0,
    border: '1px solid', cursor: 'pointer',
    textAlign: 'center', transition: 'all 0.18s',
  },
  refTip: {
    display: 'flex', gap: 14, alignItems: 'flex-start',
    padding: '14px 16px', borderRadius: 0,
    background: 'rgba(168,85,247,0.05)',
    border: '1px solid rgba(168,85,247,0.15)',
  },
  generateBtn: {
    width: '100%', padding: '16px',
    background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    border: 'none', borderRadius: 0,
    color: '#fff', fontSize: 15, fontWeight: 700,
    fontFamily: 'Orbitron, monospace',
    letterSpacing: '0.05em',
    cursor: 'pointer',
    boxShadow: '0 0 24px rgba(168,85,247,0.4)',
    transition: 'all 0.2s',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  spinner: {
    width: 16, height: 16,
    border: '2px solid rgba(255,255,255,0.3)',
    borderTop: '2px solid #fff',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    display: 'inline-block',
  },
  errorBox: {
    padding: '12px 16px', borderRadius: 0,
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.3)',
    color: '#f87171', fontSize: 12,
  },
  resultSection: { display: 'flex', flexDirection: 'column', gap: 16 },
  resultHeader: {
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between',
  },
  promptsGrid: { display: 'flex', flexDirection: 'column', gap: 12 },
  promptBlock: {
    background: '#0a0d18',
    border: '1px solid rgba(168,85,247,0.2)',
    borderLeft: '3px solid',
    borderRadius: 0,
    padding: 16,
    display: 'flex', flexDirection: 'column', gap: 10,
  },
  promptBlockHeader: {
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between',
  },
  promptText: {
    fontSize: 12, lineHeight: 1.8,
    color: '#94a3b8',
    whiteSpace: 'pre-wrap',
    background: '#060914',
    padding: '12px 14px',
    borderRadius: 0,
    border: '1px solid rgba(168,85,247,0.1)',
  },
  copyBtn: {
    padding: '5px 12px', borderRadius: 0,
    border: '1px solid', cursor: 'pointer',
    fontSize: 10, fontWeight: 600,
    transition: 'all 0.15s',
  },
  copyAllBtn: {
    padding: '6px 14px', borderRadius: 0,
    background: 'rgba(168,85,247,0.1)',
    border: '1px solid rgba(168,85,247,0.3)',
    color: '#c084fc', fontSize: 11,
    fontWeight: 600, cursor: 'pointer',
  },
  imageTip: {
    display: 'flex', gap: 8, alignItems: 'flex-start',
    padding: '8px 12px', borderRadius: 0,
    background: 'rgba(168,85,247,0.05)',
    border: '1px solid rgba(168,85,247,0.15)',
    fontSize: 11, color: '#64748b', lineHeight: 1.5,
  },
  workflowBox: {
    padding: '20px', borderRadius: 0,
    background: '#060914',
    border: '1px solid rgba(168,85,247,0.15)',
  },
  workflowTitle: {
    fontFamily: 'Orbitron, monospace',
    fontSize: '0.65rem', fontWeight: 700,
    letterSpacing: '0.2em', color: '#64748b',
    marginBottom: 16,
  },
  workflowSteps: { display: 'flex', flexDirection: 'column', gap: 12 },
  workflowStep: {
    display: 'flex', gap: 12, alignItems: 'flex-start',
  },
  workflowNum: {
    width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
    background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 11, fontWeight: 700, color: '#fff',
  },
  footer: {
    padding: '13px 20px',
    borderTop: '1px solid rgba(168,85,247,0.18)',
    textAlign: 'center', fontSize: 10, color: '#374151',
    background: '#0a0d18',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
  },
}

const styleEl = document.createElement('style')
styleEl.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`
document.head.appendChild(styleEl)
