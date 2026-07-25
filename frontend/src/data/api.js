// api.js — ÚNICO ponto de acesso a dados do front (regra do ORGANOGRAMA.md §2).
//
// Cada função tem dois ramos: endpoint real do CONTRATO_API.md (via http.js)
// ou mock em memória. A integração é POR FUNÇÃO: o Set abaixo lista as que já
// batem no back real; as demais seguem no mock até o endpoint existir.
// VITE_USE_API=true no .env força TUDO para a API real (ignora a lista).
//
// A máquina de estados do mock espelha o §5 do contrato de propósito:
// serve de referência visual para o back implementar o mesmo comportamento.

import { ITENS, REQUISICOES, SECRETARIAS, CATEGORIAS, USUARIOS, INTENCOES, ATORES } from './mock.js'
import { http, dados, USAR_API, MOCK_TOTAL } from './http.js'
import { salvarSessao, limparSessao } from './sessao.js'

const FUNCOES_REAIS = new Set(['login', 'getItens', 'criarItem', 'getRequisicoes', 'criarRequisicao', 'atualizarRequisicao'])
const real = (fn) => !MOCK_TOTAL && (USAR_API || FUNCOES_REAIS.has(fn))

// ---- estado da demo persistido em localStorage (todas as abas veem o mesmo) ----
// Sem back, o estado vive no navegador. Persistir resolve dois problemas de demo:
// o painel público, que abre em nova aba, passa a refletir as transações feitas no
// app interno; e um reload acidental no meio da gravação não zera nada. SEED_VERSAO
// invalida o cache quando o seed muda no código, para um deploy novo não servir
// dados velhos. As fotos de itens cadastrados (data URL) cabem no mesmo JSON.
const CHAVE_ESTADO = 'reaproveita.estado'
const SEED_VERSAO = 1

const clonar = (v) => JSON.parse(JSON.stringify(v))

function estadoSeed() {
  return {
    versao: SEED_VERSAO,
    itens: clonar(ITENS),
    requisicoes: clonar(REQUISICOES),
    intencoes: clonar(INTENCOES),
    proximoIdReq: REQUISICOES.length + 1,
    proximoIdInt: INTENCOES.length + 1,
    proximoIdItem: Math.max(...ITENS.map((i) => i.id)) + 1,
  }
}

function carregarEstado() {
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE_ESTADO))
    if (salvo && salvo.versao === SEED_VERSAO) return salvo
  } catch { /* ausente ou corrompido: cai no seed */ }
  return estadoSeed()
}

const _estado = carregarEstado()
let itens = _estado.itens
let requisicoes = _estado.requisicoes
let intencoes = _estado.intencoes
let proximoIdReq = _estado.proximoIdReq
let proximoIdInt = _estado.proximoIdInt
let proximoIdItem = _estado.proximoIdItem

function persistir() {
  try {
    localStorage.setItem(CHAVE_ESTADO, JSON.stringify({
      versao: SEED_VERSAO, itens, requisicoes, intencoes, proximoIdReq, proximoIdInt, proximoIdItem,
    }))
  } catch { /* localStorage cheio (foto grande?): segue só em memória nesta aba */ }
}

// Botão "Reiniciar dados da demo" (tela de login): volta ao seed e desloga, para
// a gravação começar do zero em qualquer aba.
export function resetarDemo() {
  try {
    localStorage.removeItem(CHAVE_ESTADO)
    limparSessao()
  } catch { /* ignore */ }
  location.reload()
}

const espera = (ms = 250) => new Promise((res) => setTimeout(res, ms)) // simula rede

// PoC sem controle de paginação na UI: pede a página cheia (contrato §1)
const PAGINA_CHEIA = { page: 1, page_size: 100 }

// ---- derivação do §5: saldo_livre e status calculados, nunca gravados à mão ----
function derivar(item) {
  const saldo_livre = item.quantidade - item.quantidade_reservada
  let status = 'disponivel'
  if (item.quantidade === 0) status = 'transferido'
  else if (saldo_livre === 0) status = 'reservado'
  return { ...item, saldo_livre, status }
}

