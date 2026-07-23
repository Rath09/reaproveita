import { useState } from 'react'
import { theme } from '../lib/theme.js'

// Ícone por categoria: é o placeholder de quem não tem foto e a rede de segurança
// de quem tem — se a imagem falhar, cai aqui e o card continua de pé.
const ICONES = {
  1: 'M6 19v-3h12v3M8 16V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v10M7 19v3M17 19v3',       // mobiliário
  2: 'M3 5h18v11H3zM9 20h6M12 16v4',                                                // informática
  3: 'M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6',                                   // material de escritório
  4: 'M9 9h6v12H9zM11 9V4h3M14 5h3v4M11 13h2',                                      // limpeza
  5: 'M6 3h12v18H6zM6 10h12M9 6v2M9 13v3',                                          // eletrodomésticos
  6: 'M4 7h16v13H4zM4 7l2-4h12l2 4M12 7v13',                                        // outros
  7: 'M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17v3h3l5.3-5.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-2.4z', // ferramentas
}

function IconeCategoria({ categoria_id, tamanho = 44 }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" aria-hidden="true"
      stroke={theme.color.inkSoft} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.55">
      <path d={ICONES[categoria_id] || ICONES[6]} />
    </svg>
  )
}

// Foto do item em proporção fixa. `alturaFixa` vence a proporção quando o layout
// precisa de uma faixa (lista, resultado de busca).
export default function ItemImagem({ item, alturaFixa = null, radius = 0 }) {
  const [falhou, setFalhou] = useState(false)
  const temFoto = Boolean(item.imageUrl) && !falhou

  const caixa = {
    width: '100%',
    ...(alturaFixa ? { height: alturaFixa } : { aspectRatio: '4 / 3' }),
    background: '#EDF1F4',
    borderRadius: radius,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden', flexShrink: 0,
  }

  if (!temFoto) {
    return (
      <div style={caixa}>
        <IconeCategoria categoria_id={item.categoria_id} />
      </div>
    )
  }

  return (
    <div style={caixa}>
      <img
        src={item.imageUrl}
        alt={item.nome}
        onError={() => setFalhou(true)}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    </div>
  )
}
