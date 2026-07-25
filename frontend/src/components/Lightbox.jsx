import { useEffect, useState } from 'react'

// Visualizador de imagem em tela cheia, com carrossel quando o item tem mais de uma
// foto. Fica acima do drawer (z-index 100). O Esc é capturado na fase de captura e
// com stopPropagation, então fecha SÓ o lightbox — não vaza para o Esc do drawer.
export default function Lightbox({ imagens, indiceInicial = 0, alt = '', onClose }) {
  const [i, setI] = useState(indiceInicial)
  const varias = imagens.length > 1
  const proximo = () => setI((v) => (v + 1) % imagens.length)
  const anterior = () => setI((v) => (v - 1 + imagens.length) % imagens.length)

  useEffect(() => {
    const aoTeclar = (e) => {
      if (e.key === 'Escape') { e.stopPropagation(); onClose() }
      else if (varias && e.key === 'ArrowRight') { e.stopPropagation(); proximo() }
      else if (varias && e.key === 'ArrowLeft') { e.stopPropagation(); anterior() }
    }
    document.addEventListener('keydown', aoTeclar, true) // captura: chega antes do drawer
    return () => document.removeEventListener('keydown', aoTeclar, true)
  }, [varias]) // eslint-disable-line react-hooks/exhaustive-deps

  const seta = (lado) => ({
    position: 'absolute', [lado]: 16, top: '50%', transform: 'translateY(-50%)',
    width: 44, height: 44, borderRadius: '50%', border: 'none', cursor: 'pointer',
    background: 'rgba(255,255,255,.16)', color: '#fff', fontSize: 26, lineHeight: 1,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  })

  return (
    <div
      onClick={onClose}
      onMouseDown={(e) => e.stopPropagation()}
      onMouseUp={(e) => e.stopPropagation()}
      style={{ position: 'fixed', inset: 0, background: 'rgba(10,20,35,.88)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
    >
      <button onClick={onClose} aria-label="Fechar" title="Fechar (Esc)"
        style={{ position: 'absolute', top: 16, right: 16, width: 40, height: 40, borderRadius: '50%', border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,.16)', color: '#fff', fontSize: 20 }}>
        ✕
      </button>

      {varias && <button onClick={(e) => { e.stopPropagation(); anterior() }} aria-label="Imagem anterior" style={seta('left')}>‹</button>}

      <img
        src={imagens[i]}
        alt={alt}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '92vw', maxHeight: '84vh', objectFit: 'contain', borderRadius: 8, boxShadow: '0 12px 40px rgba(0,0,0,.5)' }}
      />

      {varias && <button onClick={(e) => { e.stopPropagation(); proximo() }} aria-label="Próxima imagem" style={seta('right')}>›</button>}

      {varias && (
        <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', color: '#fff', fontSize: 13, background: 'rgba(0,0,0,.4)', padding: '4px 12px', borderRadius: 999 }}>
          {i + 1} / {imagens.length}
        </div>
      )}
    </div>
  )
}