const erro = (codigo, mensagem) => Object.assign(new Error(mensagem), { codigo })

// ---- economia auditável: uma única regra para toda a aplicação ----
// Sempre preço de referência do item no catálogo × quantidade atendida. O valor
// que o usuário digitava na intenção não entra em cálculo nenhum: quem registra
// a intenção não pode escolher o tamanho da própria economia. Match, card de
// requisição e KPI usam esta função — por construção não têm como divergir.
const economiaDe = (item, quantidade) => (item?.valor_unitario_estimado ?? 0) * quantidade

// ---- trilha de auditoria: todo passo do §5 registra quem/quando ----
const atorDoUsuario = (usuario) => ({
  nome: usuario.nome,
  papel: usuario.cargo || (usuario.papel === 'gestor' ? 'Gestor' : 'Almoxarife'),
  secretaria: SECRETARIAS.find((s) => s.id === usuario.secretaria_id)?.nome ?? 'Almoxarifado central',
})

function registrarEvento(req, tipo, usuario, detalhes = null) {
  req.eventos.push({
    tipo,
    ator: atorDoUsuario(usuario),
    timestamp: new Date().toISOString(),
    ...(detalhes ? { detalhes } : {}),
  })
}

// =============================== AUTH ===============================

// Retorno do contrato §2: { access_token, token_type, expires_in, usuario }.
// A sessão fica persistida (sessao.js) e o http.js passa a enviar o Bearer.
export async function login(email, senha) {
  if (real('login')) {
    const resp = await http('/auth/login', { method: 'POST', body: { email, senha } })
    salvarSessao(resp)
    return resp
  }

  await espera()
  const usuario = Object.values(USUARIOS).find((u) => u.email === email.trim().toLowerCase())
  if (!usuario || !senha) throw erro('NAO_AUTENTICADO', 'E-mail ou senha inválidos.') // espelha o 401
  const resp = { access_token: 'mock-token', token_type: 'bearer', expires_in: 28800, usuario }
  salvarSessao(resp)
  return resp
}

export function logout() {
  limparSessao()
}

export async function healthcheck() {
  return http('/health') // sempre real: é o teste de fumaça da integração
}

// ============================ REFERÊNCIAS ============================

export async function getSecretarias() {
  if (real('getSecretarias')) return dados(await http('/secretarias'))
  await espera(80)
  return SECRETARIAS
}

export async function getCategorias() {
  if (real('getCategorias')) return dados(await http('/categorias'))
  await espera(80)
  return CATEGORIAS
}

// =============================== ITENS ===============================

// Filtros do §3.3 aplicados sobre a lista (o mesmo critério nos dois ramos)
function filtrar(lista, { q = '', categoria_id = '', status = '' }) {
  const termo = q.trim().toLowerCase()
  return lista.filter((i) => {
    if (termo && !(`${i.nome} ${i.patrimonio}`.toLowerCase().includes(termo))) return false
    if (categoria_id && i.categoria_id !== Number(categoria_id)) return false
    if (status && i.status !== status) return false
    return true
  })
}

export async function getItens({ q = '', categoria_id = '', status = '' } = {}) {
  if (real('getItens')) {
    const lista = dados(await http('/itens', { query: { q, categoria_id, status, ...PAGINA_CHEIA } }))
    // PALIATIVO: o back ainda não aplica os filtros do §3.3 (só pagina) — o front
    // filtra client-side até lá; a query acima já vai no formato do contrato
    return filtrar(lista, { q, categoria_id, status })
  }

  await espera()
  return filtrar(itens.map(derivar), { q, categoria_id, status })
}

export async function criarItem(dadosItem) {
  // Contrato §3.3: body sem id/status/saldo_livre/quantidade_reservada/criado_em;
  // secretaria_id vem do token. Tela de cadastro: Sprint 1/2.
  if (real('criarItem')) return http('/itens', { method: 'POST', body: dadosItem })
  throw erro('NAO_IMPLEMENTADO', 'Cadastro de item entra na integração com o back.')
}

