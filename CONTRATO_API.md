# Contrato de API — Reaproveita (PoC)

**Versão 1.1 — 10/07/2026 · Artefato do Dia 3 (checkpoint interno)**
**Stack:** FastAPI + SQLite (back) · React/Vite (front, camada `src/data/api.js`)

Este documento é a **fonte da verdade** da integração. O Swagger gerado pelo FastAPI (`/docs`) deve refletir exatamente o que está aqui; divergências se resolvem **editando este arquivo primeiro** e avisando no canal da equipe. Nomes de campos daqui prevalecem sobre `mock.js` — ajustar o mock se divergir.

---

## 1. Convenções

- Base URL: `/api` (sem versionamento no PoC).
- JSON em todas as trocas; campos em `snake_case`; datas ISO 8601 UTC (`2026-07-02T14:00:00Z`).
- IDs inteiros autoincrementais (SQLite).
- Paginação em listas: `?page=1&page_size=20` → resposta `{ "dados": [...], "total": 123, "page": 1, "page_size": 20 }`.
- Valores monetários: número decimal em reais (`180.00`).

## 2. Autenticação (JWT)

- `POST /api/auth/login` — body `{ "email": "...", "senha": "..." }`
  → `200 { "access_token": "...", "token_type": "bearer", "expires_in": 28800, "usuario": { ... } }`
  → `401` credenciais inválidas.
- Todas as demais rotas exigem `Authorization: Bearer <token>`, **exceto** `GET /api/publico/kpis` (§7).
- Payload do token: `{ "sub": <usuario_id>, "papel": "secretaria" | "gestor", "secretaria_id": <int|null>, "exp": <ts> }`.
- Escopo do PoC: sem refresh token; expiração 8 h; senha com hash bcrypt; usuários criados por **seed** (não há cadastro público).

Objeto usuário:
```json
{ "id": 1, "nome": "Ana Souza", "email": "ana@pmf.sc.gov.br", "papel": "secretaria", "secretaria_id": 3 }
```
`papel = "gestor"` tem `secretaria_id` da secretaria cujo almoxarifado administra: enxerga todas as requisições, mas só executa as ações do §5 sobre requisições de itens da própria secretaria.

## 3. Recursos e endpoints

### 3.1 Secretarias
- `GET /api/secretarias` → lista `{ "id": 3, "nome": "Secretaria de Educação", "sigla": "SME" }`. Dados de seed.

### 3.2 Categorias
- `GET /api/categorias` → lista `{ "id": 1, "nome": "Mobiliário" }`.
- Seed inicial: Mobiliário, Informática, Material de escritório, Limpeza, Eletrodomésticos, Outros.

### 3.3 Itens

Objeto:
```json
{
  "id": 42,
  "nome": "Cadeira giratória",
  "descricao": "Cadeira giratória com braços, tecido preto",
  "patrimonio": "PMF-2019-00871",
  "categoria_id": 1,
  "secretaria_id": 3,
  "quantidade": 60,
  "quantidade_reservada": 0,
  "saldo_livre": 60,
  "estado_conservacao": "bom",
  "status": "disponivel",
  "valor_unitario_estimado": 180.00,
  "catmat_code": null,
  "criado_em": "2026-07-01T13:00:00Z"
}
```
- `estado_conservacao`: `novo | otimo | bom | regular | ruim`.
- `saldo_livre` e `status` são **calculados pelo back** (§5): `saldo_livre = quantidade - quantidade_reservada`.
- `status`: `disponivel` (saldo_livre > 0) · `reservado` (saldo_livre = 0 e quantidade > 0) · `transferido` (quantidade = 0).
- `catmat_code`: `string | null`, opcional (§8).

Endpoints:
- `GET /api/itens` — filtros: `q` (busca em nome e patrimônio), `categoria_id`, `estado_conservacao`, `status`, `secretaria_id` + paginação.
- `GET /api/itens/{id}`
- `POST /api/itens` (papel: secretaria) — body sem `id`, `status`, `saldo_livre`, `quantidade_reservada`, `criado_em`. `secretaria_id` vem do token.
- Não há PATCH/DELETE de item no PoC; o status muda por efeito das requisições (§5).

### 3.4 Requisições

Objeto:
```json
{
  "id": 7,
  "item_id": 42,
  "secretaria_solicitante_id": 5,
  "quantidade": 40,
  "justificativa": "Reposição do setor de atendimento",
  "status": "pendente",
  "intencao_id": 12,
  "criado_em": "...",
  "atualizado_em": "..."
}
```
- `status`: `pendente | aprovada | recusada | transferida`.
- `intencao_id`: `int | null` — preenchido quando a requisição nasce de uma interceptação (§3.5). É o que permite medir a economia da interceptação.

