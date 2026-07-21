import { useEffect, useState } from 'react'
import { theme, card, btn, input, brl, rotuloStatusIntencao } from '../../lib/theme.js'
import Badge from '../../components/Badge.jsx'

const rotulo = { fontSize: 13, color: theme.color.inkSoft, display: 'flex', flexDirection: 'column', gap: 4 }

const vazio = (texto) => (
  <div style={{ ...card, padding: 24, color: theme.color.inkSoft, fontSize: 14 }}>{texto}</div>
)

function FormularioIntencao({ categorias, enviando, onCriar }) {
  const [descricao, setDescricao] = useState('')
  const [categoria_id, setCategoriaId] = useState('')
  const [quantidade, setQuantidade] = useState('')
  const [valor, setValor] = useState('')
  const [catmat, setCatmat] = useState('')

  async function enviar(e) {
    e.preventDefault()
    await onCriar({
      descricao,
      categoria_id: Number(categoria_id),
      quantidade: Number(quantidade),
      valor_unitario_estimado: valor ? Number(valor) : null,
      catmat_code: catmat.trim() || null,
    })
  }

  return (
    <form onSubmit={enviar} style={{ ...card, padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div>
        <strong style={{ fontSize: 16, color: theme.color.ink }}>Nova intenção de compra</strong>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: theme.color.inkSoft }}>
          Antes de comprar, veja se outra secretaria já tem.
        </p>
      </div>

      <label style={rotulo}>
        Descrição
        <textarea
          rows={3} required value={descricao} onChange={(e) => setDescricao(e.target.value)}
          placeholder="Ex.: cadeiras giratórias para o setor de atendimento"
          style={{ ...input, width: '100%', marginTop: 4, resize: 'vertical' }}
        />
      </label>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <label style={rotulo}>
          Categoria
          <select required value={categoria_id} onChange={(e) => setCategoriaId(e.target.value)} style={{ ...input, width: '100%', marginTop: 4 }}>
            <option value="">Selecione</option>
            {categorias.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
        </label>
        <label style={rotulo}>
          Quantidade
          <input type="number" min={1} required value={quantidade} onChange={(e) => setQuantidade(e.target.value)} style={{ ...input, width: '100%', marginTop: 4 }} />
        </label>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <label style={rotulo}>
          Valor unitário estimado (opcional)
          <input type="number" min={0} step="0.01" value={valor} onChange={(e) => setValor(e.target.value)} placeholder="R$" style={{ ...input, width: '100%', marginTop: 4 }} />
        </label>
        <label style={rotulo}>
          CATMAT (opcional)
          <input value={catmat} onChange={(e) => setCatmat(e.target.value)} style={{ ...input, width: '100%', marginTop: 4 }} />
        </label>
      </div>

      <button type="submit" style={btn('primario')} disabled={enviando}>
        {enviando ? 'Buscando…' : 'Ver o que já existe'}
      </button>
    </form>
  )
}

function MatchCard({ match, intencaoAtual, secretarias, quantidade, setQuantidade, convertendo, onConverter }) {
  const dona = secretarias.find((s) => s.id === match.item.secretaria_id)
  const restante = intencaoAtual.quantidade - intencaoAtual.quantidade_atendida
  const atende = Math.min(match.item.saldo_livre, intencaoAtual.quantidade)

  return (
    <div style={{ ...card, padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'start' }}>
        <strong style={{ fontSize: 15, color: theme.color.ink }}>{match.item.nome}</strong>
        <Badge tone="disponivel">{Math.round(match.score * 100)}% compatível</Badge>
      </div>
      <div style={{ fontSize: 13, color: theme.color.inkSoft }}>{match.item.descricao}</div>
      <div style={{ fontSize: 13, color: theme.color.inkSoft }}>
        {dona?.sigla} · atende {atende} de {intencaoAtual.quantidade} un · saldo livre {match.item.saldo_livre}
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.3, textTransform: 'uppercase', color: theme.color.inkSoft }}>
          Economia estimada
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: theme.color.primary, fontVariantNumeric: 'tabular-nums' }}>
          {brl(match.economia_estimada)}
        </div>
        <div style={{ fontSize: 12, color: theme.color.inkSoft, fontVariantNumeric: 'tabular-nums' }}>
          {brl(match.item.valor_unitario_estimado)}/un em estoque · {atende} un aproveitável(is)
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          type="number" min={1} max={Math.min(match.item.saldo_livre, restante)} value={quantidade}
          onChange={(e) => setQuantidade(match.item.id, e.target.value)}
          style={{ ...input, width: 90 }}
        />
        <button style={{ ...btn('primario'), flex: 1 }} disabled={convertendo} onClick={onConverter}>
          {convertendo ? 'Convertendo…' : 'Converter em requisição'}
        </button>
      </div>
    </div>
  )
}