// Cadastro de item ocioso pela própria secretaria (Bloco 3.5). Entra no catálogo na
// hora, fica disponível para interceptação/transferência e passa a contar nos KPIs
// quando transferido — é dado de primeira classe, persistido como o resto.
// `secretaria_id` vem do usuário logado (o item pertence à secretaria dele).
export async function criarItemOcioso({
  nome, descricao = '', categoria_id, unidade = 'un', quantidade,
  estado_conservacao = 'bom', patrimonio = null, valor_unitario_estimado,
  paradoDesdeMeses = null, imageUrl = null, secretaria_id,
}) {
  if (real('criarItemOcioso')) return http('/itens', { method: 'POST', body: { nome, descricao, categoria_id, unidade, quantidade, estado_conservacao, patrimonio, valor_unitario_estimado, paradoDesdeMeses } })

  await espera()
  if (!nome?.trim()) throw erro('VALIDACAO', 'Informe o nome do item.')
  if (!categoria_id) throw erro('VALIDACAO', 'Escolha a categoria.')
  if (!(Number(quantidade) >= 1)) throw erro('VALIDACAO', 'Quantidade deve ser ao menos 1.')
  if (!(Number(valor_unitario_estimado) > 0)) throw erro('VALIDACAO', 'Informe o preço de referência.')

  const novo = {
    id: proximoIdItem++,
    nome: nome.trim(),
    descricao: descricao.trim(),
    patrimonio: patrimonio?.trim() || null, // vazio = material de consumo
    categoria_id: Number(categoria_id),
    secretaria_id,
    quantidade: Number(quantidade),
    quantidade_reservada: 0,
    estado_conservacao,
    valor_unitario_estimado: Number(valor_unitario_estimado),
    unidade: unidade.trim() || 'un',
    paradoDesdeMeses: paradoDesdeMeses ?? null,
    imageUrl: imageUrl || null,
    catmat_code: null,
    criado_em: new Date().toISOString(),
  }
  itens.push(novo)
  persistir()
  return derivar(novo)
}

// ============================ REQUISIÇÕES ============================

export async function getRequisicoes({ secretaria_solicitante_id = null, status = '' } = {}) {
  if (real('getRequisicoes')) {
    const lista = dados(await http('/requisicoes', { query: { status, secretaria_solicitante_id, ...PAGINA_CHEIA } }))
    // O contrato não expande o item dentro da requisição — a UI precisa dele, então o front busca
    const ids = [...new Set(lista.map((r) => r.item_id))]
    const porId = new Map(await Promise.all(ids.map(async (id) => [id, await http(`/itens/${id}`)])))
    return lista.map((r) => ({ ...r, item: porId.get(r.item_id) })).sort((a, b) => b.id - a.id)
  }

  await espera()
  const lista = secretaria_solicitante_id
    ? requisicoes.filter((r) => r.secretaria_solicitante_id === secretaria_solicitante_id)
    : requisicoes
  return lista
    .map((r) => {
      const item = derivar(itens.find((i) => i.id === r.item_id))
      // economia_evitada vem daqui pronta: a view não recalcula, então o card e o
      // KPI são o mesmo número por construção
      return { ...r, item, economia_evitada: economiaDe(item, r.quantidade) }
    })
    .sort((a, b) => b.id - a.id)
}

// Lógica pura de criação (sem `espera`, sem checar `real`) — reaproveitada por
// criarRequisicao() e por converterIntencao() (§3.5), que precisa dela 100% mock
// independente do que FUNCOES_REAIS diga sobre criarRequisicao.
// `solicitante` assina o evento "solicitada" da trilha de auditoria.
function criarRequisicaoMock({ item_id, quantidade, justificativa, secretaria_solicitante_id, intencao_id = null, solicitante }) {
  const item = itens.find((i) => i.id === item_id)
  if (!item) throw erro('NAO_ENCONTRADO', 'Item não encontrado.')
  if (item.secretaria_id === secretaria_solicitante_id)
    throw erro('VALIDACAO', 'Não é possível requisitar um item da própria secretaria.')
  const { saldo_livre } = derivar(item)
  if (quantidade < 1 || quantidade > saldo_livre)
    throw erro('ITEM_INDISPONIVEL', `Saldo livre insuficiente (disponível: ${saldo_livre}).`)
  const agora = new Date().toISOString()
  const nova = {
    id: proximoIdReq++, item_id, secretaria_solicitante_id, quantidade,
    justificativa, status: 'pendente', intencao_id, criado_em: agora, atualizado_em: agora,
    eventos: [], agendamento: null,
  }
  registrarEvento(nova, 'solicitada', solicitante ?? { ...ATORES[secretaria_solicitante_id].almoxarife, papel: 'secretaria', secretaria_id: secretaria_solicitante_id })
  requisicoes.push(nova)
  persistir()
  return nova
}