Endpoints:
- `POST /api/requisicoes` (secretaria) — `{ item_id, quantidade, justificativa, intencao_id? }` → `201`.
  Valida `quantidade <= saldo_livre` → senão `409 ITEM_INDISPONIVEL`. Não pode requisitar item da própria secretaria → `400`.
- `PATCH /api/requisicoes/{id}` (gestor da secretaria dona do item — outro gestor recebe 403 SEM_PERMISSAO) — `{ "acao": "aprovar" | "recusar" | "confirmar_transferencia" }`. Transição fora de ordem → `409 TRANSICAO_INVALIDA`.
- `GET /api/requisicoes` — filtros `status`, `secretaria_solicitante_id` + paginação. Papel secretaria só enxerga as próprias; gestor enxerga todas.

### 3.5 Intenções de compra (interceptação)

Objeto:
```json
{
  "id": 12,
  "secretaria_id": 5,
  "descricao": "Cadeiras giratórias para o setor de atendimento",
  "categoria_id": 1,
  "quantidade": 100,
  "valor_unitario_estimado": 310.00,
  "catmat_code": null,
  "status": "aberta",
  "quantidade_atendida": 0,
  "motivo_compra": null,
  "criado_em": "..."
}
```
- `status`: `aberta | convertida | mantida_compra`. Atendimento parcial fica em `quantidade_atendida`; vira `convertida` quando `quantidade_atendida >= quantidade` ou quando a secretaria encerra manualmente.
- **A interceptação não bloqueia nada**: é sugestiva. A secretaria decide converter ou manter a compra.

Endpoints:
- `POST /api/intencoes` (secretaria) → `201` com matching **síncrono e embutido**:
  ```json
  { "intencao": { ... }, "matches": [ ... ] }
  ```
- `GET /api/intencoes/{id}/matches` — re-executa o matching (o estoque muda entre consultas).
- `POST /api/intencoes/{id}/converter` — `{ "item_id": 42, "quantidade": 40 }` → cria a requisição vinculada (`intencao_id`), soma em `quantidade_atendida`, devolve `201` com a requisição criada. Mesmas validações de `POST /api/requisicoes`.
- `PATCH /api/intencoes/{id}` — `{ "status": "mantida_compra", "motivo_compra": "..." }`. Disponível **mesmo havendo matches** (a secretaria pode justificar por que a compra segue necessária apesar da oferta) — a trilha alimenta o KPI de oportunidade perdida e serve de auditoria.
- `GET /api/intencoes` — filtros `status`, `secretaria_id` + paginação.

## 4. Regras do matching

Entrada: uma intenção. Saída: até **10** candidatos ordenados por `score` decrescente.

1. **Filtro eliminatório:** `item.categoria_id == intencao.categoria_id` E `item.saldo_livre > 0` E `item.secretaria_id != intencao.secretaria_id`.
2. **Score:** `score = 0.7 * sim_texto + 0.3 * cobertura`
   - `sim_texto` (0–1): similaridade entre `intencao.descricao` e `item.nome + " " + item.descricao`, ambos em minúsculas e sem acentos.
   - Base: `difflib.SequenceMatcher(None, a, b).ratio()` (stdlib) — ou Sørensen-Dice de bigramas no front. **Ambas sozinhas casam palavras curtas por acaso** (ex.: "cadeira" ~ "madeira"/"estante" na mesma categoria passavam o corte — bug reportado em validação). Por isso o `sim_texto` incorpora **bônus de token exato**:
     - `toks` = palavras de `intencao.descricao` com ≥4 chars (normalizadas).
     - `token_cob` = fração de `toks` presente inteira em `item.nome + " " + item.descricao`.
     - `sim_texto = max(base, 0.35*base + 0.65*token_cob)`.
     - Sem `toks` (busca só com palavras curtas), usar `base`. (`rapidfuzz.fuzz.token_set_ratio/100` é upgrade opcional que dispensa o bônus.)
   - `cobertura = min(1, item.saldo_livre / intencao.quantidade)`.
3. **Corte:** descartar `score < 0.35`. (Com o bônus, ruído de mesma categoria cai para ~0.25; match real fica ≥0.6. Validado contra o caso "cadeira x estante".)
4. **Desempate:** maior `cobertura`; depois `criado_em` mais antigo (gira estoque parado há mais tempo).

Formato de cada match:
```json
{ "item": { ...objeto item completo... }, "score": 0.81, "cobertura": 0.6, "economia_estimada": 7440.00 }
```
`economia_estimada = min(item.saldo_livre, intencao.quantidade) * valor_unitario`, usando `intencao.valor_unitario_estimado` (é o gasto que deixaria de acontecer); se nulo, usar o do item.

## 5. Máquina de estados e efeitos colaterais

Requisição: `pendente → aprovada → transferida`; `pendente → recusada`. Nada mais.

