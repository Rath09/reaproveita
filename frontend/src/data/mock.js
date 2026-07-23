// mock.js — dados fictícios do protótipo.
// IMPORTANTE: nomes de campos seguem o CONTRATO_API.md (fonte da verdade).
// Quando o back existir, este arquivo deixa de ser usado (a troca acontece em api.js).

export const SECRETARIAS = [
  { id: 1, nome: 'Secretaria de Educação', sigla: 'SME' },
  { id: 2, nome: 'Secretaria de Saúde', sigla: 'SMS' },
  { id: 3, nome: 'Secretaria de Administração', sigla: 'SMA' },
  { id: 4, nome: 'Secretaria de Obras', sigla: 'SMO' },
  { id: 5, nome: 'Secretaria de Assistência Social', sigla: 'SMAS' },
  { id: 6, nome: 'Secretaria de Meio Ambiente', sigla: 'SMMA' },
]

export const CATEGORIAS = [
  { id: 1, nome: 'Mobiliário' },
  { id: 2, nome: 'Informática' },
  { id: 3, nome: 'Material de escritório' },
  { id: 4, nome: 'Limpeza' },
  { id: 5, nome: 'Eletrodomésticos' },
  { id: 6, nome: 'Outros' },
  { id: 7, nome: 'Ferramentas' },
]

// Usuários de demonstração (a tela de login aceita qualquer senha no mock).
// E-mails no padrão do exemplo do contrato §2.
//
// NOTA CONSCIENTE: Carlos (gestor) segue com secretaria_id: null, ou seja, aprova
// requisição de qualquer secretaria — diverge do RBAC por secretaria do contrato
// v1.1 (§2/§3.4: gestor só age sobre itens da própria secretaria). É simplificação
// deliberada da demo pública (um único gestor de demo, sem back para validar RBAC
// real); o back real já implementa o RBAC correto.
export const USUARIOS = {
  secretaria: { id: 1, nome: 'Ana Souza', email: 'ana@pmf.sc.gov.br', papel: 'secretaria', secretaria_id: 2 }, // SMS
  gestor: { id: 2, nome: 'Carlos Lima', email: 'carlos@pmf.sc.gov.br', papel: 'gestor', secretaria_id: null },
}

