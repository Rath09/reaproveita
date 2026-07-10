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

// Flag de demo pública: força 100% mock mesmo nas funções já integradas ao back
// (ex.: painel de transparência hospedado sem back no ar). Tem prioridade sobre USAR_API.
export const MOCK_TOTAL = import.meta.env.VITE_FORCE_MOCK === 'true'

const erro = (codigo, mensagem) => Object.assign(new Error(mensagem), { codigo })

// O contrato (§6) define { erro: { codigo, mensagem } }, mas o back hoje devolve o
// detail do FastAPI (string; lista no 422). Aceita os dois até o back alinhar —
// detail com prefixo ITEM_INDISPONIVEL/TRANSICAO_INVALIDA vira o código do §6.
function traduzirErro(status, json, caminho) {
  if (json?.erro?.codigo) return erro(json.erro.codigo, json.erro.mensagem)
  const detail = typeof json?.detail === 'string' ? json.detail : null
  if (detail) {
    const prefixo = ['ITEM_INDISPONIVEL', 'TRANSICAO_INVALIDA'].find((p) => detail.startsWith(p))
    if (prefixo) return erro(prefixo, detail.slice(prefixo.length).replace(/^[:\s]+/, '') || detail)
    return erro('ERRO', detail)
  }
  return erro('ERRO', `Erro ${status} em ${caminho}`)
}

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
    if (resp.status === 401) {
      limparSessao() // token ausente/expirado — força novo login
      window.dispatchEvent(new Event('auth:expirada')) // o App escuta e volta para a tela de login
    }
    throw traduzirErro(resp.status, json, caminho)
  }
  return json
}

// Listas do contrato vêm paginadas ({ dados, total, ... } — §1); devolve só os dados.
export const dados = (resposta) => (Array.isArray(resposta) ? resposta : resposta?.dados ?? [])
