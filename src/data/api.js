// api.js — ÚNICO ponto de acesso a dados do front (regra do ORGANOGRAMA.md §2).
//
// Hoje: implementa as regras do CONTRATO_API.md em memória, sobre o mock.
// Integração: trocar o miolo de cada função pelo fetch real do endpoint indicado
// no comentário `// TODO: API`. O restante do front NÃO muda.
//
// A máquina de estados abaixo espelha o §5 do contrato de propósito:
// serve de referência visual para o back implementar o mesmo comportamento.

import { ITENS, REQUISICOES, SECRETARIAS, CATEGORIAS, USUARIOS } from './mock.js'

// Estado em memória (cópia mutável dos seeds)
let itens = ITENS.map((i) => ({ ...i }))
let requisicoes = REQUISICOES.map((r) => ({ ...r }))
let proximoIdReq = requisicoes.length + 1

const espera = (ms = 250) => new Promise((res) => setTimeout(res, ms)) // simula rede

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

export async function login(/* email, senha */) {
  // TODO: API — POST /api/auth/login  (guardar access_token; enviar Authorization: Bearer)
  await espera()
  return { access_token: 'mock-token', usuario: USUARIOS.secretaria }
}

export function getUsuario(papel) {
  return USUARIOS[papel]
}

// ============================ REFERÊNCIAS ============================

export async function getSecretarias() {
  // TODO: API — GET /api/secretarias
  await espera(80)
  return SECRETARIAS
}

export async function getCategorias() {
  // TODO: API — GET /api/categorias
  await espera(80)
  return CATEGORIAS
}

// =============================== ITENS ===============================

export async function getItens({ q = '', categoria_id = '', status = '' } = {}) {
  // TODO: API — GET /api/itens?q=&categoria_id=&status=&page=&page_size=
  await espera()
  const termo = q.trim().toLowerCase()
  return itens.map(derivar).filter((i) => {
    if (termo && !(`${i.nome} ${i.patrimonio}`.toLowerCase().includes(termo))) return false
    if (categoria_id && i.categoria_id !== Number(categoria_id)) return false
    if (status && i.status !== status) return false
    return true
  })
}

export async function criarItem(/* dados */) {
  // TODO: API — POST /api/itens (papel: secretaria). Tela de cadastro: Sprint 1/2.
  throw erro('NAO_IMPLEMENTADO', 'Cadastro de item entra na integração com o back.')
}

// ============================ REQUISIÇÕES ============================

export async function getRequisicoes({ secretaria_solicitante_id = null } = {}) {
  // TODO: API — GET /api/requisicoes?status=&secretaria_solicitante_id=
  await espera()
  const lista = secretaria_solicitante_id
    ? requisicoes.filter((r) => r.secretaria_solicitante_id === secretaria_solicitante_id)
    : requisicoes
  // join de conveniência para a UI (o back real pode devolver expandido ou o front busca o item)
  return lista
    .map((r) => ({ ...r, item: derivar(itens.find((i) => i.id === r.item_id)) }))
    .sort((a, b) => b.id - a.id)
}

export async function criarRequisicao({ item_id, quantidade, justificativa, secretaria_solicitante_id, intencao_id = null }) {
  // TODO: API — POST /api/requisicoes
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
  // TODO: API — PATCH /api/requisicoes/:id  body: { acao }
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

export async function criarIntencao(/* dados */) {
  // TODO: API — POST /api/intencoes (devolve { intencao, matches })
  throw erro('NAO_IMPLEMENTADO', 'Interceptação de compra: telas na Sprint 2.')
}

export async function getMatches(/* intencaoId */) {
  // TODO: API — GET /api/intencoes/:id/matches
  throw erro('NAO_IMPLEMENTADO', 'Interceptação de compra: telas na Sprint 2.')
}

export async function converterIntencao(/* intencaoId, itemId, quantidade */) {
  // TODO: API — POST /api/intencoes/:id/converter
  throw erro('NAO_IMPLEMENTADO', 'Interceptação de compra: telas na Sprint 2.')
}

// =============================== KPIs ===============================

export async function getKpis() {
  // TODO: API — GET /api/kpis (autenticado) e GET /api/publico/kpis (painel público)
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