| Ação (gestor) | Pré-condição | Efeito no item |
|---|---|---|
| `aprovar` | status `pendente` e `quantidade <= saldo_livre` (revalida — pode haver pendentes concorrentes) | `quantidade_reservada += quantidade` |
| `recusar` | status `pendente` | nenhum |
| `confirmar_transferencia` | status `aprovada` | `quantidade -= q`; `quantidade_reservada -= q`; recalcula `status` do item; soma no KPI |

Criar requisição **não** reserva saldo — a reserva acontece na aprovação. Se duas pendentes disputam o mesmo saldo, a segunda aprovação falha com `409`.

### 5.1 Modelo de iniciação — nota de validação (10/07)

Entrevista no CEART revelou fluxo invertido ao desta seção: só a gestora principal opera o sistema, e é quem tem o excedente que inicia a transferência para outro local (o pedido é combinado por fora do sistema), aguardando autorização dentro dele. O PoC mantém o fluxo solicitante→aprovação deste contrato; a inversão (transferência iniciada pelo dono, direcionada a uma secretaria) é suportada pelo mesmo domínio (§3.4 + §5) e será decidida com o demandante até 25/07. Citar como flexibilidade no pitch (§9).

## 6. Erros

Formato único:
```json
{ "erro": { "codigo": "ITEM_INDISPONIVEL", "mensagem": "O item 42 não possui saldo livre suficiente." } }
```

| HTTP | Código | Quando |
|---|---|---|
| 400 | `VALIDACAO` | campo faltando/inválido; requisitar item da própria secretaria |
| 401 | `NAO_AUTENTICADO` | token ausente, inválido ou expirado |
| 403 | `SEM_PERMISSAO` | papel errado para a rota |
| 404 | `NAO_ENCONTRADO` | recurso inexistente |
| 409 | `ITEM_INDISPONIVEL` / `TRANSICAO_INVALIDA` | conflito de saldo ou de estado |

## 7. KPIs

- `GET /api/kpis` (autenticado) e `GET /api/publico/kpis` (**sem auth** — alimenta o painel público de transparência). Mesmo payload:
```json
{
  "compras_evitadas_valor": 45230.00,
  "itens_transferidos": 87,
  "requisicoes_concluidas": 23,
  "intencoes_total": 18,
  "intencoes_convertidas": 11,
  "taxa_interceptacao": 0.61
}
```
- `compras_evitadas_valor`: soma, sobre transferências confirmadas, de `quantidade * valor_unitario` (da intenção vinculada quando existir; senão, do item).
- `taxa_interceptacao = intencoes_convertidas / intencoes_total` (0 quando não há intenções).

## 8. Nota sobre CATMAT

O CATMAT é o Catálogo de Materiais do Governo Federal, mantido no Compras.gov.br, que dá a cada material um código numérico único e descrição padronizada; estados e municípios também o adotam. Referência oficial: https://www.gov.br/compras/pt-br/sistemas/conheca-o-compras/catalogo

No PoC, `catmat_code` é apenas um campo `string | null` livre (sem validação contra a base). Serve para: (a) melhorar o matching no futuro (código igual = match perfeito) e (b) sinalizar maturidade para a banca. Não gastar tempo integrando a base real agora.

## 9. Fora de escopo (roadmap — citar no pitch, não implementar)

Cadastro por foto + IA, créditos de reaproveitamento, cascata de doação (OSCs/escolas/reciclagem), import CSV do patrimônio, integração com ERPs municipais (Betha/IPM), refresh token, trilha de auditoria imutável.

## 10. Checklist do Dia 3

- [ ] Back: FastAPI no ar com `/docs` cobrindo §2 e §3 (respostas mockadas em memória já valem — o contrato é o que importa).
- [ ] Back: seeds acordados — 6 secretarias, 6 categorias, 2 usuários (1 secretaria + 1 gestor), ~15 itens.
- [ ] Front: mapear `src/data/api.js` para os endpoints abaixo (trocar o miolo das funções, marcadores `// TODO: API`).
- [ ] Equipe: qualquer mudança neste contrato = editar este arquivo + avisar no grupo.

| Função no front (`api.js`) | Endpoint |
|---|---|
| `login()` | `POST /api/auth/login` |
| `getItens()` | `GET /api/itens` |
| `criarItem()` | `POST /api/itens` |
| `criarRequisicao()` | `POST /api/requisicoes` |
| `atualizarRequisicao()` | `PATCH /api/requisicoes/:id` |
| `criarIntencao()` | `POST /api/intencoes` |
| `getMatches()` | `GET /api/intencoes/:id/matches` |
| `converterIntencao()` | `POST /api/intencoes/:id/converter` |
| `getKpis()` | `GET /api/kpis` |
