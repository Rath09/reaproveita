# Reaproveita — Almoxarifado Compartilhado (protótipo)

Plataforma interna que cataloga itens ociosos das secretarias e permite que outras
secretarias os consultem e requisitem, evitando compras novas. Projeto da equipe
para a **Jornada Incubintech 2026**.

## Rodando localmente

Pré-requisito: Node.js 18+ (`node -v` para conferir).

```bash
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

Todo acesso a dados passa por **`src/data/api.js`**. Hoje as funções aplicam as regras do
contrato sobre o mock em memória; quando os endpoints existirem, basta trocar o miolo de
cada função pelo `fetch` real — os marcadores `// TODO: API` indicam o endpoint de cada uma
(tabela completa no §10 do `CONTRATO_API.md`). O restante do front não muda.

## Documentos da equipe

- `CONTRATO_API.md` — fonte da verdade da API (schemas, endpoints, matching, erros)
- `ORGANOGRAMA.md` — quem é dono de quê, dependências e marcos
- `PLANEJAMENTO.md` — sprints e entregas por pessoa até a final (25/jul)
- `ROTEIRO_KICKOFF.md` — roteiro da call de alinhamento da equipe

## Status

Protótipo (TRL3) — dados fictícios, sem persistência. Front-end apenas.
