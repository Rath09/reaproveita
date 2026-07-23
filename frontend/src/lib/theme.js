// theme.js — tokens de design do Reaproveita (identidade PMF).
// Sóbrio e institucional: azul profundo da prefeitura para estrutura, ciano para
// interação, laranja APENAS no CTA principal, e o verde reservado com
// exclusividade a valores monetários economizados — nenhum outro uso.

export const theme = {
  font: `'Archivo', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`,

  color: {
    azulPmf: '#0D2C54',      // header, títulos, navegação, texto de destaque
    cianoPmf: '#1E8FC5',     // links, tab ativa, interativos, série principal dos gráficos
    cianoEscuro: '#12689D',  // hover/contraste AA do ciano sobre branco
    laranjaPmf: '#F07020',   // SÓ o CTA principal e micro-destaques
    laranjaEscuro: '#C25712',// hover do CTA / laranja com contraste AA
    verdeEconomia: '#1B7A53',    // exclusivo: dinheiro economizado
    verdeEconomiaDark: '#10513A',

    ink: '#1C2321',          // texto principal
    inkSoft: '#5A6268',      // texto secundário (AA sobre branco e sobre paper)
    paper: '#F4F6F8',        // fundo da página (neutro frio, casa com o azul)
    surface: '#FFFFFF',      // cartões
    line: '#DFE4E8',         // bordas
    danger: '#B3453A',
    amber: '#8A5B14',

    // aliases legados — apontam para os tokens novos para nenhum componente quebrar;
    // migrar os usos aos poucos e remover
    primary: '#1B7A53',
    primaryDark: '#0D2C54',
  },

  // Tons semânticos usados pelo Badge (status do item, da requisição, conservação)
  tones: {
    neutro:      { bg: '#EDF0F2', fg: '#4A5258' },
    disponivel:  { bg: '#DFF0E7', fg: '#0F4E37' },
    reservado:   { bg: '#F7ECD8', fg: '#7A4E10' },
    transferido: { bg: '#E5E7EB', fg: '#4B5563' },
    pendente:    { bg: '#E1EDF6', fg: '#0F5C8C' },
    aprovada:    { bg: '#DFF0E7', fg: '#0F4E37' },
    recusada:    { bg: '#F6E3E1', fg: '#8F332A' },
    saida_confirmada: { bg: '#DEEDF6', fg: '#12689D' },
    transferida: { bg: '#E5E7EB', fg: '#374151' },
    aberta:         { bg: '#E1EDF6', fg: '#0F5C8C' },
    convertida:     { bg: '#DFF0E7', fg: '#0F4E37' },
    mantida_compra: { bg: '#F7ECD8', fg: '#7A4E10' },
    ocioso:         { bg: '#FDF0D5', fg: '#7A4E10' },
  },

  radius: { card: 12, control: 8 },
  shadow: '0 1px 2px rgba(13,44,84,.06), 0 4px 14px rgba(13,44,84,.06)',
  shadowHover: '0 2px 4px rgba(13,44,84,.08), 0 10px 24px rgba(13,44,84,.10)',
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
  if (variant === 'primario') return { ...base, background: theme.color.cianoEscuro, color: '#fff' }
  if (variant === 'cta') return { ...base, background: theme.color.laranjaPmf, color: '#fff', fontWeight: 700 }
  if (variant === 'perigo') return { ...base, background: '#fff', color: theme.color.danger, borderColor: theme.color.danger }
  return { ...base, background: '#fff', color: theme.color.ink, borderColor: theme.color.line } // 'quieto'
}

export const input = {
  fontFamily: theme.font, fontSize: 14, color: theme.color.ink,
  padding: '9px 12px', borderRadius: theme.radius.control, boxSizing: 'border-box',
  border: `1px solid ${theme.color.line}`, background: '#fff', outlineColor: theme.color.cianoPmf,
}

export const brl = (n) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n || 0)

// dd/mm/aaaa hh:mm — formato único de data/hora do app
export const dataHora = (iso) =>
  new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  }).replace(',', '')

export const rotuloEstado = {
  novo: 'Novo', otimo: 'Ótimo', bom: 'Bom', regular: 'Regular', ruim: 'Ruim',
}

export const rotuloStatusItem = {
  disponivel: 'Disponível', reservado: 'Reservado', transferido: 'Transferido',
}

export const rotuloStatusReq = {
  pendente: 'Pendente', aprovada: 'Aprovada', recusada: 'Recusada',
  saida_confirmada: 'Saída confirmada', transferida: 'Concluída',
}

export const rotuloStatusIntencao = {
  aberta: 'Aberta', convertida: 'Convertida', mantida_compra: 'Compra mantida',
}