// Campos por item (contrato §3.3): quantidade_reservada, saldo_livre e status
// são derivados no "back" (aqui, em api.js) — os valores abaixo são o estado inicial.
//
// Campos do protótipo além do contrato:
//   imageUrl          foto do item; null usa o ícone da categoria (ItemImagem.jsx)
//   unidade           como o item é contado no almoxarifado (un, resma, fardo…)
//   paradoDesdeMeses  há quanto tempo não tem movimentação; null = giro normal.
//                     A partir de 6 meses o catálogo mostra o selo de ocioso.
//
// Patrimônio × consumo: quem tem número de patrimônio é bem durável; consumível
// não tem. Essa distinção (e não a categoria) é o que separa as duas fatias no
// painel público.
export const ITENS = [
  { id: 1,  nome: 'Cadeira giratória com braços', descricao: 'Tecido preto, base cromada', patrimonio: 'PMF-2019-00871', categoria_id: 1, secretaria_id: 1, quantidade: 60, quantidade_reservada: 0, estado_conservacao: 'bom',     valor_unitario_estimado: 180.0,  unidade: 'un', paradoDesdeMeses: 9,    imageUrl: '/img/items/cadeira-giratoria.svg',  catmat_code: '451021', criado_em: '2026-03-18T13:00:00Z' },
  { id: 2,  nome: 'Monitor LED 21,5"', descricao: 'Entrada HDMI/VGA, sem base quebrada', patrimonio: 'PMF-2021-01455', categoria_id: 2, secretaria_id: 3, quantidade: 12, quantidade_reservada: 0, estado_conservacao: 'otimo',   valor_unitario_estimado: 420.0,  unidade: 'un', paradoDesdeMeses: null, imageUrl: null, catmat_code: null, criado_em: '2026-03-18T13:10:00Z' },
  { id: 3,  nome: 'Mesa de escritório 1,20m', descricao: 'MDF cinza, 2 gavetas', patrimonio: 'PMF-2018-00344', categoria_id: 1, secretaria_id: 4, quantidade: 25, quantidade_reservada: 0, estado_conservacao: 'regular', valor_unitario_estimado: 260.0,  unidade: 'un', paradoDesdeMeses: 7,    imageUrl: null, catmat_code: null, criado_em: '2026-03-19T13:20:00Z' },
  { id: 4,  nome: 'Notebook 14" i5 8GB', descricao: 'Uso administrativo, bateria ok', patrimonio: 'PMF-2020-02210', categoria_id: 2, secretaria_id: 2, quantidade: 8,  quantidade_reservada: 0, estado_conservacao: 'bom',     valor_unitario_estimado: 1900.0, unidade: 'un', paradoDesdeMeses: null, imageUrl: null, catmat_code: null, criado_em: '2026-03-19T13:30:00Z' },
  { id: 5,  nome: 'Papel A4 75g', descricao: 'Estoque excedente de licitação', patrimonio: null, categoria_id: 3, secretaria_id: 3, quantidade: 300, quantidade_reservada: 0, estado_conservacao: 'novo',  valor_unitario_estimado: 24.9,   unidade: 'resma', paradoDesdeMeses: null, imageUrl: null, catmat_code: '279904', criado_em: '2026-03-20T13:40:00Z' },
  { id: 6,  nome: 'Arquivo de aço 4 gavetas', descricao: 'Cinza, com chave', patrimonio: 'PMF-2017-00120', categoria_id: 1, secretaria_id: 1, quantidade: 10, quantidade_reservada: 3, estado_conservacao: 'bom',     valor_unitario_estimado: 350.0,  unidade: 'un', paradoDesdeMeses: 11,   imageUrl: null, catmat_code: null, criado_em: '2026-03-20T13:50:00Z' },
  { id: 7,  nome: 'Projetor multimídia 3600 lumens', descricao: 'Com cabo HDMI e controle', patrimonio: 'PMF-2022-00077', categoria_id: 2, secretaria_id: 1, quantidade: 3, quantidade_reservada: 0, estado_conservacao: 'otimo', valor_unitario_estimado: 2300.0, unidade: 'un', paradoDesdeMeses: null, imageUrl: null, catmat_code: null, criado_em: '2026-03-23T09:00:00Z' },
  { id: 8,  nome: 'Cadeira fixa estofada', descricao: 'Azul, empilhável', patrimonio: 'PMF-2016-00980', categoria_id: 1, secretaria_id: 2, quantidade: 40, quantidade_reservada: 0, estado_conservacao: 'regular', valor_unitario_estimado: 95.0,   unidade: 'un', paradoDesdeMeses: null, imageUrl: null, catmat_code: null, criado_em: '2026-03-23T09:10:00Z' },
  { id: 9,  nome: 'Toner HP 85A (original)', descricao: 'Lacrado, compra duplicada', patrimonio: null, categoria_id: 3, secretaria_id: 3, quantidade: 45, quantidade_reservada: 0, estado_conservacao: 'novo',  valor_unitario_estimado: 310.0,  unidade: 'un', paradoDesdeMeses: null, imageUrl: null, catmat_code: null, criado_em: '2026-03-24T09:20:00Z' },
  { id: 10, nome: 'Geladeira frost free 340L', descricao: 'Branca, funcionando', patrimonio: 'PMF-2019-00650', categoria_id: 5, secretaria_id: 5, quantidade: 2,  quantidade_reservada: 0, estado_conservacao: 'bom',     valor_unitario_estimado: 1800.0, unidade: 'un', paradoDesdeMeses: null, imageUrl: null, catmat_code: null, criado_em: '2026-03-24T09:30:00Z' },
  { id: 11, nome: 'Ventilador de parede 60cm', descricao: 'Preto, oscilante', patrimonio: 'PMF-2021-00432', categoria_id: 5, secretaria_id: 4, quantidade: 18, quantidade_reservada: 0, estado_conservacao: 'bom',     valor_unitario_estimado: 240.0,  unidade: 'un', paradoDesdeMeses: null, imageUrl: null, catmat_code: null, criado_em: '2026-03-25T09:40:00Z' },
  { id: 12, nome: 'Estante de aço 6 prateleiras', descricao: 'Desmontada, completa', patrimonio: 'PMF-2018-00777', categoria_id: 1, secretaria_id: 6, quantidade: 14, quantidade_reservada: 0, estado_conservacao: 'regular', valor_unitario_estimado: 280.0, unidade: 'un', paradoDesdeMeses: 6, imageUrl: null, catmat_code: null, criado_em: '2026-03-25T10:00:00Z' },
  { id: 13, nome: 'Telefone IP com fonte', descricao: 'Compatível com central atual', patrimonio: 'PMF-2020-01890', categoria_id: 2, secretaria_id: 3, quantidade: 20, quantidade_reservada: 0, estado_conservacao: 'otimo', valor_unitario_estimado: 380.0,  unidade: 'un', paradoDesdeMeses: null, imageUrl: null, catmat_code: null, criado_em: '2026-03-26T10:10:00Z' },
  { id: 14, nome: 'Quadro branco 2,0 x 1,2m', descricao: 'Com suporte de parede', patrimonio: 'PMF-2019-00233', categoria_id: 6, secretaria_id: 1, quantidade: 9,  quantidade_reservada: 0, estado_conservacao: 'bom',     valor_unitario_estimado: 190.0,  unidade: 'un', paradoDesdeMeses: null, imageUrl: null, catmat_code: null, criado_em: '2026-03-26T10:20:00Z' },
  { id: 15, nome: 'Álcool em gel 70%', descricao: 'Validade 2027, excedente', patrimonio: null, categoria_id: 4, secretaria_id: 2, quantidade: 60, quantidade_reservada: 0, estado_conservacao: 'novo', valor_unitario_estimado: 55.0,   unidade: 'galão 5L', paradoDesdeMeses: null, imageUrl: null, catmat_code: null, criado_em: '2026-03-27T10:30:00Z' },

  // Itens vindos da validação de campo (entrevista CEART + visita ao almoxarifado):
  // material parado por anos, nomenclatura própria da prefeitura e unidades que só
  // fazem sentido para quem opera o estoque.
  { id: 16, nome: 'Esponja de aço', descricao: 'Fardo com 14 pacotes, lote de licitação vencida em uso', patrimonio: null, categoria_id: 4, secretaria_id: 1, quantidade: 180, quantidade_reservada: 0, estado_conservacao: 'novo', valor_unitario_estimado: 42.0, unidade: 'fardo 14 pct', paradoDesdeMeses: 8, imageUrl: '/img/items/esponja-aco.svg', catmat_code: '234157', criado_em: '2026-03-30T09:00:00Z' },
  { id: 17, nome: 'Creolina', descricao: 'Desinfetante concentrado, lacrado', patrimonio: null, categoria_id: 4, secretaria_id: 4, quantidade: 24, quantidade_reservada: 0, estado_conservacao: 'novo', valor_unitario_estimado: 89.9, unidade: 'galão 5L', paradoDesdeMeses: 14, imageUrl: '/img/items/creolina.svg', catmat_code: null, criado_em: '2026-03-30T09:20:00Z' },
  { id: 18, nome: 'Ar-condicionado split 12.000 BTU', descricao: 'Na caixa, nunca instalado — obra do prédio não saiu', patrimonio: 'PMF-2024-01188', categoria_id: 5, secretaria_id: 1, quantidade: 4, quantidade_reservada: 0, estado_conservacao: 'novo', valor_unitario_estimado: 2450.0, unidade: 'un', paradoDesdeMeses: 24, imageUrl: '/img/items/ar-condicionado-split.svg', catmat_code: null, criado_em: '2026-03-31T09:00:00Z' },
  { id: 19, nome: 'Rebitador manual', descricao: 'Alicate rebitador com bicos sobressalentes', patrimonio: 'PMF-2023-00512', categoria_id: 7, secretaria_id: 6, quantidade: 6, quantidade_reservada: 0, estado_conservacao: 'bom', valor_unitario_estimado: 78.0, unidade: 'un', paradoDesdeMeses: 6, imageUrl: '/img/items/rebitador.svg', catmat_code: null, criado_em: '2026-03-31T09:30:00Z' },
  { id: 20, nome: 'Vanga quadrada', descricao: 'Pá de corte com cabo de madeira — conhecida como vanga no almoxarifado', patrimonio: 'PMF-2022-00940', categoria_id: 7, secretaria_id: 4, quantidade: 12, quantidade_reservada: 0, estado_conservacao: 'bom', valor_unitario_estimado: 96.0, unidade: 'un', paradoDesdeMeses: null, imageUrl: '/img/items/vanga-quadrada.svg', catmat_code: null, criado_em: '2026-04-01T09:00:00Z' },
  { id: 21, nome: 'Papel toalha interfolha', descricao: 'Fardo com 400 folhas, reposição frequente', patrimonio: null, categoria_id: 4, secretaria_id: 3, quantidade: 150, quantidade_reservada: 0, estado_conservacao: 'novo', valor_unitario_estimado: 32.5, unidade: 'fardo 400 folhas', paradoDesdeMeses: null, imageUrl: '/img/items/papel-toalha.svg', catmat_code: '456712', criado_em: '2026-04-01T09:30:00Z' },
]

