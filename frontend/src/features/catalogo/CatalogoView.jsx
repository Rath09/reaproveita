import { useCallback, useEffect, useRef, useState } from 'react'
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
  const [avisoDescarte, setAvisoDescarte] = useState(false)

  const backdropRef = useRef(null)
  const comecouNoBackdrop = useRef(false)

  const ehPropria = usuario.papel === 'secretaria' && item.secretaria_id === usuario.secretaria_id
  const podeRequisitar = usuario.papel === 'secretaria' && !ehPropria && item.saldo_livre > 0
  const dona = secretarias.find((s) => s.id === item.secretaria_id)

  // "Sujo" = há trabalho do usuário que fechar destruiria. Sem formulário na tela
  // (gestor, item da própria secretaria) nunca há o que perder.
  const sujo = podeRequisitar && (justificativa.trim() !== '' || Number(quantidade) !== 1)

  // Fechamento acidental (backdrop/Esc) é bloqueado com formulário sujo: nesse
  // estado só X e Cancelar fecham, porque são gestos deliberados de descarte.
  const fecharSeLimpo = useCallback(() => {
    if (sujo) { setAvisoDescarte(true); return }
    onFechar()
  }, [sujo, onFechar])

  useEffect(() => {
    const aoTeclar = (e) => { if (e.key === 'Escape') fecharSeLimpo() }
    document.addEventListener('keydown', aoTeclar)
    return () => document.removeEventListener('keydown', aoTeclar)
  }, [fecharSeLimpo])

  // O clique só conta como "no backdrop" se o gesto inteiro aconteceu nele.
  // Sem isso, arrastar uma seleção de dentro de um campo para fora fecha o painel:
  // o `click` do DOM dispara no ancestral comum de mousedown e mouseup — o backdrop.
  function aoPressionar(e) {
    comecouNoBackdrop.current = e.target === backdropRef.current
  }

  function aoSoltar(e) {
    const terminouNoBackdrop = e.target === backdropRef.current
    const gestoInteiroNoBackdrop = comecouNoBackdrop.current && terminouNoBackdrop
    comecouNoBackdrop.current = false
    if (gestoInteiroNoBackdrop) fecharSeLimpo()
  }

  async function enviar() {
    setEnviando(true); setMsg(null)
    try {
      await onRequisitar({ item_id: item.id, quantidade: Number(quantidade), justificativa })
      setMsg({ ok: true, texto: 'Requisição enviada. Acompanhe na aba Requisições.' })
      // Enviado, nada mais a perder: limpar devolve o fechamento por backdrop/Esc.
      setQuantidade(1); setJustificativa(''); setAvisoDescarte(false)
    } catch (e) {
      setMsg({ ok: false, texto: e.message })
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div
      ref={backdropRef}
      onMouseDown={aoPressionar}
      onMouseUp={aoSoltar}
      style={{ position: 'fixed', inset: 0, background: 'rgba(28,35,33,.35)', display: 'flex', justifyContent: 'flex-end', zIndex: 50 }}
    >
      <div style={{ width: 'min(420px, 100%)', background: theme.color.surface, height: '100%', padding: 24, overflowY: 'auto', fontFamily: theme.font }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 12 }}>
          <h2 style={{ margin: 0, fontSize: 20, color: theme.color.ink }}>{item.nome}</h2>
          <button onClick={onFechar} aria-label="Fechar" title="Fechar" style={{ ...btn('quieto'), padding: '4px 12px', fontSize: 16, lineHeight: 1.2 }}>✕</button>
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
            {avisoDescarte && (
              <p style={{ margin: 0, fontSize: 13, color: theme.color.amber, fontWeight: 600 }}>
                Você tem dados preenchidos. Envie a requisição ou use Cancelar para descartar.
              </p>
            )}
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{ ...btn('primario'), flex: 1 }} disabled={enviando || !justificativa.trim()} onClick={enviar}>
                {enviando ? 'Enviando…' : 'Enviar requisição'}
              </button>
              <button type="button" style={btn('quieto')} onClick={onFechar}>Cancelar</button>
            </div>
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
