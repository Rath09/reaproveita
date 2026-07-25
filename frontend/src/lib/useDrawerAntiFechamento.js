import { useCallback, useEffect, useRef, useState } from 'react'

// Regras anti-fechamento do drawer (Bloco 1), extraídas para um hook para que todo
// drawer do app compartilhe EXATAMENTE o mesmo comportamento (e não uma cópia que
// diverge com o tempo):
//   - o backdrop só fecha se mousedown E mouseup aconteceram nele — sem isso,
//     arrastar uma seleção de dentro de um campo para fora fecharia o painel (o
//     `click` do DOM dispara no ancestral comum de mousedown/mouseup: o backdrop);
//   - com o formulário "sujo" (`dirty`), backdrop e Esc NÃO fecham; só um gesto
//     deliberado (botão X / Cancelar, que chamam `onClose` direto). Tentar fechar
//     sujo levanta `avisoDescarte`.
//
// O componente decide onde desenhar o aviso e os botões — o hook só cuida da lógica.
export function useDrawerAntiFechamento({ dirty, onClose }) {
  const backdropRef = useRef(null)
  const comecouNoBackdrop = useRef(false)
  const [avisoDescarte, setAvisoDescarte] = useState(false)

  const fecharSeLimpo = useCallback(() => {
    if (dirty) { setAvisoDescarte(true); return }
    onClose()
  }, [dirty, onClose])

  useEffect(() => {
    const aoTeclar = (e) => { if (e.key === 'Escape') fecharSeLimpo() }
    document.addEventListener('keydown', aoTeclar)
    return () => document.removeEventListener('keydown', aoTeclar)
  }, [fecharSeLimpo])

  // Deixou de estar sujo (ex.: enviou o formulário) → o aviso não faz mais sentido.
  useEffect(() => { if (!dirty) setAvisoDescarte(false) }, [dirty])

  const backdropHandlers = {
    onMouseDown: (e) => { comecouNoBackdrop.current = e.target === backdropRef.current },
    onMouseUp: (e) => {
      const gestoInteiroNoBackdrop = comecouNoBackdrop.current && e.target === backdropRef.current
      comecouNoBackdrop.current = false
      if (gestoInteiroNoBackdrop) fecharSeLimpo()
    },
  }

  return { backdropRef, backdropHandlers, avisoDescarte }
}
