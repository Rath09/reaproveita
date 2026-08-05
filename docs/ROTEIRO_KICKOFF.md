# Roteiro — Kickoff da equipe (Discord, ~30 min)

**Preparação (antes da call):** protótipo rodando (`npm run dev`), repo aberto no GitHub
(abas: README, ORGANOGRAMA, CONTRATO_API, PLANEJAMENTO), este roteiro na outra metade da tela.
Peça para os dois abrirem o repo junto — quem acompanha lendo retém mais do que quem só ouve.

---

## 1 · Contexto e por que este desafio (0–4 min)

- O desafio: secretarias compram o que já existe parado em outra secretaria. Dinheiro público duplicado.
- Nossa tese: o problema é **comportamental**, não técnico — ninguém cede estoque e ninguém cadastra item. Por isso o diferencial é a **interceptação de compra**: a intenção de compra é registrada e o sistema sugere estoque ocioso ANTES do gasto.
- Banca avalia 7 critérios (edital 12): sustentabilidade, viabilidade técnica, criatividade, impacto social, viabilidade econômica, apresentação, escalabilidade. A interceptação pontua em quase todos.
- **Regra que elimina (edital 8.4):** checkpoint semanal perdido = fora. Todo o plano existe em função disso.

## 2 · Onde estamos — Dia 3 (4–7 min)

- Feito: inscrição oficial ✅ · protótipo front ✅ · contrato de API ✅ · organograma e planejamento ✅.
- Pendente: back-end 0% — **e está tudo bem**, o plano de recuperação fecha a base até o Dia 5. Sem pânico, com método.
- Transparência: o protótipo ainda **não** tem as telas de interceptação — é a minha entrega da Sprint 2.

## 3 · Demo do protótipo (7–13 min)

Roteiro da demo (ensaie 1x antes):
1. Papel **Secretaria** → Catálogo → buscar "monitor" → abrir item → mostrar saldo livre e valor.
2. Requisitar 2 unidades com justificativa → enviar.
3. Trocar para papel **Gestor** → aba Requisições → **Aprovar** a que acabou de chegar (mostrar que o saldo livre do item caiu = reserva).
4. **Confirmar transferência** da requisição aprovada do seed → apontar o **KPI "Compras evitadas" subindo**. Essa é a cena do pitch final.
- Frase-chave: "tudo que vocês viram passa por UM arquivo, o `api.js` — é exatamente onde o back de vocês se conecta."

## 4 · Tour pelos documentos (13–19 min)

- **CONTRATO_API.md** — a fonte da verdade. Ninguém muda campo/rota no código sem editar aqui antes. *Pedido explícito:* Rodrigo valida §4 (matching) e §5 (máquina de estados); Gabriel valida §10 (seeds). Hoje.
- **ORGANOGRAMA.md** — quem é dono de quê e por quê (perfis reais): Rodrigo = núcleo (auth, requisições, matching — ele já fez JWT no financas); Gabriel = dados e KPIs (território de análise de dados), **pareado com o Rodrigo na semana 1**.
- **PLANEJAMENTO.md** — marcos: **Dia 5 = base no ar** (front listando itens da API real), Dia 10 = requisições ponta a ponta, Dia 17 = interceptação + KPIs, Dia 24 = ensaiado, Dia 25 = final.

## 5 · O que cada um faz agora (19–24 min)

- **Hoje (Dia 3):** vocês dois validam o contrato · sessão de ~1h de modelo de dados (Rodrigo desenha, Gabriel implementa depois) · Rodrigo sobe FastAPI com `/health` e `/docs`.
- **Dia 4:** Gabriel → modelos + seeds + endpoints de leitura **sem auth**; Rodrigo → `POST /auth/login` com JWT (portar o padrão do financas).
- **Dia 5:** ligar RBAC + `POST /itens`; eu troco o `getItens()` para a API real. Primeira integração.
- Regras de trabalho (ORGANOGRAMA §5): branch por módulo + PR · daily assíncrona no grupo (fiz/farei/bloqueio) · bloqueio sem resposta em 2h = chamar os outros · `main` sempre rodando · **escopo congelado** — ideia nova vai pro roadmap do pitch (lição do financas).

## 6 · Discussão e compromissos (24–30 min)

- Perguntar, não monologar: "O que parece irreal nesse plano?" · "Algum ponto do contrato que vocês fariam diferente?"
- Fechar com compromisso verbal: **cada um repete em voz alta o que entrega até o Dia 5.**
- Combinar: horário da daily · quem confere a tarefa do checkpoint oficial na plataforma esta semana (líder manda lembrete 24h antes).

## Checklist pós-call

- [ ] Rodrigo e Gabriel adicionados como colaboradores no repo
- [ ] Validação do contrato registrada (ok ou ajustes) no grupo
- [ ] Horário da daily combinado
- [ ] Tarefa do checkpoint oficial da semana identificada na plataforma
