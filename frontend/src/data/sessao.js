// sessao.js — persistência da sessão de login em localStorage.
// Guarda o retorno de POST /api/auth/login (contrato §2): access_token + objeto usuário.

const CHAVE = 'reaproveita.sessao'

export function getSessao() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE))
  } catch {
    return null
  }
}

export function getToken() {
  return getSessao()?.access_token || null
}

export function salvarSessao({ access_token, usuario }) {
  localStorage.setItem(CHAVE, JSON.stringify({ access_token, usuario }))
}

export function limparSessao() {
  localStorage.removeItem(CHAVE)
}
