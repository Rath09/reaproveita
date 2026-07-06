# Reaproveita — Front-end (React + Vite)

Interface do Reaproveita: catálogo de itens ociosos, fluxo de requisição e KPIs.
Visão geral do projeto e documentos da equipe: ver o `README.md` na raiz do repositório.

## Rodando localmente

Pré-requisito: Node.js 18+ (`node -v` para conferir).

```bash
cd frontend
npm install
npm run dev
```

Abra o endereço que o Vite mostrar (normalmente http://localhost:5173).

## O que já funciona (com dados fictícios)

- **Seletor de papel** Secretaria ↔ Gestor — muda a interface ao vivo.
- **Catálogo** com busca (nome ou patrimônio) e filtros por categoria e status.
- **Fluxo de requisição**: Secretaria requisita → Gestor aprova/recusa → Gestor confirma a
  transferência. O item obedece à máquina de estados do contrato (`quantidade_reservada`,
  `saldo_livre` e `status` derivado).
- **KPI "Compras evitadas"** — soma o valor dos itens transferidos.

Ainda **não** tem tela: interceptação de compra (intenções + matching) — Sprint 2, front.

## Estrutura

```
src/
  App.jsx                       orquestra papel, abas e ações
  lib/theme.js                  tokens de design (cores, fonte, helpers)
  data/
    mock.js                     seeds fictícios (campos = CONTRATO_API.md)
    api.js                      CAMADA DE API — única porta de dados do front
  components/                   Badge, Stat
  features/
    catalogo/CatalogoView.jsx   busca, grade de itens, painel de requisição
    requisicoes/RequisicoesView.jsx  visões de Secretaria e de Gestor
```

## Integração com o back-end

Todo acesso a dados passa por **`src/data/api.js`**. Cada função tem o ramo da API real
(endpoints do `CONTRATO_API.md`, via `src/data/http.js`) e o ramo do mock em memória.
A troca é pela flag `VITE_USE_API` no `.env` (copie de `.env.example`); sem `.env`, o
front roda 100% no mock — a demo nunca depende do back estar no ar.

## Documentos da equipe

Na raiz do repositório: `CONTRATO_API.md` (fonte da verdade da API), `ORGANOGRAMA.md`,
`PLANEJAMENTO.md` e `ROTEIRO_KICKOFF.md`.

## Status

Protótipo (TRL3) — dados fictícios, sem persistência.
