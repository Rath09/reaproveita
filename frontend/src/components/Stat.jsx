import { theme } from '../lib/theme.js'

// Assinatura visual do produto: o número de compra evitada em destaque.
// O verde é exclusivo de dinheiro economizado — `verde` só é ligado nesses casos.
export default function Stat({ label, value, big = false, verde = big }) {
  return (
    <div style={{ minWidth: big ? 220 : 140 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: theme.color.inkSoft, textTransform: 'uppercase', letterSpacing: 0.6 }}>
        {label}
      </div>
      <div style={{
        fontSize: big ? 34 : 22, fontWeight: 800,
        color: verde ? theme.color.verdeEconomia : theme.color.ink,
        fontVariantNumeric: 'tabular-nums', lineHeight: 1.15,
      }}>
        {value}
      </div>
    </div>
  )
}
