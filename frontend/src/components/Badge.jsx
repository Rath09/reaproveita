import { theme } from '../lib/theme.js'

// Selo de status/estado. `tone` vem de theme.tones.
export default function Badge({ tone = 'neutro', children }) {
  const t = theme.tones[tone] || theme.tones.neutro
  return (
    <span style={{
      display: 'inline-block', padding: '2px 10px', borderRadius: 999,
      fontSize: 12, fontWeight: 600, letterSpacing: 0.2,
      background: t.bg, color: t.fg, whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  )
}
