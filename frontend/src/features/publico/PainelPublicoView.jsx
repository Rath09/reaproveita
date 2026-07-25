import { useCallback, useEffect, useState } from 'react'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  AreaChart, Area, PieChart, Pie, Cell,
} from 'recharts'
import { theme, card, input, brl } from '../../lib/theme.js'
import Stat from '../../components/Stat.jsx'
import * as api from '../../data/api.js'

function voltarAoAcessoInterno(e) {
  e.preventDefault()
  window.location.hash = ''
}

// ---- convenções visuais dos gráficos (Bloco 7) ----
const CIANO = theme.color.cianoPmf
const AZUL = theme.color.azulPmf
const GRID = '#E5EAEE'
const eixo = { fontSize: 12, fill: theme.color.inkSoft, fontFamily: theme.font }
const brlCompacto = (n) =>
  n >= 1000 ? `R$ ${(n / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} mil` : brl(n)

function TooltipPainel({ active, payload, label, rotulos }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ ...card, padding: '10px 14px', fontFamily: theme.font, fontSize: 13 }}>
      {label && <div style={{ fontWeight: 700, color: theme.color.ink, marginBottom: 4 }}>{label}</div>}
      {payload.map((p) => (
        <div key={p.dataKey} style={{ color: theme.color.inkSoft }}>
          {(rotulos?.[p.dataKey] || p.name)}: <strong style={{ color: theme.color.ink }}>{brl(p.value)}</strong>
        </div>
      ))}
    </div>
  )
}

