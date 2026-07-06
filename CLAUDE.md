# CLAUDE.md — Reaproveita

Almoxarifado compartilhado entre secretarias municipais (Jornada Incubintech 2026).
Monorepo: `frontend/` (React + Vite, dono: Rafa) e `backend/` (FastAPI + SQLite, donos: Rodrigo e Gabriel).

## Regra de ouro

**`CONTRATO_API.md` é a fonte da verdade da integração.** Nunca inventar, renomear ou
"corrigir" nomes de campos, rotas ou códigos de erro no código: divergência se resolve
editando o contrato primeiro e avisando a equipe (ORGANOGRAMA.md §2 e §5). A `main`
precisa rodar sempre — checkpoint perdido elimina a equipe.

## Comandos

```bash
# Front-end (Node 18+)
cd frontend
npm install
npm run dev        # http://localhost:5173
npm run build

# Back-end (Python 3.11+)
cd backend
python -m venv venv && venv/Scripts/activate   # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload                  # http://localhost:8000 · Swagger em /docs
```

Não há testes automatizados no PoC; a verificação é subir os dois servidores e exercitar o fluxo.

## Convenções da API (resumo do contrato)

- Base URL `/api`; JSON com campos em `snake_case` **em português** (`saldo_livre`, `secretaria_id`).
- Datas ISO 8601 UTC; dinheiro como decimal em reais.
- Listas paginadas: `?page=&page_size=` → `{ "dados": [...], "total", "page", "page_size" }`.
- Erros sempre `{ "erro": { "codigo": "...", "mensagem": "..." } }` (códigos no §6 do contrato).
- Auth JWT: `POST /api/auth/login` → `access_token`; demais rotas exigem `Authorization: Bearer`,
  exceto `GET /api/publico/kpis`. Papéis: `secretaria` e `gestor`.

## Arquitetura do front

- Código e comentários em **português**; estilo inline com tokens de `src/lib/theme.js` (sem framework CSS).
- `src/data/api.js` é o **único** ponto de acesso a dados — componentes nunca chamam `fetch`.
- Integração por flag: `VITE_USE_API=true` no `.env` liga os endpoints reais; sem flag, roda
  no mock em memória (`src/data/mock.js`, campos idênticos ao contrato). A troca é por função,
  permitindo integrar endpoint a endpoint conforme o back entrega.
- `src/data/http.js` — cliente fetch: monta URL com `VITE_API_URL`, envia Bearer token e
  converte o envelope de erro do contrato em `Error` com `.codigo`.
- `src/data/sessao.js` — persistência do login (token + usuário) em `localStorage`.

## Arquitetura do back

- `backend/app/main.py` monta o app; rotas em `app/api/routes/`; config em `app/core/config.py`
  (pydantic-settings, `.env`). Prefixo `/api`, CORS liberado para `http://localhost:5173`.
- Regras que o back **deve** implementar tal como no contrato: máquina de estados de
  requisições (§5, com `quantidade_reservada`), matching de intenções (§4) e KPIs (§7).