export async function criarRequisicao({ item_id, quantidade, justificativa, secretaria_solicitante_id, intencao_id = null, solicitante }) {
  // Contrato §3.4: no back a secretaria solicitante vem do token, não do body
  if (real('criarRequisicao')) return http('/requisicoes', { method: 'POST', body: { item_id, quantidade, justificativa, intencao_id } })

  await espera()
  return criarRequisicaoMock({ item_id, quantidade, justificativa, secretaria_solicitante_id, intencao_id, solicitante })
}

// Quem pode o quê (§2/§3.4): gestor da secretaria DONA do item aprova, recusa e
// confirma a saída; a secretaria SOLICITANTE agenda a retirada e confirma o
// recebimento. `usuario` ausente (chamada antiga) pula a checagem — só a demo usa.
function exigir(cond, mensagem) {
  if (!cond) throw erro('SEM_PERMISSAO', mensagem)
}

export async function atualizarRequisicao(id, acao, usuario = null, detalhes = null) {
  if (real('atualizarRequisicao')) return http(`/requisicoes/${id}`, { method: 'PATCH', body: { acao } })

  await espera()
  const req = requisicoes.find((r) => r.id === id)
  if (!req) throw erro('NAO_ENCONTRADO', 'Requisição não encontrada.')
  const item = itens.find((i) => i.id === req.item_id)
  const ehGestorDaOrigem = !usuario || (usuario.papel === 'gestor' && usuario.secretaria_id === item.secretaria_id)
  const ehSolicitante = !usuario || usuario.secretaria_id === req.secretaria_solicitante_id

  // Transições do §5 do contrato — pré-condição errada = 409 TRANSICAO_INVALIDA
  if (acao === 'aprovar') {
    exigir(ehGestorDaOrigem, 'Apenas o gestor da secretaria dona do item pode aprovar.')
    if (req.status !== 'pendente') throw erro('TRANSICAO_INVALIDA', 'Só é possível aprovar requisição pendente.')
    const { saldo_livre } = derivar(item)
    if (req.quantidade > saldo_livre)
      throw erro('ITEM_INDISPONIVEL', `Saldo livre insuficiente (disponível: ${saldo_livre}).`)
    item.quantidade_reservada += req.quantidade
    req.status = 'aprovada'
  } else if (acao === 'recusar') {
    exigir(ehGestorDaOrigem, 'Apenas o gestor da secretaria dona do item pode recusar.')
    if (req.status !== 'pendente') throw erro('TRANSICAO_INVALIDA', 'Só é possível recusar requisição pendente.')
    req.status = 'recusada'
  } else if (acao === 'agendar_retirada') {
    exigir(ehSolicitante, 'Apenas a secretaria solicitante agenda a retirada.')
    if (req.status !== 'aprovada') throw erro('TRANSICAO_INVALIDA', 'Só é possível agendar retirada de requisição aprovada.')
    req.agendamento = detalhes // o status não muda: agendar é um marco, não um estado
  } else if (acao === 'confirmar_saida') {
    exigir(ehGestorDaOrigem, 'Apenas o gestor da secretaria dona do item confirma a saída.')
    if (req.status !== 'aprovada') throw erro('TRANSICAO_INVALIDA', 'Só é possível confirmar a saída de requisição aprovada.')
    item.quantidade -= req.quantidade // o material deixou o estoque da origem
    item.quantidade_reservada -= req.quantidade
    req.status = 'saida_confirmada'
  } else if (acao === 'confirmar_recebimento') {
    exigir(ehSolicitante, 'Apenas a secretaria solicitante confirma o recebimento.')
    if (req.status !== 'saida_confirmada') throw erro('TRANSICAO_INVALIDA', 'Só é possível confirmar o recebimento após a saída.')
    req.status = 'transferida' // concluída — entra nos KPIs
  } else {
    throw erro('VALIDACAO', `Ação desconhecida: ${acao}`)
  }

  const TIPO_EVENTO = { aprovar: 'aprovada', recusar: 'recusada', agendar_retirada: 'retirada_agendada', confirmar_saida: 'saida_confirmada', confirmar_recebimento: 'recebimento_confirmado' }
  if (usuario) registrarEvento(req, TIPO_EVENTO[acao], usuario, detalhes)
  req.atualizado_em = new Date().toISOString()
  persistir()
  return { ...req }
}