function CartaoGrafico({ titulo, children, altura = 260 }) {
  return (
    <div style={{ ...card, padding: '16px 18px 8px', display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
      <strong style={{ fontSize: 14, color: theme.color.azulPmf }}>{titulo}</strong>
      <div style={{ width: '100%', height: altura }}>{children}</div>
    </div>
  )
}

// Painel de transparência (§7) — rota pública por hash (#/publico), sem exigir login.
// Todos os números e gráficos saem de UMA agregação do seed (getPainelPublico);
// os filtros recalculam o conjunto inteiro.
export default function PainelPublicoView() {
  const [dados, setDados] = useState(null)
  const [categorias, setCategorias] = useState([])
  const [filtros, setFiltros] = useState({ categoria_id: '', periodo_dias: '' })

  useEffect(() => { api.getCategorias().then(setCategorias) }, [])

  const buscar = useCallback(() => {
    api.getPainelPublico({
      categoria_id: filtros.categoria_id || null,
      periodo_dias: filtros.periodo_dias ? Number(filtros.periodo_dias) : null,
    }).then(setDados)
  }, [filtros])

  useEffect(() => { buscar() }, [buscar])

  // O painel abre em nova aba: quando o app interno (outra aba) grava uma transação
  // no localStorage, o evento 'storage' chega aqui e o painel se atualiza sozinho —
  // dá para deixá-lo num telão e ver os números subirem ao vivo durante a demo.
  useEffect(() => {
    const aoMudarEstado = (e) => { if (e.key === 'reaproveita.estado') buscar() }
    window.addEventListener('storage', aoMudarEstado)
    return () => window.removeEventListener('storage', aoMudarEstado)
  }, [buscar])

  const k = dados?.kpis

  return (
    <div style={{ fontFamily: theme.font, background: theme.color.paper, minHeight: '100vh', color: theme.color.ink }}>
      <header style={{ background: theme.color.surface, borderTop: `4px solid ${theme.color.azulPmf}`, borderBottom: `1px solid ${theme.color.line}` }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800, color: theme.color.azulPmf, letterSpacing: -0.3 }}>Reaproveita — Transparência</div>
            <div style={{ fontSize: 13, color: theme.color.inkSoft }}>Almoxarifado compartilhado · Prefeitura de Florianópolis</div>
          </div>
          <a href="#" onClick={voltarAoAcessoInterno} style={{ fontSize: 13, color: theme.color.cianoEscuro, fontWeight: 600, textDecoration: 'none' }}>
            Acesso interno
          </a>
        </div>
      </header>

      <main style={{ maxWidth: 1180, margin: '0 auto', padding: '24px 20px 48px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Filtros — recalculam todos os números e gráficos */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <select
            style={input} value={filtros.categoria_id}
            onChange={(e) => setFiltros({ ...filtros, categoria_id: e.target.value })}
            aria-label="Filtrar por categoria"
          >
            <option value="">Todas as categorias</option>
            {categorias.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
          <select
            style={input} value={filtros.periodo_dias}
            onChange={(e) => setFiltros({ ...filtros, periodo_dias: e.target.value })}
            aria-label="Filtrar por período"
          >
            <option value="">Todo o período</option>
            <option value="30">Últimos 30 dias</option>
            <option value="90">Últimos 90 dias</option>
          </select>
        </div>

        {!dados ? (
          <p style={{ color: theme.color.inkSoft, fontSize: 14 }}>Carregando indicadores…</p>
        ) : (
          <>
            {/* Linha 1 — hero: a economia em primeiro lugar */}
            <div style={{ ...card, padding: '20px 24px', display: 'flex', gap: 40, flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ flex: '1 1 260px' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: theme.color.inkSoft, textTransform: 'uppercase', letterSpacing: 0.6 }}>
                  Compras evitadas
                </div>
                <div style={{ fontSize: 46, fontWeight: 800, color: theme.color.verdeEconomia, fontVariantNumeric: 'tabular-nums', lineHeight: 1.1 }}>
                  {brl(k.compras_evitadas_valor)}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 36, flexWrap: 'wrap' }}>
                <Stat label="Itens transferidos" value={k.itens_transferidos} />
                <Stat label="Requisições concluídas" value={k.requisicoes_concluidas} />
                <Stat label="Taxa de interceptação" value={`${Math.round(k.taxa_interceptacao * 100)}%`} />
              </div>
            </div>

            {/* Linha 2 — economia por secretaria · enviados × recebidos */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(460px, 100%), 1fr))', gap: 20 }}>
              <CartaoGrafico titulo="Economia por secretaria">
                <ResponsiveContainer>
                  <BarChart data={dados.economiaPorSecretaria} layout="vertical" margin={{ left: 8, right: 24, top: 4, bottom: 0 }}>
                    <CartesianGrid stroke={GRID} horizontal={false} />
                    <XAxis type="number" tick={eixo} tickFormatter={brlCompacto} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="sigla" tick={eixo} width={52} axisLine={false} tickLine={false} />
                    <Tooltip content={<TooltipPainel rotulos={{ economia: 'Economia' }} />} cursor={{ fill: 'rgba(30,143,197,0.06)' }} />
                    <Bar dataKey="economia" fill={CIANO} radius={[0, 6, 6, 0]} isAnimationActive animationDuration={350} />
                  </BarChart>
                </ResponsiveContainer>
              </CartaoGrafico>

              <CartaoGrafico titulo="Enviados × recebidos por secretaria (R$)">
                <ResponsiveContainer>
                  <BarChart data={dados.fluxoPorSecretaria} margin={{ left: 8, right: 8, top: 4, bottom: 0 }}>
                    <CartesianGrid stroke={GRID} vertical={false} />
                    <XAxis dataKey="sigla" tick={eixo} axisLine={false} tickLine={false} />
                    <YAxis tick={eixo} tickFormatter={brlCompacto} axisLine={false} tickLine={false} width={72} />
                    <Tooltip content={<TooltipPainel rotulos={{ enviados: 'Enviados', recebidos: 'Recebidos' }} />} cursor={{ fill: 'rgba(13,44,84,0.05)' }} />
                    <Legend formatter={(v) => ({ enviados: 'Enviados', recebidos: 'Recebidos' }[v] || v)} wrapperStyle={{ fontSize: 13, fontFamily: theme.font }} />
                    <Bar dataKey="enviados" fill={AZUL} radius={[6, 6, 0, 0]} isAnimationActive animationDuration={350} />
                    <Bar dataKey="recebidos" fill={CIANO} radius={[6, 6, 0, 0]} isAnimationActive animationDuration={350} />
                  </BarChart>
                </ResponsiveContainer>
              </CartaoGrafico>
            </div>

            {/* Linha 3 — economia acumulada · patrimônio × consumo */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(460px, 100%), 1fr))', gap: 20 }}>
              <CartaoGrafico titulo={`Economia acumulada (${filtros.periodo_dias === '30' ? 'últimos 30 dias' : 'últimos 90 dias'})`}>
                <ResponsiveContainer>
                  <AreaChart data={dados.economiaSemanal} margin={{ left: 8, right: 16, top: 4, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gradEconomia" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={CIANO} stopOpacity={0.28} />
                        <stop offset="100%" stopColor={CIANO} stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke={GRID} vertical={false} />
                    <XAxis dataKey="semana" tick={eixo} axisLine={false} tickLine={false} />
                    <YAxis tick={eixo} tickFormatter={brlCompacto} axisLine={false} tickLine={false} width={72} />
                    <Tooltip content={<TooltipPainel rotulos={{ economia: 'Acumulado' }} />} />
                    <Area type="monotone" dataKey="economia" stroke={CIANO} strokeWidth={2.5} fill="url(#gradEconomia)" isAnimationActive animationDuration={350} />
                  </AreaChart>
                </ResponsiveContainer>
              </CartaoGrafico>

              <CartaoGrafico titulo="Patrimônio × material de consumo (economia)">
                <ResponsiveContainer>
                  <PieChart margin={{ top: 4, bottom: 4 }}>
                    {/* sem animação: o Pie do recharts 3 + StrictMode deixa os setores
                        vazios quando anima — os demais gráficos animam normalmente */}
                    <Pie
                      data={dados.patrimonioConsumo} dataKey="valor" nameKey="nome"
                      innerRadius="58%" outerRadius="82%" paddingAngle={2}
                      isAnimationActive={false}
                    >
                      <Cell fill={AZUL} />
                      <Cell fill={CIANO} />
                    </Pie>
                    <Tooltip content={<TooltipPainel />} />
                    <Legend wrapperStyle={{ fontSize: 13, fontFamily: theme.font }} />
                  </PieChart>
                </ResponsiveContainer>
              </CartaoGrafico>
            </div>
          </>
        )}
      </main>

      <footer style={{ textAlign: 'center', padding: '0 20px 28px', fontSize: 12, color: theme.color.inkSoft }}>
        Prefeitura de Florianópolis · dados do programa de reaproveitamento
      </footer>
    </div>
  )
}
