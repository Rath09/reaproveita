import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import Stat from './Stat.jsx'

describe('Stat', () => {
  it('renderiza o rótulo e o valor', () => {
    const { getByText } = render(<Stat label="Compras evitadas" value="R$ 1.000" />)
    expect(getByText('Compras evitadas')).toBeTruthy()
    expect(getByText('R$ 1.000')).toBeTruthy()
  })

  it('destaca o valor em verde apenas quando verde=true', () => {
    const comum = render(<Stat label="x" value="10" verde={false} />)
    const corComum = comum.getByText('10').style.color
    comum.unmount()

    const destaque = render(<Stat label="x" value="10" verde />)
    const corVerde = destaque.getByText('10').style.color

    expect(corVerde).not.toBe(corComum)
  })
})
