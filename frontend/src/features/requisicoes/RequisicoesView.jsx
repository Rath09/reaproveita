import { useState } from 'react'
import { theme, card, btn, input, brl, rotuloStatusReq } from '../../lib/theme.js'
import Badge from '../../components/Badge.jsx'
import TimelineRequisicao from '../../components/TimelineRequisicao.jsx'

const rotulo = { fontSize: 13, color: theme.color.inkSoft, display: 'flex', flexDirection: 'column', gap: 4 }

// Agendamento de retirada (Bloco 8): o solicitante marca quando, quem e com qual
// veículo busca o material. Local pré-preenchido com o endereço da secretaria dona.
function FormAgendamento({ req, secretarias, ocupada, onAgendar, onCancelar }) {
  const enderecoOrigem = secretarias.find((s) => s.id === req.item.secretaria_id)?.endereco || ''
  const [dataHoraRetirada, setDataHoraRetirada] = useState('')
  const [local, setLocal] = useState(enderecoOrigem)
  const [veiculo, setVeiculo] = useState('')
  const [nomePessoa, setNomePessoa] = useState('')
  const [matricula, setMatricula] = useState('')

  const completo = dataHoraRetirada && local.trim() && veiculo.trim() && nomePessoa.trim() && matricula.trim()

  function salvar() {
    onAgendar(req.id, {
      data_hora: new Date(dataHoraRetirada).toISOString(),
      local: local.trim(),
      veiculo: veiculo.trim(),
      pessoa: { nome: nomePessoa.trim(), matricula: matricula.trim() },
    })
  }

  return (
    <div style={{ borderTop: `1px solid ${theme.color.line}`, marginTop: 14, paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <strong style={{ fontSize: 14, color: theme.color.azulPmf }}>Agendar retirada</strong>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
        <label style={rotulo}>
          Data e hora
          <input type="datetime-local" value={dataHoraRetirada} onChange={(e) => setDataHoraRetirada(e.target.value)} style={{ ...input, width: '100%', marginTop: 4 }} />
        </label>
        <label style={rotulo}>
          Local de retirada
          <input value={local} onChange={(e) => setLocal(e.target.value)} style={{ ...input, width: '100%', marginTop: 4 }} />
        </label>
        <label style={rotulo}>
          Veículo
          <input value={veiculo} onChange={(e) => setVeiculo(e.target.value)} placeholder="Ex.: Fiorino da frota — MLA-2E47" style={{ ...input, width: '100%', marginTop: 4 }} />
        </label>
        <label style={rotulo}>
          Pessoa autorizada
          <input value={nomePessoa} onChange={(e) => setNomePessoa(e.target.value)} placeholder="Nome completo" style={{ ...input, width: '100%', marginTop: 4 }} />
        </label>
        <label style={rotulo}>
          Matrícula
          <input value={matricula} onChange={(e) => setMatricula(e.target.value)} placeholder="Ex.: 12.345-6" style={{ ...input, width: '100%', marginTop: 4 }} />
        </label>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button style={btn('primario')} disabled={!completo || ocupada} onClick={salvar}>
          {ocupada ? 'Salvando…' : 'Salvar agendamento'}
        </button>
        <button style={btn('quieto')} onClick={onCancelar}>Cancelar</button>
      </div>
    </div>
  )
}

function LinhaRequisicao({ req, secretarias, acoes, formExtra = null }) {
  const [trilhaAberta, setTrilhaAberta] = useState(false)
  const solicitante = secretarias.find((s) => s.id === req.secretaria_solicitante_id)

  return (
    <div style={{ ...card, padding: 16 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ minWidth: 240, flex: 1 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <strong style={{ color: theme.color.ink, fontSize: 15 }}>{req.item.nome}</strong>
            <Badge tone={req.status}>{rotuloStatusReq[req.status]}</Badge>
          </div>
          <div style={{ fontSize: 13, color: theme.color.inkSoft, marginTop: 4 }}>
            {req.quantidade} {req.item.unidade} · solicitado por <strong>{solicitante?.sigla}</strong> · {brl(req.economia_evitada)} em compra evitada
          </div>
          <div style={{ fontSize: 13, color: theme.color.inkSoft, marginTop: 2, fontStyle: 'italic' }}>
            “{req.justificativa}”
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {acoes}
          <button style={{ ...btn('quieto'), padding: '6px 12px' }} onClick={() => setTrilhaAberta((v) => !v)}>
            {trilhaAberta ? 'Ocultar trilha' : 'Trilha de auditoria'}
          </button>
        </div>
      </div>

      {formExtra}

      {trilhaAberta && (
        <div style={{ borderTop: `1px solid ${theme.color.line}`, marginTop: 14, paddingTop: 14 }}>
          <TimelineRequisicao requisicao={req} />
        </div>
      )}
    </div>
  )
}

const vazio = (texto) => (
  <div style={{ ...card, padding: 24, color: theme.color.inkSoft, fontSize: 14 }}>{texto}</div>
)

export default function RequisicoesView({ requisicoes, secretarias, usuario, onAcao }) {
  const [ocupada, setOcupada] = useState(null) // id da requisição em processamento
  const [erroMsg, setErroMsg] = useState(null)
  const [agendandoId, setAgendandoId] = useState(null) // requisição com o form de retirada aberto

  async function agir(id, acao, detalhes = null) {
    setOcupada(id); setErroMsg(null)
    try {
      await onAcao(id, acao, detalhes)
    } catch (e) {
      setErroMsg(e.message)
    } finally {
      setOcupada(null)
    }
  }

  async function agendarRetirada(id, detalhes) {
    await agir(id, 'agendar_retirada', detalhes)
    setAgendandoId(null)
  }

  const erroBox = erroMsg && (
    <div style={{ ...card, padding: 12, borderColor: theme.color.danger, color: theme.color.danger, fontSize: 14, fontWeight: 600 }}>
      {erroMsg}
    </div>
  )

  // ---------- papel: SECRETARIA — acompanha e conclui as próprias requisições ----------
  if (usuario.papel === 'secretaria') {
    return (
      <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: 18, color: theme.color.ink }}>Minhas requisições</h2>
        {erroBox}
        {requisicoes.length === 0
          ? vazio('Você ainda não requisitou nada. Encontre itens ociosos no Catálogo e evite uma compra nova.')
          : requisicoes.map((r) => (
              <LinhaRequisicao
                key={r.id} req={r} secretarias={secretarias}
                acoes={
                  r.status === 'saida_confirmada' ? (
                    <button style={btn('primario')} disabled={ocupada === r.id} onClick={() => agir(r.id, 'confirmar_recebimento')}>
                      Confirmar recebimento
                    </button>
                  ) : r.status === 'aprovada' && !r.agendamento && agendandoId !== r.id ? (
                    <button style={btn('quieto')} onClick={() => setAgendandoId(r.id)}>Agendar retirada</button>
                  ) : null
                }
                formExtra={
                  agendandoId === r.id && r.status === 'aprovada' ? (
                    <FormAgendamento
                      req={r} secretarias={secretarias} ocupada={ocupada === r.id}
                      onAgendar={agendarRetirada} onCancelar={() => setAgendandoId(null)}
                    />
                  ) : null
                }
              />
            ))}
      </section>
    )
  }

  // ---------- papel: GESTOR — fila de decisão ----------
  // A fila mostra tudo (transparência entre secretarias), mas o gestor só decide
  // sobre itens da própria secretaria (§2/§3.4) — nas demais, a linha diz de quem
  // é a vez.
  const minhas = (r) => r.item.secretaria_id === usuario.secretaria_id
  const deOutra = (r) => {
    const dona = secretarias.find((s) => s.id === r.item.secretaria_id)
    return <span style={{ fontSize: 13, color: theme.color.inkSoft }}>Decisão da {dona?.sigla}</span>
  }

  const pendentes = requisicoes.filter((r) => r.status === 'pendente')
  const aprovadas = requisicoes.filter((r) => r.status === 'aprovada')
  const emTransito = requisicoes.filter((r) => r.status === 'saida_confirmada')
  const historico = requisicoes.filter((r) => ['transferida', 'recusada'].includes(r.status))

  const secao = (titulo, lista, textoVazio, acoesDe) => (
    <div>
      <h2 style={{ margin: '0 0 10px', fontSize: 18, color: theme.color.ink }}>{titulo} ({lista.length})</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {lista.length === 0
          ? vazio(textoVazio)
          : lista.map((r) => (
              <LinhaRequisicao key={r.id} req={r} secretarias={secretarias} acoes={acoesDe ? acoesDe(r) : null} />
            ))}
      </div>
    </div>
  )

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {erroBox}

      {secao('Pendentes de aprovação', pendentes, 'Nenhuma requisição aguardando decisão.', (r) =>
        minhas(r) ? (
          <>
            <button style={btn('primario')} disabled={ocupada === r.id} onClick={() => agir(r.id, 'aprovar')}>Aprovar</button>
            <button style={btn('perigo')} disabled={ocupada === r.id} onClick={() => agir(r.id, 'recusar')}>Recusar</button>
          </>
        ) : deOutra(r)
      )}

      {secao('Aprovadas — aguardando saída', aprovadas, 'Nada aguardando saída.', (r) =>
        minhas(r) ? (
          <button style={btn('primario')} disabled={ocupada === r.id} onClick={() => agir(r.id, 'confirmar_saida')}>
            Confirmar saída
          </button>
        ) : deOutra(r)
      )}

      {secao('Em trânsito — aguardando recebimento', emTransito, 'Nada em trânsito.', (r) => (
        <span style={{ fontSize: 13, color: theme.color.inkSoft }}>
          Recebimento pela {secretarias.find((s) => s.id === r.secretaria_solicitante_id)?.sigla}
        </span>
      ))}

      {secao('Histórico', historico, 'Sem movimentações concluídas ainda.', null)}
    </section>
  )
}
