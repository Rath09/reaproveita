import { theme } from '../lib/theme.js'

// Assinatura visual do produto: o número de compra evitada em destaque.
export default function Stat({ label, value, big = false }) {
  return (
    <div style={{ minWidth: big ? 220 : 140 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: theme.color.inkSoft, textTransform: 'uppercase', letterSpacing: 0.6 }}>
        {label}
      </div>
      <div style={{
        fontSize: big ? 34 : 22, fontWeight: 800, color: big ? theme.color.primary : theme.color.ink,
        fontVariantNumeric: 'tabular-nums', lineHeight: 1.15,
        borderBottom: big ? `3px solid ${theme.color.primary}` : 'none',
        display: 'inline-block', paddingBottom: big ? 2 : 0,
      }}>
        {value}
      </div>
    </div>
  )
}
