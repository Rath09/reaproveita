# Planejamento — Jornada Incubintech 2026 (v2)

**Versão 2.0 — 03/07/2026 (Dia 3).** Substitui a v1: nomes reais, desafio **travado (Almoxarifado → Reaproveita)**, divisão ajustada aos perfis e datas reancoradas — o back começa hoje. Trabalha em par com `CONTRATO_API.md` (fonte da verdade da API) e `ORGANOGRAMA.md` (ownership e dependências).

**Time (3):**
- **Rafa** — Front-end (React + Vite; protótipo pronto; guardião do contrato).
- **Rodrigo** — Back núcleo (FastAPI · Auth JWT · requisições/estados · matching). Ex-DBA; fez back Flask + MySQL + JWT no financas.
- **Gabriel** — Back dados (modelos SQLite · seeds · CRUD · KPIs). Estudante de análise de dados; **pareado com Rodrigo na semana 1**.

**Stack:** FastAPI + SQLite · React/Vite · Git/GitHub.
**Contagem de dias:** Dia 1 = 01/jul · **hoje = Dia 3 (03/jul)** · Final = Dia 25 (25/jul).

**Status na data desta versão:** equipe inscrita oficialmente ✅ (edital 6.3) · contrato v1 ✅ · protótipo front ✅ · **back-end 0% — recuperação planejada abaixo**.

> **Regra de ouro (edital 8.4):** checkpoint perdido = eliminação imediata. Todo marco interno fecha **1 dia antes** do checkpoint oficial da semana. A `main` precisa rodar sempre.

---

## Visão geral das sprints

| Sprint | Dias | Fase do método | Marco interno |
|---|---|---|---|
| 1 · Base + MVP do domínio | 3–10 (03–10/jul) | Entender/Desenvolver | **Base no ar — Dia 5** · MVP — Dia 10 |
| 2 · Interceptação + Validação | 11–17 (11–17/jul) | Validar | Dia 17 |
| 3 · Refino, Pitch & Ensaio | 18–24 (18–24/jul) | Refinar | Dia 24 |
| Final | 25 (25/jul) | — | Pitch + demo ao vivo |

---

## Sprint 1 — Base + MVP do domínio (Dia 3–10)

### Recuperação da base (Dia 3–5) — trilhas paralelas, auth não bloqueia CRUD

**Hoje, Dia 3 (03/jul):**
- **Rodrigo + Gabriel:** validar o `CONTRATO_API.md` — Rodrigo os §4 (matching) e §5 (máquina de estados); Gabriel o §10 (seeds). Divergência = editar o contrato primeiro.
- **Rodrigo + Gabriel:** sessão de ~1h de **modelo de dados** (Rodrigo desenha, Gabriel anota e implementa depois).
- **Rodrigo:** projeto FastAPI no repo + `/health` + `/docs` no ar.
- **Rafa:** mapear as funções de `api.js` para os endpoints (tabela do §10 do contrato); preparar o front para variável de ambiente com a URL do back.

**Dia 4 (04/jul):**
- **Gabriel:** modelos + seeds do §10 (6 secretarias, 6 categorias, ~15 itens, 2 usuários); endpoints de leitura `GET /secretarias`, `GET /categorias`, `GET /itens` **ainda sem auth**.
- **Rodrigo:** `POST /api/auth/login` com JWT + bcrypt (portar o padrão do financas para FastAPI) e a dependência `get_current_user`.

**Dia 5 (05/jul) — marco "Base no ar":**
- **Rodrigo + Gabriel:** ligar o RBAC nos endpoints; `POST /api/itens`.
- **Rafa:** trocar `getItens()` do mock para a API real — **primeira integração de verdade**.
- ✅ Pronto quando: `/docs` cobre §2–§3 · seeds no banco · front lista itens vindos da API.

### MVP do domínio (Dia 6–10)
- **Rodrigo:** `POST /api/requisicoes` + `PATCH` com as transições do §5 (`quantidade_reservada`, erros 409); teste manual de concorrência (duas pendentes disputando o mesmo saldo).
- **Gabriel:** `GET /api/requisicoes` com filtros e paginação; ajustes de seed para a demo.
- **Rafa:** login no front (guardar token, header `Authorization`); telas de requisição consumindo a API real; estados visuais pelo `status` derivado do item.
- ✅ **Pronto quando (Dia 10):** fluxo Secretaria requisita → Gestor aprova → confirma transferência funciona ponta a ponta, persistido no banco.

## Sprint 2 — Interceptação + Validação (Dia 11–17)

- **Rodrigo:** `POST /api/intencoes` com matching síncrono (§4, `difflib`), `GET /matches`, `POST /converter`.
- **Gabriel:** `GET /api/kpis` e `GET /api/publico/kpis` (agregações do §7); massa de dados realista para a demo (nomes de itens verossímeis).
- **Rafa:** tela de nova intenção + cards de match (score, cobertura, economia estimada) + conversão em 1 clique; painel público de KPIs.
- **Equipe:** validar com 2–3 pessoas de fora (mentoria/demandante — edital 8.2/9.4) e registrar o feedback. É a fase **Validar** do método.
- ✅ **Pronto quando (Dia 17):** o momento-uau roda sem intervenção: intenção → matches → converter → aprovar → KPI sobe no painel.

## Sprint 3 — Refino, Pitch & Ensaio (Dia 18–24)

- **Rafa:** polimento visual, tratamento de erros e estados vazios, roteiro da demo.
- **Rodrigo:** estabilidade — **nenhuma feature nova depois do Dia 21**; seed final da demo; ambiente da apresentação testado + plano B (rodar local).
- **Gabriel:** pitch deck no modelo da organização (edital 11) com os números reais dos KPIs; vídeo demonstrativo opcional ≤ 2 min (edital 11).
- **Equipe:** 3 ensaios cronometrados (pitch ≤ 4 min — edital 13.2); definir os **mínimo 2 presentes** na final (edital 7.1); repositório organizado com READMEs (entregável do edital 11).
- ✅ **Pronto quando (Dia 24):** ensaio 3 rodou limpo · deck fechado · plano B de demo pronto.

## Final — Dia 25 (25/jul, 13h30, IFSC — Av. Mauro Ramos, 950)

Mínimo 2 integrantes presentes; um demonstra o PoC **funcionando ao vivo** — os slides são complementares, a demonstração é o essencial (edital 13.2).

## Riscos e respostas

| Risco | Resposta |
|---|---|
| Atraso do back (real: 2 dias) | Trilhas paralelas do Dia 3–5. Se no Dia 5 o front ainda não listar itens reais, Rafa segue no mock com uma flag e integra por função — o contrato permite trocar endpoint a endpoint. |
| Gabriel travar sozinho | Pareamento diário de 30 min com Rodrigo; tarefa de Gabriel nunca fica solo no caminho crítico. |
| Repetir o padrão financas (backlog aberto, abandono) | Escopo congelado no MVP do contrato; ideia nova → §9 (roadmap do pitch); issue só existe com dono e sprint. |
| Perder checkpoint oficial | Entrega do relatório/tarefa na plataforma é responsabilidade do líder, com lembrete no grupo 24h antes (edital 8.4). |
