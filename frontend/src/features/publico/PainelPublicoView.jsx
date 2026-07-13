import { theme, brl } from '../../lib/theme.js'
import Stat from '../../components/Stat.jsx'

function voltarAoAcessoInterno(e) {
  e.preventDefault()
  window.location.hash = ''
}

// Painel de transparência (§7) — rota pública por hash (#/publico), sem exigir login.
export default function PainelPublicoView({ kpis }) {
  return (
    <div style={{ fontFamily: theme.font, background: theme.color.paper, minHeight: '100vh', color: theme.color.ink }}>
      <header style={{ background: theme.color.surface, borderBottom: `1px solid ${theme.color.line}` }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800, color: theme.color.primaryDark, letterSpacing: -0.3 }}>Reaproveita — Transparência</div>
            <div style={{ fontSize: 13, color: theme.color.inkSoft }}>Almoxarifado compartilhado · Prefeitura de Florianópolis</div>
          </div>
          <a href="#" onClick={voltarAoAcessoInterno} style={{ fontSize: 13, color: theme.color.inkSoft, textDecoration: 'underline' }}>
            Acesso interno
          </a>
        </div>
      </header>

      <main style={{ maxWidth: 1080, margin: '0 auto', padding: '32px 20px 48px' }}>
        {!kpis ? (
          <p style={{ color: theme.color.inkSoft, fontSize: 14 }}>Carregando indicadores…</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 28 }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <Stat big label="Compras evitadas" value={brl(kpis.compras_evitadas_valor)} />
            </div>
            <Stat label="Itens transferidos" value={kpis.itens_transferidos} />
            <Stat label="Requisições concluídas" value={kpis.requisicoes_concluidas} />
            <Stat label="Intenções registradas" value={kpis.intencoes_total} />
            <Stat label="Intenções convertidas" value={kpis.intencoes_convertidas} />
            <Stat label="Taxa de interceptação" value={`${Math.round(kpis.taxa_interceptacao * 100)}%`} />
          </div>
        )}
      </main>

      <footer style={{ textAlign: 'center', padding: '0 20px 28px', fontSize: 12, color: theme.color.inkSoft }}>
        Prefeitura de Florianópolis · dados do programa de reaproveitamento
      </footer>
    </div>
  )
}
