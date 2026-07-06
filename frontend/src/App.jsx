import { useEffect, useState, useCallback } from 'react'
import { theme, brl } from './lib/theme.js'
import * as api from './data/api.js'
import Stat from './components/Stat.jsx'
import CatalogoView from './features/catalogo/CatalogoView.jsx'
import RequisicoesView from './features/requisicoes/RequisicoesView.jsx'

export default function App() {
  const [papel, setPapel] = useState('secretaria') // 'secretaria' | 'gestor'
  const [aba, setAba] = useState('catalogo')       // 'catalogo' | 'requisicoes'
  const [filtro, setFiltro] = useState({ q: '', categoria_id: '', status: '' })

  const [secretarias, setSecretarias] = useState([])
  const [categorias, setCategorias] = useState([])
  const [itens, setItens] = useState([])
  const [requisicoes, setRequisicoes] = useState([])
  const [kpis, setKpis] = useState(null)

  const usuario = api.getUsuario(papel)

  // Referências (uma vez)
  useEffect(() => {
    api.getSecretarias().then(setSecretarias)
    api.getCategorias().then(setCategorias)
  }, [])

  // Recarrega dados dependentes de filtro/papel
  const recarregar = useCallback(async () => {
    const [i, r, k] = await Promise.all([
      api.getItens(filtro),
      api.getRequisicoes(papel === 'secretaria' ? { secretaria_solicitante_id: usuario.secretaria_id } : {}),
      api.getKpis(),
    ])
    setItens(i); setRequisicoes(r); setKpis(k)
  }, [filtro, papel, usuario.secretaria_id])

  useEffect(() => { recarregar() }, [recarregar])

  async function requisitar(dados) {
    await api.criarRequisicao({ ...dados, secretaria_solicitante_id: usuario.secretaria_id })
    await recarregar()
  }

  async function decidir(id, acao) {
    await api.atualizarRequisicao(id, acao)
    await recarregar()
  }

  const abaBtn = (id, rotulo) => (
    <button
      onClick={() => setAba(id)}
      style={{
        fontFamily: theme.font, fontSize: 14, fontWeight: 600, cursor: 'pointer',
        padding: '10px 4px', background: 'none', border: 'none',
        color: aba === id ? theme.color.primaryDark : theme.color.inkSoft,
        borderBottom: aba === id ? `3px solid ${theme.color.primary}` : '3px solid transparent',
      }}
    >
      {rotulo}
    </button>
  )

  return (
    <div style={{ fontFamily: theme.font, background: theme.color.paper, minHeight: '100vh', color: theme.color.ink }}>
      {/* Cabeçalho */}
      <header style={{ background: theme.color.surface, borderBottom: `1px solid ${theme.color.line}` }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '14px 20px', display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: theme.color.primaryDark, letterSpacing: -0.3 }}>Reaproveita</div>
            <div style={{ fontSize: 12, color: theme.color.inkSoft }}>Almoxarifado compartilhado · Prefeitura de Florianópolis</div>
          </div>

          {/* Seletor de papel (demo): troca a interface ao vivo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 13, color: theme.color.inkSoft }}>
              {usuario.nome} · {papel === 'secretaria' ? 'Secretaria de Saúde' : 'Gestor do almoxarifado'}
            </span>
            <div style={{ display: 'flex', border: `1px solid ${theme.color.line}`, borderRadius: 999, overflow: 'hidden' }}>
              {['secretaria', 'gestor'].map((p) => (
                <button key={p} onClick={() => setPapel(p)} style={{
                  fontFamily: theme.font, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  padding: '7px 14px', border: 'none',
                  background: papel === p ? theme.color.primary : theme.color.surface,
                  color: papel === p ? '#fff' : theme.color.inkSoft,
                }}>
                  {p === 'secretaria' ? 'Secretaria' : 'Gestor'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Faixa de KPIs — a assinatura do produto: dinheiro público que deixou de ser gasto */}
      <div style={{ background: theme.color.surface, borderBottom: `1px solid ${theme.color.line}` }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '16px 20px', display: 'flex', gap: 36, flexWrap: 'wrap' }}>
          <Stat big label="Compras evitadas" value={kpis ? brl(kpis.compras_evitadas_valor) : '—'} />
          <Stat label="Itens transferidos" value={kpis ? kpis.itens_transferidos : '—'} />
          <Stat label="Requisições concluídas" value={kpis ? kpis.requisicoes_concluidas : '—'} />
        </div>
      </div>

      {/* Abas + conteúdo */}
      <main style={{ maxWidth: 1080, margin: '0 auto', padding: '10px 20px 48px' }}>
        <nav style={{ display: 'flex', gap: 22, borderBottom: `1px solid ${theme.color.line}`, marginBottom: 18 }}>
          {abaBtn('catalogo', 'Catálogo')}
          {abaBtn('requisicoes', papel === 'gestor' ? 'Requisições (aprovação)' : 'Minhas requisições')}
        </nav>

        {aba === 'catalogo' ? (
          <CatalogoView
            itens={itens}
            categorias={categorias}
            secretarias={secretarias}
            usuario={usuario}
            filtro={filtro}
            setFiltro={setFiltro}
            onRequisitar={requisitar}
          />
        ) : (
          <RequisicoesView
            requisicoes={requisicoes}
            secretarias={secretarias}
            usuario={usuario}
            onAcao={decidir}
          />
        )}
      </main>

      <footer style={{ textAlign: 'center', padding: '0 20px 28px', fontSize: 12, color: theme.color.inkSoft }}>
        Protótipo (TRL3) com dados fictícios · Jornada Incubintech 2026 · Interceptação de compra: Sprint 2
      </footer>
    </div>
  )
}