// ==================== INTERCEPTAÇÃO (Sprint 2 — Rafa) ====================
// O back ainda não tem /intencoes: tudo aqui roda 100% no mock. Os ramos reais
// já estão escritos (§3.5) mas desligados — não entram em FUNCOES_REAIS até o
// endpoint existir de verdade, pra não quebrar a demo se USAR_API virar true.

const normalizar = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

// aproximação JS do difflib.SequenceMatcher.ratio() (§4):
// coeficiente de Dice sobre bigramas de caracteres — 0 a 1
function simTexto(a, b) {
  const bigramas = (s) => {
    const n = normalizar(s).replace(/\s+/g, ' ')
    const grams = new Map()
    for (let i = 0; i < n.length - 1; i++) {
      const g = n.slice(i, i + 2)
      grams.set(g, (grams.get(g) || 0) + 1)
    }
    return grams
  }
  const ga = bigramas(a), gb = bigramas(b)
  if (!ga.size || !gb.size) return 0
  let inter = 0
  for (const [g, c] of ga) inter += Math.min(c, gb.get(g) || 0)
  let ta = 0, tb = 0
  for (const c of ga.values()) ta += c
  for (const c of gb.values()) tb += c
  const dice = (2 * inter) / (ta + tb)
  // Bônus de token exato: bigrama de caractere sozinho casa "cadeira" com "madeira"/"estante".
  // Palavras inteiras (>=4 chars) da busca presentes no item são sinal forte; sem isso, ruído de
  // mesma categoria passava o corte (estante aparecia para "cadeira"). Ver CONTRATO_API.md §4.
  const toks = normalizar(a).split(/\s+/).filter((t) => t.length >= 4)
  if (!toks.length) return dice
  const alvo = ` ${normalizar(b)} `
  const tokenCob = toks.filter((t) => alvo.includes(t)).length / toks.length
  return Math.max(dice, 0.35 * dice + 0.65 * tokenCob)
}

function calcularMatches(intencao) {
  return itens.map(derivar)
    .filter((i) => i.categoria_id === intencao.categoria_id && i.saldo_livre > 0 && i.secretaria_id !== intencao.secretaria_id)
    .map((item) => {
      const cobertura = Math.min(1, item.saldo_livre / intencao.quantidade)
      return {
        item, cobertura,
        score: 0.7 * simTexto(intencao.descricao, `${item.nome} ${item.descricao}`) + 0.3 * cobertura,
        economia_estimada: economiaDe(item, Math.min(item.saldo_livre, intencao.quantidade)),
      }
    })
    .filter((m) => m.score >= 0.35)
    .sort((a, b) => b.score - a.score || b.cobertura - a.cobertura || a.item.criado_em.localeCompare(b.item.criado_em))
    .slice(0, 10)
}

