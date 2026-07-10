// api.js — ÚNICO ponto de acesso a dados do front (regra do ORGANOGRAMA.md §2).
//
// Cada função tem dois ramos: endpoint real do CONTRATO_API.md (via http.js)
// ou mock em memória. A integração é POR FUNÇÃO: o Set abaixo lista as que já
// batem no back real; as demais seguem no mock até o endpoint existir.
// VITE_USE_API=true no .env força TUDO para a API real (ignora a lista).
//
// A máquina de estados do mock espelha o §5 do contrato de propósito:
// serve de referência visual para o back implementar o mesmo comportamento.

import { ITENS, REQUISICOES, SECRETARIAS, CATEGORIAS, USUARIOS } from './mock.js'
import { http, dados, USAR_API, MOCK_TOTAL } from './http.js'
import { salvarSessao, limparSessao } from './sessao.js'

const FUNCOES_REAIS = new Set(['login', 'getItens', 'criarItem', 'getRequisicoes', 'criarRequisicao', 'atualizarRequisicao'])
const real = (fn) => !MOCK_TOTAL && (USAR_API || FUNCOES_REAIS.has(fn))

// Estado em memória (cópia mutável dos seeds)
let itens = ITENS.map((i) => ({ ...i }))
let requisicoes = REQUISICOES.map((r) => ({ ...r }))
let proximoIdReq = requisicoes.length + 1

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
    .map((r) => ({ ...r, item: derivar(itens.find((i) => i.id === r.item_id)) }))
    .sort((a, b) => b.id - a.id)
}

export async function criarRequisicao({ item_id, quantidade, justificativa, secretaria_solicitante_id, intencao_id = null }) {
  // Contrato §3.4: no back a secretaria solicitante vem do token, não do body
  if (real('criarRequisicao')) return http('/requisicoes', { method: 'POST', body: { item_id, quantidade, justificativa, intencao_id } })

  await espera()
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
  }
  requisicoes.push(nova)
  return nova
}

export async function atualizarRequisicao(id, acao) {
  if (real('atualizarRequisicao')) return http(`/requisicoes/${id}`, { method: 'PATCH', body: { acao } })

  await espera()
  const req = requisicoes.find((r) => r.id === id)
  if (!req) throw erro('NAO_ENCONTRADO', 'Requisição não encontrada.')
  const item = itens.find((i) => i.id === req.item_id)

  // Transições do §5 do contrato — pré-condição errada = 409 TRANSICAO_INVALIDA
  if (acao === 'aprovar') {
    if (req.status !== 'pendente') throw erro('TRANSICAO_INVALIDA', 'Só é possível aprovar requisição pendente.')
    const { saldo_livre } = derivar(item)
    if (req.quantidade > saldo_livre)
      throw erro('ITEM_INDISPONIVEL', `Saldo livre insuficiente (disponível: ${saldo_livre}).`)
    item.quantidade_reservada += req.quantidade
    req.status = 'aprovada'
  } else if (acao === 'recusar') {
    if (req.status !== 'pendente') throw erro('TRANSICAO_INVALIDA', 'Só é possível recusar requisição pendente.')
    req.status = 'recusada'
  } else if (acao === 'confirmar_transferencia') {
    if (req.status !== 'aprovada') throw erro('TRANSICAO_INVALIDA', 'Só é possível confirmar requisição aprovada.')
    item.quantidade -= req.quantidade
    item.quantidade_reservada -= req.quantidade
    req.status = 'transferida'
  } else {
    throw erro('VALIDACAO', `Ação desconhecida: ${acao}`)
  }
  req.atualizado_em = new Date().toISOString()
  return { ...req }
}

// ==================== INTERCEPTAÇÃO (Sprint 2 — Rafa) ====================

export async function criarIntencao(dadosIntencao) {
  // Devolve { intencao, matches } — matching síncrono (contrato §3.5)
  if (real('criarIntencao')) return http('/intencoes', { method: 'POST', body: dadosIntencao })
  throw erro('NAO_IMPLEMENTADO', 'Interceptação de compra: telas na Sprint 2.')
}

export async function getMatches(intencaoId) {
  if (real('getMatches')) return http(`/intencoes/${intencaoId}/matches`)
  throw erro('NAO_IMPLEMENTADO', 'Interceptação de compra: telas na Sprint 2.')
}

export async function converterIntencao(intencaoId, item_id, quantidade) {
  if (real('converterIntencao')) return http(`/intencoes/${intencaoId}/converter`, { method: 'POST', body: { item_id, quantidade } })
  throw erro('NAO_IMPLEMENTADO', 'Interceptação de compra: telas na Sprint 2.')
}

// =============================== KPIs ===============================

export async function getKpis() {
  if (real('getKpis')) return http('/kpis')

  await espera(80)
  const transferidas = requisicoes.filter((r) => r.status === 'transferida')
  const compras_evitadas_valor = transferidas.reduce((soma, r) => {
    const item = itens.find((i) => i.id === r.item_id)
    return soma + r.quantidade * (item?.valor_unitario_estimado || 0)
  }, 0)
  return {
    compras_evitadas_valor,
    itens_transferidos: transferidas.reduce((s, r) => s + r.quantidade, 0),
    requisicoes_concluidas: transferidas.length,
  }
}
