import { useState } from 'react'
import { theme, card, btn, brl, rotuloStatusReq } from '../../lib/theme.js'
import Badge from '../../components/Badge.jsx'

function LinhaRequisicao({ req, secretarias, acoes }) {
  const solicitante = secretarias.find((s) => s.id === req.secretaria_solicitante_id)
  return (
    <div style={{ ...card, padding: 16, display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ minWidth: 240, flex: 1 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <strong style={{ color: theme.color.ink, fontSize: 15 }}>{req.item.nome}</strong>
          <Badge tone={req.status}>{rotuloStatusReq[req.status]}</Badge>
        </div>
        <div style={{ fontSize: 13, color: theme.color.inkSoft, marginTop: 4 }}>
          {req.quantidade} un · solicitado por <strong>{solicitante?.sigla}</strong> · {brl(req.quantidade * (req.valor_unitario_evitado ?? req.item.valor_unitario_estimado))} em compra evitada
        </div>
        <div style={{ fontSize: 13, color: theme.color.inkSoft, marginTop: 2, fontStyle: 'italic' }}>
          “{req.justificativa}”
        </div>
      </div>
      {acoes && <div style={{ display: 'flex', gap: 8 }}>{acoes}</div>}
    </div>
  )
}

export default function RequisicoesView({ requisicoes, secretarias, usuario, onAcao }) {
  const [ocupada, setOcupada] = useState(null) // id da requisição em processamento
  const [erroMsg, setErroMsg] = useState(null)

  async function agir(id, acao) {
    setOcupada(id); setErroMsg(null)
    try {
      await onAcao(id, acao)
    } catch (e) {
      setErroMsg(e.message)
    } finally {
      setOcupada(null)
    }
  }

  const vazio = (texto) => (
    <div style={{ ...card, padding: 24, color: theme.color.inkSoft, fontSize: 14 }}>{texto}</div>
  )

  // ---------- papel: SECRETARIA — acompanha as próprias requisições ----------
  if (usuario.papel === 'secretaria') {
    return (
      <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: 18, color: theme.color.ink }}>Minhas requisições</h2>
        {requisicoes.length === 0
          ? vazio('Você ainda não requisitou nada. Encontre itens ociosos no Catálogo e evite uma compra nova.')
          : requisicoes.map((r) => <LinhaRequisicao key={r.id} req={r} secretarias={secretarias} />)}
      </section>
    )
  }

  // ---------- papel: GESTOR — fila de decisão ----------
  const pendentes = requisicoes.filter((r) => r.status === 'pendente')
  const aprovadas = requisicoes.filter((r) => r.status === 'aprovada')
  const historico = requisicoes.filter((r) => ['transferida', 'recusada'].includes(r.status))

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {erroMsg && (
        <div style={{ ...card, padding: 12, borderColor: theme.color.danger, color: theme.color.danger, fontSize: 14, fontWeight: 600 }}>
          {erroMsg}
        </div>
      )}

      <div>
        <h2 style={{ margin: '0 0 10px', fontSize: 18, color: theme.color.ink }}>Pendentes de aprovação ({pendentes.length})</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {pendentes.length === 0
            ? vazio('Nenhuma requisição aguardando decisão.')
            : pendentes.map((r) => (
                <LinhaRequisicao key={r.id} req={r} secretarias={secretarias} acoes={
                  <>
                    <button style={btn('primario')} disabled={ocupada === r.id} onClick={() => agir(r.id, 'aprovar')}>Aprovar</button>
                    <button style={btn('perigo')} disabled={ocupada === r.id} onClick={() => agir(r.id, 'recusar')}>Recusar</button>
                  </>
                } />
              ))}
        </div>
      </div>

      <div>
        <h2 style={{ margin: '0 0 10px', fontSize: 18, color: theme.color.ink }}>Aprovadas — aguardando transferência ({aprovadas.length})</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {aprovadas.length === 0
            ? vazio('Nada aguardando transferência.')
            : aprovadas.map((r) => (
                <LinhaRequisicao key={r.id} req={r} secretarias={secretarias} acoes={
                  <button style={btn('primario')} disabled={ocupada === r.id} onClick={() => agir(r.id, 'confirmar_transferencia')}>
                    Confirmar transferência
                  </button>
                } />
              ))}
        </div>
      </div>

      <div>
        <h2 style={{ margin: '0 0 10px', fontSize: 18, color: theme.color.ink }}>Histórico ({historico.length})</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {historico.length === 0
            ? vazio('Sem movimentações concluídas ainda.')
            : historico.map((r) => <LinhaRequisicao key={r.id} req={r} secretarias={secretarias} />)}
        </div>
      </div>
    </section>
  )
}