// Sem valor_unitario_estimado: o formulário não pergunta mais o preço (a economia
// vem do catálogo, não de quem registra a intenção).
export async function criarIntencao({ descricao, categoria_id, quantidade, catmat_code = null, secretaria_id }) {
  // Devolve { intencao, matches } — matching síncrono (contrato §3.5)
  if (real('criarIntencao'))
    return http('/intencoes', { method: 'POST', body: { descricao, categoria_id, quantidade, catmat_code } })

  // Mais lenta que as demais de propósito: dá tempo do skeleton contar a história
  // de "varrendo o estoque das secretarias" (Bloco 5).
  await espera(700)
  const intencao = {
    id: proximoIdInt++, secretaria_id, descricao, categoria_id, quantidade,
    catmat_code, status: 'aberta', quantidade_atendida: 0,
    motivo_compra: null, criado_em: new Date().toISOString(),
  }
  intencoes.push(intencao)
  persistir()
  // Cópia: sem ela, o objeto devolvido é a MESMA referência guardada no estado do
  // front; uma conversão posterior muta `quantidade_atendida` no array e o front
  // contaria a quantidade duas vezes.
  return { intencao: { ...intencao }, matches: calcularMatches(intencao) }
}

export async function getMatches(intencaoId) {
  if (real('getMatches')) return http(`/intencoes/${intencaoId}/matches`)

  await espera()
  const intencao = intencoes.find((i) => i.id === intencaoId)
  if (!intencao) throw erro('NAO_ENCONTRADO', 'Intenção não encontrada.')
  return calcularMatches(intencao) // re-executa: o estoque muda entre consultas
}

export async function converterIntencao(intencaoId, item_id, quantidade) {
  if (real('converterIntencao')) return http(`/intencoes/${intencaoId}/converter`, { method: 'POST', body: { item_id, quantidade } })

  await espera()
  const intencao = intencoes.find((i) => i.id === intencaoId)
  if (!intencao) throw erro('NAO_ENCONTRADO', 'Intenção não encontrada.')
  const requisicao = criarRequisicaoMock({
    item_id, quantidade,
    justificativa: `Atende intenção de compra #${intencaoId} — ${intencao.descricao}`,
    secretaria_solicitante_id: intencao.secretaria_id,
    intencao_id: intencaoId,
  })
  intencao.quantidade_atendida += quantidade
  if (intencao.quantidade_atendida >= intencao.quantidade) intencao.status = 'convertida'
  persistir() // criarRequisicaoMock já persistiu a requisição; aqui grava a intenção mutada
  return requisicao
}

export async function manterCompra(intencaoId, motivo) {
  if (real('manterCompra'))
    return http(`/intencoes/${intencaoId}`, { method: 'PATCH', body: { status: 'mantida_compra', motivo_compra: motivo } })

  await espera()
  const intencao = intencoes.find((i) => i.id === intencaoId)
  if (!intencao) throw erro('NAO_ENCONTRADO', 'Intenção não encontrada.')
  intencao.status = 'mantida_compra'
  intencao.motivo_compra = motivo
  persistir()
  return { ...intencao }
}

export async function getIntencoes({ secretaria_id = null } = {}) {
  if (real('getIntencoes')) return dados(await http('/intencoes', { query: { secretaria_id, ...PAGINA_CHEIA } }))

  await espera()
  const lista = secretaria_id ? intencoes.filter((i) => i.secretaria_id === secretaria_id) : intencoes
  // Cópias (mesmo motivo de criarIntencao): o front não pode guardar referências
  // do array interno, que mutam a cada conversão.
  return lista.map((i) => ({ ...i })).sort((a, b) => b.id - a.id)
}

// ====================== KPIs e agregação do programa ======================

