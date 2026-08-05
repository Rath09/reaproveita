import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import TimelineRequisicao from './TimelineRequisicao.jsx'

const requisicao = {
  status: 'pendente',
  eventos: [
    {
      tipo: 'solicitada',
      ator: { nome: 'Ana', papel: 'secretaria', secretaria: 'Educação' },
      timestamp: '2026-07-10T09:00:00',
    },
  ],
}

describe('TimelineRequisicao', () => {
  it('mostra o evento já ocorrido com autor e papel', () => {
    render(<TimelineRequisicao requisicao={requisicao} />)
    expect(screen.getByText('Solicitada')).toBeTruthy()
    expect(screen.getByText('Ana (secretaria · Educação)')).toBeTruthy()
  })

  it('projeta as etapas futuras a partir do status pendente', () => {
    render(<TimelineRequisicao requisicao={requisicao} />)
    // FUTURO['pendente'] = aprovada -> saida_confirmada -> recebimento_confirmado
    expect(screen.getByText('Aprovada')).toBeTruthy()
    expect(screen.getByText('Saída confirmada')).toBeTruthy()
    expect(screen.getByText('Recebimento confirmado')).toBeTruthy()
  })
})
