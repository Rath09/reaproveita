import { useState } from 'react'
import { theme, card, btn, input } from '../../lib/theme.js'

// Tela de login (contrato §2). Usuários vêm de seed — não há cadastro público no PoC.
export default function LoginView({ onEntrar }) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [erroMsg, setErroMsg] = useState(null)

  async function enviar(e) {
    e.preventDefault()
    setEnviando(true); setErroMsg(null)
    try {
      await onEntrar(email, senha) // sucesso: o App troca a tela
    } catch (err) {
      setErroMsg(err.message)
      setEnviando(false)
    }
  }

  const rotulo = { fontSize: 13, color: theme.color.inkSoft, display: 'flex', flexDirection: 'column', gap: 4 }

  return (
    <div style={{ fontFamily: theme.font, background: theme.color.paper, minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 20 }}>
      <div style={{ width: 'min(380px, 100%)' }}>
        <div style={{ textAlign: 'center', marginBottom: 18 }}>
          <div style={{ fontSize: 26, fontWeight: 800, color: theme.color.primaryDark, letterSpacing: -0.4 }}>Reaproveita</div>
          <div style={{ fontSize: 13, color: theme.color.inkSoft }}>Almoxarifado compartilhado · Prefeitura de Florianópolis</div>
        </div>

        <form onSubmit={enviar} style={{ ...card, padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <label style={rotulo}>
            E-mail institucional
            <input type="email" required autoFocus value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="nome@pmf.sc.gov.br" style={{ ...input, width: '100%' }} />
          </label>
          <label style={rotulo}>
            Senha
            <input type="password" required value={senha} onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••" style={{ ...input, width: '100%' }} />
          </label>

          <button type="submit" style={{ ...btn('primario'), width: '100%' }} disabled={enviando}>
            {enviando ? 'Entrando…' : 'Entrar'}
          </button>

          {erroMsg && (
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: theme.color.danger }}>{erroMsg}</p>
          )}
        </form>

        <p style={{ textAlign: 'center', fontSize: 12, color: theme.color.inkSoft, marginTop: 14 }}>
          Demonstração (seed): <strong>secretaria1@gmail.com</strong> ou <strong>gestor1@gmail.com</strong> · senha <strong>senha</strong>
        </p>
      </div>
    </div>
  )
}