// Histórico do programa: 28 transferências concluídas nos últimos ~90 dias, entre
// as 6 secretarias — todas enviam e todas recebem. É o que alimenta os KPIs e os
// gráficos do painel público; nenhum número é escrito à mão em lugar nenhum, tudo
// sai da agregação deste seed.
//
// As três últimas são o estado "de agora", para a demo ao vivo: uma aprovada
// aguardando retirada pela SMS (Ana), uma pendente de item da SME (Carlos aprova)
// e uma pendente de outra secretaria (Carlos vê, mas não pode decidir).
//
// (Como no protótipo, requisições transferidas não abatem o estoque exibido — os
// valores em ITENS são o estado "de agora".)
export const REQUISICOES = [
  { id: 1, item_id: 7, secretaria_solicitante_id: 2, quantidade: 1, justificativa: 'Atende intenção de compra #1 — Projetor para as capacitações da vigilância', status: 'transferida', intencao_id: 1, criado_em: '2026-04-27T09:00:00Z', atualizado_em: '2026-04-28T16:05:00Z' },
  { id: 2, item_id: 4, secretaria_solicitante_id: 1, quantidade: 2, justificativa: 'Secretaria escolar do CEI Coqueiros', status: 'transferida', intencao_id: null, criado_em: '2026-04-29T14:20:00Z', atualizado_em: '2026-05-01T08:35:00Z' },
  { id: 3, item_id: 2, secretaria_solicitante_id: 6, quantidade: 4, justificativa: 'Atende intenção de compra #2 — Monitores para o setor de licenciamento', status: 'transferida', intencao_id: 2, criado_em: '2026-05-02T10:40:00Z', atualizado_em: '2026-05-05T15:25:00Z' },
  { id: 4, item_id: 1, secretaria_solicitante_id: 3, quantidade: 12, justificativa: 'Atende intenção de compra #3 — Cadeiras giratórias para o protocolo', status: 'transferida', intencao_id: 3, criado_em: '2026-05-04T16:15:00Z', atualizado_em: '2026-05-05T11:00:00Z' },
  { id: 5, item_id: 5, secretaria_solicitante_id: 1, quantidade: 60, justificativa: 'Reprodução de material didático do 1º semestre', status: 'transferida', intencao_id: null, criado_em: '2026-05-07T08:50:00Z', atualizado_em: '2026-05-09T13:20:00Z' },
  { id: 6, item_id: 11, secretaria_solicitante_id: 5, quantidade: 6, justificativa: 'Atende intenção de compra #4 — Ventiladores para a sala de espera do CRAS', status: 'transferida', intencao_id: 4, criado_em: '2026-05-10T15:05:00Z', atualizado_em: '2026-05-13T09:40:00Z' },
  { id: 7, item_id: 10, secretaria_solicitante_id: 1, quantidade: 1, justificativa: 'Cozinha da creche do Monte Cristo', status: 'transferida', intencao_id: null, criado_em: '2026-05-12T11:35:00Z', atualizado_em: '2026-05-13T14:15:00Z' },
  { id: 8, item_id: 12, secretaria_solicitante_id: 3, quantidade: 5, justificativa: 'Arquivo morto do setor de contratos', status: 'transferida', intencao_id: null, criado_em: '2026-05-15T13:25:00Z', atualizado_em: '2026-05-17T10:50:00Z' },
  { id: 9, item_id: 3, secretaria_solicitante_id: 2, quantidade: 8, justificativa: 'Atende intenção de compra #5 — Mesas para os consultórios da UBS Trindade', status: 'transferida', intencao_id: 5, criado_em: '2026-05-17T09:00:00Z', atualizado_em: '2026-05-20T16:05:00Z' },
  { id: 10, item_id: 9, secretaria_solicitante_id: 2, quantidade: 10, justificativa: 'Atende intenção de compra #6 — Toner para a regulação ambulatorial', status: 'transferida', intencao_id: 6, criado_em: '2026-05-20T14:20:00Z', atualizado_em: '2026-05-21T08:35:00Z' },
  { id: 11, item_id: 15, secretaria_solicitante_id: 5, quantidade: 20, justificativa: 'Unidades de acolhimento institucional', status: 'transferida', intencao_id: null, criado_em: '2026-05-22T10:40:00Z', atualizado_em: '2026-05-24T15:25:00Z' },
  { id: 12, item_id: 13, secretaria_solicitante_id: 4, quantidade: 6, justificativa: 'Atende intenção de compra #7 — Telefones IP para o plantão da defesa civil', status: 'transferida', intencao_id: 7, criado_em: '2026-05-25T16:15:00Z', atualizado_em: '2026-05-28T11:00:00Z' },
  { id: 13, item_id: 8, secretaria_solicitante_id: 6, quantidade: 15, justificativa: 'Auditório do parque municipal', status: 'transferida', intencao_id: null, criado_em: '2026-05-28T08:50:00Z', atualizado_em: '2026-05-29T13:20:00Z' },
  { id: 14, item_id: 6, secretaria_solicitante_id: 5, quantidade: 3, justificativa: 'Prontuários do serviço de proteção social', status: 'transferida', intencao_id: null, criado_em: '2026-05-30T15:05:00Z', atualizado_em: '2026-06-01T09:40:00Z' },
  { id: 15, item_id: 17, secretaria_solicitante_id: 1, quantidade: 8, justificativa: 'Atende intenção de compra #8 — Desinfetante para limpeza das quadras', status: 'transferida', intencao_id: 8, criado_em: '2026-06-02T11:35:00Z', atualizado_em: '2026-06-05T14:15:00Z' },
  { id: 16, item_id: 16, secretaria_solicitante_id: 2, quantidade: 30, justificativa: 'Copa e refeitório das unidades de saúde', status: 'transferida', intencao_id: null, criado_em: '2026-06-05T13:25:00Z', atualizado_em: '2026-06-06T10:50:00Z' },
  { id: 17, item_id: 18, secretaria_solicitante_id: 2, quantidade: 2, justificativa: 'Atende intenção de compra #9 — Ar-condicionado para a sala de vacinas', status: 'transferida', intencao_id: 9, criado_em: '2026-06-07T09:00:00Z', atualizado_em: '2026-06-09T16:05:00Z' },
  { id: 18, item_id: 21, secretaria_solicitante_id: 2, quantidade: 40, justificativa: 'Lavatórios das unidades básicas', status: 'transferida', intencao_id: null, criado_em: '2026-06-10T14:20:00Z', atualizado_em: '2026-06-13T08:35:00Z' },
  { id: 19, item_id: 19, secretaria_solicitante_id: 4, quantidade: 3, justificativa: 'Atende intenção de compra #10 — Rebitadores para a equipe de sinalização', status: 'transferida', intencao_id: 10, criado_em: '2026-06-13T10:40:00Z', atualizado_em: '2026-06-14T15:25:00Z' },
  { id: 20, item_id: 20, secretaria_solicitante_id: 6, quantidade: 6, justificativa: 'Atende intenção de compra #11 — Pás de corte para o manejo de canteiros', status: 'transferida', intencao_id: 11, criado_em: '2026-06-15T16:15:00Z', atualizado_em: '2026-06-17T11:00:00Z' },
  { id: 21, item_id: 14, secretaria_solicitante_id: 5, quantidade: 4, justificativa: 'Salas de oficina do CREAS', status: 'transferida', intencao_id: null, criado_em: '2026-06-18T08:50:00Z', atualizado_em: '2026-06-21T13:20:00Z' },
  { id: 22, item_id: 1, secretaria_solicitante_id: 6, quantidade: 8, justificativa: 'Sala técnica do licenciamento ambiental', status: 'transferida', intencao_id: null, criado_em: '2026-06-21T15:05:00Z', atualizado_em: '2026-06-22T09:40:00Z' },
  { id: 23, item_id: 10, secretaria_solicitante_id: 2, quantidade: 1, justificativa: 'Atende intenção de compra #12 — Geladeira para armazenar imunobiológicos', status: 'transferida', intencao_id: 12, criado_em: '2026-06-23T11:35:00Z', atualizado_em: '2026-06-25T14:15:00Z' },
  { id: 24, item_id: 11, secretaria_solicitante_id: 1, quantidade: 5, justificativa: 'Salas de aula do CEI Abraão', status: 'transferida', intencao_id: null, criado_em: '2026-06-26T13:25:00Z', atualizado_em: '2026-06-29T10:50:00Z' },
  { id: 25, item_id: 2, secretaria_solicitante_id: 2, quantidade: 3, justificativa: 'Recepção da UPA Norte', status: 'transferida', intencao_id: null, criado_em: '2026-06-29T09:00:00Z', atualizado_em: '2026-06-30T16:05:00Z' },
  { id: 26, item_id: 12, secretaria_solicitante_id: 1, quantidade: 4, justificativa: 'Atende intenção de compra #13 — Estantes para o almoxarifado escolar', status: 'transferida', intencao_id: 13, criado_em: '2026-07-02T14:20:00Z', atualizado_em: '2026-07-04T08:35:00Z' },
  { id: 27, item_id: 3, secretaria_solicitante_id: 3, quantidade: 6, justificativa: 'Setor de compras do centro administrativo', status: 'transferida', intencao_id: null, criado_em: '2026-07-05T10:40:00Z', atualizado_em: '2026-07-08T15:25:00Z' },
  { id: 28, item_id: 5, secretaria_solicitante_id: 5, quantidade: 80, justificativa: 'Atende intenção de compra #14 — Papel A4 para os programas socioassistenciais', status: 'transferida', intencao_id: 14, criado_em: '2026-07-09T16:15:00Z', atualizado_em: '2026-07-10T11:00:00Z' },

  { id: 29, item_id: 6, secretaria_solicitante_id: 2, quantidade: 3, justificativa: 'Guarda de prontuários da UBS Agronômica', status: 'aprovada', intencao_id: null, criado_em: '2026-07-16T10:15:00Z', atualizado_em: '2026-07-17T09:30:00Z' },
  { id: 30, item_id: 18, secretaria_solicitante_id: 5, quantidade: 1, justificativa: 'Sala de atendimento do CRAS Saco Grande', status: 'pendente', intencao_id: null, criado_em: '2026-07-20T14:40:00Z', atualizado_em: '2026-07-20T14:40:00Z' },
  { id: 31, item_id: 13, secretaria_solicitante_id: 6, quantidade: 4, justificativa: 'Fiscalização ambiental — ramais do plantão', status: 'pendente', intencao_id: null, criado_em: '2026-07-21T11:05:00Z', atualizado_em: '2026-07-21T11:05:00Z' },
]

