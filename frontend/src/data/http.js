// http.js — cliente HTTP da camada de API. Só api.js importa daqui.
//
// Implementa as convenções do CONTRATO_API.md:
//   §1  base URL /api · query de filtros/paginação
//   §2  Authorization: Bearer <token>
//   §6  envelope de erro { erro: { codigo, mensagem } } → Error com .codigo

import { getToken, limparSessao } from './sessao.js'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Flag de integração (PLANEJAMENTO.md, riscos): mock por padrão; a API real
// entra por função quando VITE_USE_API=true no .env.
export const USAR_API = import.meta.env.VITE_USE_API === 'true'

const erro = (codigo, mensagem) => Object.assign(new Error(mensagem), { codigo })

export async function http(caminho, { method = 'GET', body, query } = {}) {
  const url = new URL(`/api${caminho}`, BASE_URL)
  for (const [chave, valor] of Object.entries(query || {})) {
    if (valor !== '' && valor !== null && valor !== undefined) url.searchParams.set(chave, valor)
  }

  const headers = { 'Content-Type': 'application/json' }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  let resp
  try {
    resp = await fetch(url, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) })
  } catch {
    throw erro('REDE', `Não foi possível falar com o servidor (${BASE_URL}). O back está no ar?`)
  }

  const json = resp.status === 204 ? null : await resp.json().catch(() => null)

  if (!resp.ok) {
    if (resp.status === 401) limparSessao() // token ausente/expirado — força novo login
    throw erro(json?.erro?.codigo || 'ERRO', json?.erro?.mensagem || `Erro ${resp.status} em ${caminho}`)
  }
  return json
}

// Listas do contrato vêm paginadas ({ dados, total, ... } — §1); devolve só os dados.
export const dados = (resposta) => (Array.isArray(resposta) ? resposta : resposta?.dados ?? [])
