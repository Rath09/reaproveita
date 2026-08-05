import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Badge from './Badge.jsx'

describe('Badge', () => {
  it('renderiza o conteúdo passado', () => {
    render(<Badge tone="disponivel">Disponível</Badge>)
    expect(screen.getByText('Disponível')).toBeTruthy()
  })

  it('cai no tom neutro quando o tom é desconhecido', () => {
    const { getByText } = render(
      <>
        <Badge tone="tom-que-nao-existe">A</Badge>
        <Badge tone="neutro">B</Badge>
      </>,
    )
    // O fallback deve produzir exatamente a cor de texto do tom neutro.
    const corFallback = getByText('A').style.color
    expect(corFallback).not.toBe('')
    expect(corFallback).toBe(getByText('B').style.color)
  })
})
