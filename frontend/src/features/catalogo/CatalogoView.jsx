import { useState } from 'react'
import { theme, card, btn, input, brl, rotuloEstado, rotuloStatusItem } from '../../lib/theme.js'
import Badge from '../../components/Badge.jsx'

function Filtros({ filtro, setFiltro, categorias }) {
  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
      <input
        style={{ ...input, flex: '1 1 260px' }}
        placeholder="Buscar por nome ou nº de patrimônio…"
        value={filtro.q}
        onChange={(e) => setFiltro({ ...filtro, q: e.target.value })}
      />
      <select style={input} value={filtro.categoria_id} onChange={(e) => setFiltro({ ...filtro, categoria_id: e.target.value })}>
        <option value="">Todas as categorias</option>
        {categorias.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
      </select>
      <select style={input} value={filtro.status} onChange={(e) => setFiltro({ ...filtro, status: e.target.value })}>
        <option value="">Todos os status</option>
        <option value="disponivel">Disponível</option>
        <option value="reservado">Reservado</option>
        <option value="transferido">Transferido</option>
      </select>
    </div>
  )
}

function ItemCard({ item, siglaSecretaria, nomeCategoria, onAbrir }) {
  return (
    <button
      onClick={onAbrir}
      style={{ ...card, padding: 16, textAlign: 'left', cursor: 'pointer', fontFamily: theme.font, display: 'flex', flexDirection: 'column', gap: 8 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
        <strong style={{ fontSize: 15, color: theme.color.ink }}>{item.nome}</strong>
        <Badge tone={item.status}>{rotuloStatusItem[item.status]}</Badge>
      </div>
      <div style={{ fontSize: 13, color: theme.color.inkSoft }}>
        {nomeCategoria} · {siglaSecretaria} · {item.patrimonio}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontSize: 13, color: theme.color.inkSoft }}>
          Saldo livre: <strong style={{ color: theme.color.ink }}>{item.saldo_livre}</strong> / {item.quantidade}
        </span>
        <span style={{ fontSize: 13, fontWeight: 600, color: theme.color.primaryDark, fontVariantNumeric: 'tabular-nums' }}>
          {brl(item.valor_unitario_estimado)}/un
        </span>
      </div>
      <div><Badge tone="neutro">{rotuloEstado[item.estado_conservacao]}</Badge></div>
    </button>
  )
}

function PainelItem({ item, usuario, secretarias, categorias, onRequisitar, onFechar }) {
  const [quantidade, setQuantidade] = useState(1)
  const [justificativa, setJustificativa] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [msg, setMsg] = useState(null)

  const ehPropria = usuario.papel === 'secretaria' && item.secretaria_id === usuario.secretaria_id
  const podeRequisitar = usuario.papel === 'secretaria' && !ehPropria && item.saldo_livre > 0
  const dona = secretarias.find((s) => s.id === item.secretaria_id)

  async function enviar() {
    setEnviando(true); setMsg(null)
    try {
      await onRequisitar({ item_id: item.id, quantidade: Number(quantidade), justificativa })
      setMsg({ ok: true, texto: 'Requisição enviada. Acompanhe na aba Requisições.' })
    } catch (e) {
      setMsg({ ok: false, texto: e.message })
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(28,35,33,.35)', display: 'flex', justifyContent: 'flex-end', zIndex: 50 }} onClick={onFechar}>
      <div style={{ width: 'min(420px, 100%)', background: theme.color.surface, height: '100%', padding: 24, overflowY: 'auto', fontFamily: theme.font }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 12 }}>
          <h2 style={{ margin: 0, fontSize: 20, color: theme.color.ink }}>{item.nome}</h2>
          <button onClick={onFechar} style={{ ...btn('quieto'), padding: '4px 10px' }}>Fechar</button>
        </div>

        <p style={{ color: theme.color.inkSoft, fontSize: 14 }}>{item.descricao}</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 14, margin: '14px 0' }}>
          <div>Patrimônio<br /><strong>{item.patrimonio}</strong></div>
          <div>Secretaria dona<br /><strong>{dona?.sigla}</strong></div>
          <div>Categoria<br /><strong>{categorias.find((c) => c.id === item.categoria_id)?.nome}</strong></div>
          <div>Conservação<br /><strong>{rotuloEstado[item.estado_conservacao]}</strong></div>
          <div>Saldo livre<br /><strong>{item.saldo_livre} de {item.quantidade}</strong></div>
          <div>Valor estimado<br /><strong>{brl(item.valor_unitario_estimado)}/un</strong></div>
        </div>

        {podeRequisitar && (
          <div style={{ borderTop: `1px solid ${theme.color.line}`, paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <strong style={{ fontSize: 15 }}>Requisitar este item</strong>
            <label style={{ fontSize: 13, color: theme.color.inkSoft }}>
              Quantidade (máx. {item.saldo_livre})
              <input type="number" min={1} max={item.saldo_livre} value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)} style={{ ...input, width: '100%', marginTop: 4 }} />
            </label>
            <label style={{ fontSize: 13, color: theme.color.inkSoft }}>
              Justificativa
              <textarea rows={3} value={justificativa} onChange={(e) => setJustificativa(e.target.value)}
                placeholder="Para onde vai e por quê" style={{ ...input, width: '100%', marginTop: 4, resize: 'vertical' }} />
            </label>
            <button style={btn('primario')} disabled={enviando || !justificativa.trim()} onClick={enviar}>
              {enviando ? 'Enviando…' : 'Enviar requisição'}
            </button>
          </div>
        )}

        {ehPropria && <p style={{ fontSize: 13, color: theme.color.inkSoft }}>Este item pertence à sua secretaria.</p>}
        {usuario.papel === 'gestor' && <p style={{ fontSize: 13, color: theme.color.inkSoft }}>Gestores aprovam requisições na aba Requisições.</p>}

        {msg && (
          <p style={{ marginTop: 12, fontSize: 14, fontWeight: 600, color: msg.ok ? theme.color.primaryDark : theme.color.danger }}>
            {msg.texto}
          </p>
        )}
      </div>
    </div>
  )
}

export default function CatalogoView({ itens, categorias, secretarias, usuario, filtro, setFiltro, onRequisitar }) {
  const [aberto, setAberto] = useState(null)
  const itemAberto = aberto ? itens.find((i) => i.id === aberto) : null

  return (
    <section>
      <Filtros filtro={filtro} setFiltro={setFiltro} categorias={categorias} />
      {itens.length === 0 ? (
        <div style={{ ...card, padding: 24, color: theme.color.inkSoft, fontSize: 14 }}>
          Nenhum item com esses filtros. Limpe a busca ou mude a categoria para ver o estoque da rede.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 14 }}>
          {itens.map((i) => (
            <ItemCard
              key={i.id}
              item={i}
              siglaSecretaria={secretarias.find((s) => s.id === i.secretaria_id)?.sigla}
              nomeCategoria={categorias.find((c) => c.id === i.categoria_id)?.nome}
              onAbrir={() => setAberto(i.id)}
            />
          ))}
        </div>
      )}
      {itemAberto && (
        <PainelItem
          item={itemAberto}
          usuario={usuario}
          secretarias={secretarias}
          categorias={categorias}
          onRequisitar={onRequisitar}
          onFechar={() => setAberto(null)}
        />
      )}
    </section>
  )
}