// UMA função agrega o seed para tudo que exibe número: KPIs do header, KPIs do
// painel público e os gráficos. Filtros opcionais (categoria e período em dias)
// recalculam o conjunto inteiro — por construção, app interno e painel público
// nunca divergem: são a mesma agregação com filtros vazios.
function agregarPrograma({ categoria_id = null, periodo_dias = null } = {}) {
  const cat = categoria_id ? Number(categoria_id) : null
  const corte = periodo_dias ? new Date(Date.now() - periodo_dias * 86400000).toISOString() : null

  const itemDe = (r) => itens.find((i) => i.id === r.item_id)
  const transferidas = requisicoes.filter((r) =>
    r.status === 'transferida' &&
    (!corte || r.atualizado_em >= corte) &&
    (!cat || itemDe(r).categoria_id === cat))
  const intencoesFiltradas = intencoes.filter((i) =>
    (!corte || i.criado_em >= corte) && (!cat || i.categoria_id === cat))

  // Patrimônio ocioso ainda no catálogo (não é economia realizada — é o potencial à
  // disposição da rede). Cadastrar um item ocioso o aumenta na hora; período não se
  // aplica (é estoque atual), categoria sim.
  const valor_ocioso_disponivel = itens
    .filter((i) => (i.paradoDesdeMeses ?? 0) >= 6 && (i.quantidade - i.quantidade_reservada) > 0 && (!cat || i.categoria_id === cat))
    .reduce((s, i) => s + i.valor_unitario_estimado * (i.quantidade - i.quantidade_reservada), 0)

  const kpis = {
    compras_evitadas_valor: transferidas.reduce((s, r) => s + economiaDe(itemDe(r), r.quantidade), 0),
    itens_transferidos: transferidas.reduce((s, r) => s + r.quantidade, 0),
    requisicoes_concluidas: transferidas.length,
    intencoes_total: intencoesFiltradas.length,
    intencoes_convertidas: intencoesFiltradas.filter((i) => i.status === 'convertida').length,
    valor_ocioso_disponivel,
  }
  kpis.taxa_interceptacao = kpis.intencoes_total ? kpis.intencoes_convertidas / kpis.intencoes_total : 0

  // --- por secretaria: economia de quem evitou a compra e fluxo enviado × recebido (R$) ---
  const porSecretaria = SECRETARIAS.map((s) => {
    const recebidos = transferidas.filter((r) => r.secretaria_solicitante_id === s.id)
      .reduce((soma, r) => soma + economiaDe(itemDe(r), r.quantidade), 0)
    const enviados = transferidas.filter((r) => itemDe(r).secretaria_id === s.id)
      .reduce((soma, r) => soma + economiaDe(itemDe(r), r.quantidade), 0)
    return { sigla: s.sigla, nome: s.nome, economia: recebidos, enviados, recebidos }
  })

  // --- economia acumulada por semana, na janela do filtro (padrão: 90 dias) ---
  const janelaDias = periodo_dias || 90
  const inicio = new Date(Date.now() - janelaDias * 86400000)
  const semanas = []
  for (let t = inicio.getTime(); t <= Date.now(); t += 7 * 86400000) {
    const fim = new Date(Math.min(t + 7 * 86400000, Date.now()))
    semanas.push({ de: new Date(t), ate: fim })
  }
  let acumulado = 0
  const economiaSemanal = semanas.map(({ de, ate }) => {
    const daSemana = transferidas.filter((r) => r.atualizado_em >= de.toISOString() && r.atualizado_em < ate.toISOString())
    acumulado += daSemana.reduce((s, r) => s + economiaDe(itemDe(r), r.quantidade), 0)
    return { semana: ate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }), economia: acumulado }
  })

  // --- patrimônio × material de consumo: quem tem nº de patrimônio é bem durável ---
  const patrimonio = transferidas.filter((r) => itemDe(r).patrimonio)
    .reduce((s, r) => s + economiaDe(itemDe(r), r.quantidade), 0)
  const consumo = kpis.compras_evitadas_valor - patrimonio

  return {
    kpis,
    economiaPorSecretaria: porSecretaria.filter((s) => s.economia > 0).sort((a, b) => b.economia - a.economia),
    fluxoPorSecretaria: porSecretaria,
    economiaSemanal,
    patrimonioConsumo: [
      { nome: 'Patrimônio', valor: patrimonio },
      { nome: 'Material de consumo', valor: consumo },
    ],
  }
}

export async function getKpis() {
  if (real('getKpis')) return http('/kpis')
  await espera(80)
  return agregarPrograma().kpis
}

export async function getKpisPublico() {
  if (real('getKpisPublico')) return http('/publico/kpis')
  await espera(80)
  return agregarPrograma().kpis
}

// Painel de transparência (§7): KPIs + gráficos, com filtros
export async function getPainelPublico(filtros = {}) {
  if (real('getPainelPublico')) return http('/publico/painel', { query: filtros })
  await espera(120)
  return agregarPrograma(filtros)
}