// Intenções de compra (§3.5). 14 convertidas — cada uma ligada a uma transferência
// acima, então economia e conversão contam a mesma história — e 7 mantidas, em que
// a secretaria comprou mesmo assim e registrou o motivo. Taxa de interceptação:
// 14/21 = 67%.
//
// Sem valor_unitario_estimado: a economia sai do preço de referência do item no
// catálogo, nunca de um valor informado por quem registra a intenção.
export const INTENCOES = [
  { id: 1, secretaria_id: 2, descricao: 'Projetor para as capacitações da vigilância', categoria_id: 2, quantidade: 1, catmat_code: null, status: 'convertida', quantidade_atendida: 1, motivo_compra: null, criado_em: '2026-04-26T10:30:00Z' },
  { id: 2, secretaria_id: 6, descricao: 'Monitores para o setor de licenciamento', categoria_id: 2, quantidade: 4, catmat_code: null, status: 'convertida', quantidade_atendida: 4, motivo_compra: null, criado_em: '2026-05-01T10:30:00Z' },
  { id: 3, secretaria_id: 3, descricao: 'Cadeiras giratórias para o protocolo', categoria_id: 1, quantidade: 12, catmat_code: null, status: 'convertida', quantidade_atendida: 12, motivo_compra: null, criado_em: '2026-05-03T10:30:00Z' },
  { id: 4, secretaria_id: 5, descricao: 'Ventiladores para a sala de espera do CRAS', categoria_id: 5, quantidade: 6, catmat_code: null, status: 'convertida', quantidade_atendida: 6, motivo_compra: null, criado_em: '2026-05-09T10:30:00Z' },
  { id: 5, secretaria_id: 2, descricao: 'Mesas para os consultórios da UBS Trindade', categoria_id: 1, quantidade: 8, catmat_code: null, status: 'convertida', quantidade_atendida: 8, motivo_compra: null, criado_em: '2026-05-16T10:30:00Z' },
  { id: 6, secretaria_id: 2, descricao: 'Toner para a regulação ambulatorial', categoria_id: 3, quantidade: 10, catmat_code: null, status: 'convertida', quantidade_atendida: 10, motivo_compra: null, criado_em: '2026-05-19T10:30:00Z' },
  { id: 7, secretaria_id: 4, descricao: 'Telefones IP para o plantão da defesa civil', categoria_id: 2, quantidade: 6, catmat_code: null, status: 'convertida', quantidade_atendida: 6, motivo_compra: null, criado_em: '2026-05-24T10:30:00Z' },
  { id: 8, secretaria_id: 1, descricao: 'Desinfetante para limpeza das quadras', categoria_id: 4, quantidade: 8, catmat_code: null, status: 'convertida', quantidade_atendida: 8, motivo_compra: null, criado_em: '2026-06-01T10:30:00Z' },
  { id: 9, secretaria_id: 2, descricao: 'Ar-condicionado para a sala de vacinas', categoria_id: 5, quantidade: 2, catmat_code: null, status: 'convertida', quantidade_atendida: 2, motivo_compra: null, criado_em: '2026-06-06T10:30:00Z' },
  { id: 10, secretaria_id: 4, descricao: 'Rebitadores para a equipe de sinalização', categoria_id: 7, quantidade: 3, catmat_code: null, status: 'convertida', quantidade_atendida: 3, motivo_compra: null, criado_em: '2026-06-12T10:30:00Z' },
  { id: 11, secretaria_id: 6, descricao: 'Pás de corte para o manejo de canteiros', categoria_id: 7, quantidade: 6, catmat_code: null, status: 'convertida', quantidade_atendida: 6, motivo_compra: null, criado_em: '2026-06-14T10:30:00Z' },
  { id: 12, secretaria_id: 2, descricao: 'Geladeira para armazenar imunobiológicos', categoria_id: 5, quantidade: 1, catmat_code: null, status: 'convertida', quantidade_atendida: 1, motivo_compra: null, criado_em: '2026-06-22T10:30:00Z' },
  { id: 13, secretaria_id: 1, descricao: 'Estantes para o almoxarifado escolar', categoria_id: 1, quantidade: 4, catmat_code: null, status: 'convertida', quantidade_atendida: 4, motivo_compra: null, criado_em: '2026-07-01T10:30:00Z' },
  { id: 14, secretaria_id: 5, descricao: 'Papel A4 para os programas socioassistenciais', categoria_id: 3, quantidade: 80, catmat_code: null, status: 'convertida', quantidade_atendida: 80, motivo_compra: null, criado_em: '2026-07-08T10:30:00Z' },
  { id: 15, secretaria_id: 2, descricao: 'Cadeiras de rodas para o transporte de pacientes', categoria_id: 5, quantidade: 12, catmat_code: null, status: 'mantida_compra', quantidade_atendida: 0, motivo_compra: 'Item de uso clínico, sem equivalente no catálogo', criado_em: '2026-05-11T11:10:00Z' },
  { id: 16, secretaria_id: 1, descricao: 'Lousas digitais para as salas de tecnologia', categoria_id: 2, quantidade: 8, catmat_code: null, status: 'mantida_compra', quantidade_atendida: 0, motivo_compra: 'Especificação técnica não atendida pelos itens disponíveis', criado_em: '2026-05-20T11:10:00Z' },
  { id: 17, secretaria_id: 4, descricao: 'Cimento CP-II para reparos em calçadas', categoria_id: 6, quantidade: 200, catmat_code: null, status: 'mantida_compra', quantidade_atendida: 0, motivo_compra: 'Material de obra, fora do escopo do almoxarifado compartilhado', criado_em: '2026-05-29T11:10:00Z' },
  { id: 18, secretaria_id: 3, descricao: 'Licenças de assinatura digital', categoria_id: 6, quantidade: 40, catmat_code: null, status: 'mantida_compra', quantidade_atendida: 0, motivo_compra: 'Bem intangível, não há item físico equivalente', criado_em: '2026-06-07T11:10:00Z' },
  { id: 19, secretaria_id: 6, descricao: 'Mudas de árvores nativas para arborização', categoria_id: 6, quantidade: 500, catmat_code: null, status: 'mantida_compra', quantidade_atendida: 0, motivo_compra: 'Insumo vivo, sem estoque compartilhável', criado_em: '2026-06-16T11:10:00Z' },
  { id: 20, secretaria_id: 5, descricao: 'Cestas básicas para o programa emergencial', categoria_id: 6, quantidade: 300, catmat_code: null, status: 'mantida_compra', quantidade_atendida: 0, motivo_compra: 'Aquisição vinculada a convênio específico', criado_em: '2026-06-25T11:10:00Z' },
  { id: 21, secretaria_id: 2, descricao: 'Termômetros clínicos digitais', categoria_id: 6, quantidade: 60, catmat_code: null, status: 'mantida_compra', quantidade_atendida: 0, motivo_compra: 'Exige certificação sanitária própria do lote', criado_em: '2026-07-04T11:10:00Z' },
]
