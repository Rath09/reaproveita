```
cd backend

python -m venv venv

.\venv\Scripts\activate

pip install -r requirements.txt

python -m app.db.seeds.seed_usuarios

uvicorn app.main:app --reload
```

# Reaproveita — Back-end (FastAPI)

Escopo do Reaproveita: catálogo de itens ocioso, 

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

- **Login real** (contrato §2, `POST /api/auth/login`) com sessão persistida — o papel do
  usuário (secretaria ou gestor) muda a interface. Usuários do seed do back:
  `secretaria1@gmail.com` ou `gestor1@gmail.com`, senha `senha`.
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
O Set `FUNCOES_REAIS` em `api.js` lista o que já bate no back (auth, itens e requisições);
o restante (secretarias, categorias, KPIs) segue no mock até os endpoints existirem.
`VITE_USE_API=true` no `.env` força tudo para a API real; `VITE_API_URL` aponta o back
(padrão `http://localhost:8000`). Copie de `.env.example`.

## Documentos da equipe

Na raiz do repositório: `CONTRATO_API.md` (fonte da verdade da API), `ORGANOGRAMA.md`,
`PLANEJAMENTO.md` e `ROTEIRO_KICKOFF.md`.

## Status

Protótipo (TRL3) — dados fictícios, sem persistência.