function LinhaIntencao({ intencao, onRever }) {
  return (
    <div style={{ ...card, padding: 16, display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ minWidth: 240, flex: 1 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <strong style={{ color: theme.color.ink, fontSize: 15 }}>{intencao.descricao}</strong>
          <Badge tone={intencao.status}>{rotuloStatusIntencao[intencao.status]}</Badge>
        </div>
        <div style={{ fontSize: 13, color: theme.color.inkSoft, marginTop: 4 }}>
          {intencao.quantidade_atendida} de {intencao.quantidade} un atendidas
        </div>
      </div>
      <button style={btn('quieto')} onClick={onRever}>Rever matches</button>
    </div>
  )
}

export default function InterceptacaoView({ categorias, secretarias, usuario, onCriarIntencao, onGetMatches, onConverter, onManterCompra, onGetIntencoes }) {
  const [intencaoAtual, setIntencaoAtual] = useState(null)
  const [matches, setMatches] = useState([])
  const [quantidades, setQuantidades] = useState({})

  const [carregandoForm, setCarregandoForm] = useState(false)
  const [erroMsg, setErroMsg] = useState(null)
  const [msgOk, setMsgOk] = useState(null)

  const [convertendoId, setConvertendoId] = useState(null)
  const [mostrarMotivo, setMostrarMotivo] = useState(false)
  const [motivo, setMotivo] = useState('')
  const [enviandoMotivo, setEnviandoMotivo] = useState(false)

  const [minhasIntencoes, setMinhasIntencoes] = useState([])
  const [carregandoLista, setCarregandoLista] = useState(true)

  async function carregarMinhasIntencoes() {
    setCarregandoLista(true)
    try {
      setMinhasIntencoes(await onGetIntencoes())
    } finally {
      setCarregandoLista(false)
    }
  }

  useEffect(() => { carregarMinhasIntencoes() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function definirQuantidadesIniciais(intencao, listaMatches) {
    const restante = intencao.quantidade - intencao.quantidade_atendida
    setQuantidades(Object.fromEntries(listaMatches.map((m) => [m.item.id, Math.min(m.item.saldo_livre, restante)])))
  }

  async function criar(dadosForm) {
    setCarregandoForm(true); setErroMsg(null); setMsgOk(null); setMostrarMotivo(false)
    try {
      const { intencao, matches: novosMatches } = await onCriarIntencao({ ...dadosForm, secretaria_id: usuario.secretaria_id })
      setIntencaoAtual(intencao)
      setMatches(novosMatches)
      definirQuantidadesIniciais(intencao, novosMatches)
      await carregarMinhasIntencoes()
    } catch (e) {
      setErroMsg(e.message)
    } finally {
      setCarregandoForm(false)
    }
  }

  async function rever(intencao) {
    setErroMsg(null); setMsgOk(null); setMostrarMotivo(false)
    setIntencaoAtual(intencao)
    const novosMatches = await onGetMatches(intencao.id)
    setMatches(novosMatches)
    definirQuantidadesIniciais(intencao, novosMatches)
  }

  async function converter(match) {
    const quantidade = Number(quantidades[match.item.id])
    setConvertendoId(match.item.id); setErroMsg(null)
    try {
      const requisicao = await onConverter(intencaoAtual.id, match.item.id, quantidade)
      const intencaoAtualizada = {
        ...intencaoAtual,
        quantidade_atendida: intencaoAtual.quantidade_atendida + quantidade,
      }
      if (intencaoAtualizada.quantidade_atendida >= intencaoAtualizada.quantidade) intencaoAtualizada.status = 'convertida'
      setIntencaoAtual(intencaoAtualizada)
      setMsgOk(`Requisição #${requisicao.id} criada — acompanhe em Minhas requisições`)

      const novosMatches = await onGetMatches(intencaoAtualizada.id)
      setMatches(novosMatches)
      definirQuantidadesIniciais(intencaoAtualizada, novosMatches)
      await carregarMinhasIntencoes()
    } catch (e) {
      setErroMsg(e.message)
    } finally {
      setConvertendoId(null)
    }
  }

  async function registrarMotivo() {
    setEnviandoMotivo(true); setErroMsg(null)
    try {
      await onManterCompra(intencaoAtual.id, motivo)
      setIntencaoAtual({ ...intencaoAtual, status: 'mantida_compra', motivo_compra: motivo })
      setMostrarMotivo(false); setMotivo('')
      setMsgOk('Registrado — sua decisão alimenta o indicador de oportunidades.')
      await carregarMinhasIntencoes()
    } catch (e) {
      setErroMsg(e.message)
    } finally {
      setEnviandoMotivo(false)
    }
  }

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <FormularioIntencao categorias={categorias} enviando={carregandoForm} onCriar={criar} />

      {erroMsg && (
        <div style={{ ...card, padding: 12, borderColor: theme.color.danger, color: theme.color.danger, fontSize: 14, fontWeight: 600 }}>
          {erroMsg}
        </div>
      )}

      {intencaoAtual && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h2 style={{ margin: 0, fontSize: 18, color: theme.color.ink }}>
            Resultados para “{intencaoAtual.descricao}”
          </h2>

          {msgOk && (
            <div style={{ ...card, padding: 12, color: theme.color.primaryDark, fontSize: 14, fontWeight: 600 }}>
              {msgOk}
            </div>
          )}

          {(() => {
            // Bloco de "manter compra": registra motivo quando a secretaria segue com a aquisição.
            // CONTRATO_API.md §3.5 exige a trilha de auditoria TAMBÉM quando há item disponível — por isso
            // aparece nos dois ramos (com e sem matches), não só quando a lista vem vazia.
            if (intencaoAtual.status === 'mantida_compra') return null
            const rotuloBotao = matches.length === 0
              ? 'Registrar compra mesmo assim'
              : 'Comprar mesmo assim (justificar)'
            return mostrarMotivo ? (
              <div style={{ ...card, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <label style={rotulo}>
                  Motivo da compra
                  <textarea rows={2} value={motivo} onChange={(e) => setMotivo(e.target.value)}
                    placeholder="Por que a compra segue necessária mesmo havendo item no catálogo" style={{ ...input, width: '100%', marginTop: 4, resize: 'vertical' }} />
                </label>
                <button style={btn('primario')} disabled={enviandoMotivo || !motivo.trim()} onClick={registrarMotivo}>
                  {enviandoMotivo ? 'Registrando…' : 'Confirmar'}
                </button>
              </div>
            ) : (
              <button style={{ ...btn('quieto'), alignSelf: 'flex-start' }} onClick={() => setMostrarMotivo(true)}>
                {rotuloBotao}
              </button>
            )
          })()}

          {matches.length === 0 ? (
            vazio('Nenhum item compatível no momento.')
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
              {matches.map((m) => (
                <MatchCard
                  key={m.item.id}
                  match={m}
                  intencaoAtual={intencaoAtual}
                  secretarias={secretarias}
                  quantidade={quantidades[m.item.id] ?? 1}
                  setQuantidade={(itemId, valor) => setQuantidades((q) => ({ ...q, [itemId]: valor }))}
                  convertendo={convertendoId === m.item.id}
                  onConverter={() => converter(m)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <h2 style={{ margin: 0, fontSize: 18, color: theme.color.ink }}>Minhas intenções</h2>
        {carregandoLista
          ? vazio('Carregando…')
          : minhasIntencoes.length === 0
            ? vazio('Nenhuma intenção registrada ainda.')
            : minhasIntencoes.map((i) => <LinhaIntencao key={i.id} intencao={i} onRever={() => rever(i)} />)}
      </div>
    </section>
  )
}
