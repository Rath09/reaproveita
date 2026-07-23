import { theme, dataHora } from '../lib/theme.js'

// Trilha de auditoria da requisição: cada etapa com quem fez (nome · papel ·
// secretaria) e quando. Etapas futuras aparecem em cinza — a régua inteira do
// fluxo fica visível de uma vez, o que é meio caminho do pitch de auditabilidade.

const ROTULO = {
  solicitada: 'Solicitada',
  aprovada: 'Aprovada',
  recusada: 'Recusada',
  retirada_agendada: 'Retirada agendada',
  saida_confirmada: 'Saída confirmada',
  recebimento_confirmado: 'Recebimento confirmado',
}

// O que ainda falta, por status — é o "trilho cinza" à frente do último evento.
const FUTURO = {
  pendente: ['aprovada', 'saida_confirmada', 'recebimento_confirmado'],
  aprovada: ['saida_confirmada', 'recebimento_confirmado'],
  saida_confirmada: ['recebimento_confirmado'],
  transferida: [],
  recusada: [],
}

function Check({ cor }) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
      <path d="M1.5 5.5 L4 8 L8.5 2.5" stroke={cor} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Etapa({ titulo, subtitulo, quando, detalhes, tom, ultima }) {
  const cores = {
    feita:    { bolinha: theme.color.primary, borda: theme.color.primary, texto: theme.color.ink },
    recusada: { bolinha: theme.color.danger, borda: theme.color.danger, texto: theme.color.ink },
    futura:   { bolinha: 'transparent', borda: '#C7CFCA', texto: theme.color.inkSoft },
  }[tom]

  return (
    <li style={{ display: 'flex', gap: 12, position: 'relative', paddingBottom: ultima ? 0 : 18 }}>
      {/* trilho vertical */}
      {!ultima && (
        <span aria-hidden="true" style={{ position: 'absolute', left: 8, top: 20, bottom: 0, width: 2, background: tom === 'futura' ? '#E3E8E4' : '#CBE3D6' }} />
      )}
      <span aria-hidden="true" style={{
        width: 18, height: 18, borderRadius: '50%', flexShrink: 0, marginTop: 1,
        background: tom === 'futura' ? '#fff' : cores.bolinha,
        border: `2px solid ${cores.borda}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {tom === 'feita' && <Check cor="#fff" />}
        {tom === 'recusada' && <span style={{ color: '#fff', fontSize: 10, fontWeight: 800, lineHeight: 1 }}>✕</span>}
      </span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: cores.texto }}>{titulo}</div>
        {subtitulo && <div style={{ fontSize: 13, color: theme.color.inkSoft, marginTop: 1 }}>{subtitulo}</div>}
        {quando && <div style={{ fontSize: 12, color: theme.color.inkSoft, marginTop: 1, fontVariantNumeric: 'tabular-nums' }}>{quando}</div>}
        {detalhes && (
          <div style={{ fontSize: 12, color: theme.color.inkSoft, marginTop: 6, background: '#F3F6F4', borderRadius: 8, padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span>Retirada: <strong>{dataHora(detalhes.data_hora)}</strong> · {detalhes.local}</span>
            <span>Veículo: {detalhes.veiculo}</span>
            <span>Autorizado: {detalhes.pessoa.nome} (matrícula {detalhes.pessoa.matricula})</span>
          </div>
        )}
      </div>
    </li>
  )
}

export default function TimelineRequisicao({ requisicao }) {
  const eventos = requisicao.eventos ?? []
  const futuras = FUTURO[requisicao.status] ?? []

  return (
    <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {eventos.map((e, k) => (
        <Etapa
          key={`e${k}`}
          titulo={ROTULO[e.tipo] ?? e.tipo}
          subtitulo={`${e.ator.nome} (${e.ator.papel} · ${e.ator.secretaria})`}
          quando={dataHora(e.timestamp)}
          detalhes={e.tipo === 'retirada_agendada' ? e.detalhes : null}
          tom={e.tipo === 'recusada' ? 'recusada' : 'feita'}
          ultima={futuras.length === 0 && k === eventos.length - 1}
        />
      ))}
      {futuras.map((tipo, k) => (
        <Etapa
          key={`f${k}`}
          titulo={ROTULO[tipo]}
          tom="futura"
          ultima={k === futuras.length - 1}
        />
      ))}
    </ol>
  )
}
