// theme.js — tokens de design do Reaproveita.
// Identidade: serviço público + reuso. Verde profundo institucional como cor de ação,
// papel frio de fundo, âmbar para "reservado". A assinatura visual é o contador
// de compra evitada (número grande tabular, no App/Stat).

export const theme = {
  font: `'Archivo', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`,

  color: {
    primary: '#1B7A53',      // verde-reuso (ações, marca, KPI)
    primaryDark: '#10513A',
    ink: '#1C2321',          // texto principal
    inkSoft: '#5C6662',      // texto secundário
    paper: '#F5F7F5',        // fundo da página
    surface: '#FFFFFF',      // cartões
    line: '#E1E6E2',         // bordas
    danger: '#B3453A',
    amber: '#B7791F',
  },

  // Tons semânticos usados pelo Badge (status do item, status da requisição, estado de conservação)
  tones: {
    neutro:      { bg: '#EEF1EE', fg: '#5C6662' },
    disponivel:  { bg: '#DFF0E7', fg: '#10513A' },
    reservado:   { bg: '#F7ECD8', fg: '#8A5B14' },
    transferido: { bg: '#E5E7EB', fg: '#4B5563' },
    pendente:    { bg: '#E3EBF8', fg: '#1D4ED8' },
    aprovada:    { bg: '#DFF0E7', fg: '#10513A' },
    recusada:    { bg: '#F6E3E1', fg: '#8F332A' },
    transferida: { bg: '#E5E7EB', fg: '#4B5563' },
  },

  radius: { card: 12, control: 8 },
  shadow: '0 1px 2px rgba(28,35,33,.06), 0 4px 14px rgba(28,35,33,.05)',
}

// ---- helpers de estilo (o protótipo usa estilo inline; sem framework CSS) ----

export const card = {
  background: theme.color.surface,
  border: `1px solid ${theme.color.line}`,
  borderRadius: theme.radius.card,
  boxShadow: theme.shadow,
}

export function btn(variant = 'primario') {
  const base = {
    fontFamily: theme.font, fontSize: 14, fontWeight: 600,
    padding: '9px 16px', borderRadius: theme.radius.control,
    cursor: 'pointer', border: '1px solid transparent',
  }
  if (variant === 'primario') return { ...base, background: theme.color.primary, color: '#fff' }
  if (variant === 'perigo') return { ...base, background: '#fff', color: theme.color.danger, borderColor: theme.color.danger }
  return { ...base, background: '#fff', color: theme.color.ink, borderColor: theme.color.line } // 'quieto'
}

export const input = {
  fontFamily: theme.font, fontSize: 14, color: theme.color.ink,
  padding: '9px 12px', borderRadius: theme.radius.control,
  border: `1px solid ${theme.color.line}`, background: '#fff', outlineColor: theme.color.primary,
}

export const brl = (n) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n || 0)

export const rotuloEstado = {
  novo: 'Novo', otimo: 'Ótimo', bom: 'Bom', regular: 'Regular', ruim: 'Ruim',
}

export const rotuloStatusItem = {
  disponivel: 'Disponível', reservado: 'Reservado', transferido: 'Transferido',
}

export const rotuloStatusReq = {
  pendente: 'Pendente', aprovada: 'Aprovada', recusada: 'Recusada', transferida: 'Transferida',
}
