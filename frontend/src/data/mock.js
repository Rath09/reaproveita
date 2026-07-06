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
]

// Usuários de demonstração (o seletor de papel do topo alterna entre eles).
export const USUARIOS = {
  secretaria: { id: 1, nome: 'Ana Souza', papel: 'secretaria', secretaria_id: 2 }, // SMS
  gestor: { id: 2, nome: 'Carlos Lima', papel: 'gestor', secretaria_id: null },
}

// Campos por item (contrato §3.3): quantidade_reservada, saldo_livre e status
// são derivados no "back" (aqui, em api.js) — os valores abaixo são o estado inicial.
export const ITENS = [
  { id: 1,  nome: 'Cadeira giratória com braços', descricao: 'Tecido preto, base cromada', patrimonio: 'PMF-2019-00871', categoria_id: 1, secretaria_id: 1, quantidade: 60, quantidade_reservada: 0, estado_conservacao: 'bom',     valor_unitario_estimado: 180.0,  catmat_code: '451021', criado_em: '2026-06-28T13:00:00Z' },
  { id: 2,  nome: 'Monitor LED 21,5"', descricao: 'Entrada HDMI/VGA, sem base quebrada', patrimonio: 'PMF-2021-01455', categoria_id: 2, secretaria_id: 3, quantidade: 12, quantidade_reservada: 0, estado_conservacao: 'otimo',   valor_unitario_estimado: 420.0,  catmat_code: null, criado_em: '2026-06-28T13:10:00Z' },
  { id: 3,  nome: 'Mesa de escritório 1,20m', descricao: 'MDF cinza, 2 gavetas', patrimonio: 'PMF-2018-00344', categoria_id: 1, secretaria_id: 4, quantidade: 25, quantidade_reservada: 0, estado_conservacao: 'regular', valor_unitario_estimado: 260.0,  catmat_code: null, criado_em: '2026-06-28T13:20:00Z' },
  { id: 4,  nome: 'Notebook 14" i5 8GB', descricao: 'Uso administrativo, bateria ok', patrimonio: 'PMF-2020-02210', categoria_id: 2, secretaria_id: 2, quantidade: 8,  quantidade_reservada: 0, estado_conservacao: 'bom',     valor_unitario_estimado: 1900.0, catmat_code: null, criado_em: '2026-06-28T13:30:00Z' },
  { id: 5,  nome: 'Papel A4 75g (resma)', descricao: 'Estoque excedente de licitação', patrimonio: 'PMF-2025-00911', categoria_id: 3, secretaria_id: 3, quantidade: 300, quantidade_reservada: 0, estado_conservacao: 'novo',  valor_unitario_estimado: 24.9,   catmat_code: '279904', criado_em: '2026-06-28T13:40:00Z' },
  { id: 6,  nome: 'Arquivo de aço 4 gavetas', descricao: 'Cinza, com chave', patrimonio: 'PMF-2017-00120', categoria_id: 1, secretaria_id: 1, quantidade: 10, quantidade_reservada: 0, estado_conservacao: 'bom',     valor_unitario_estimado: 350.0,  catmat_code: null, criado_em: '2026-06-28T13:50:00Z' },
  { id: 7,  nome: 'Projetor multimídia 3600 lumens', descricao: 'Com cabo HDMI e controle', patrimonio: 'PMF-2022-00077', categoria_id: 2, secretaria_id: 1, quantidade: 3, quantidade_reservada: 0, estado_conservacao: 'otimo', valor_unitario_estimado: 2300.0, catmat_code: null, criado_em: '2026-06-29T09:00:00Z' },
  { id: 8,  nome: 'Cadeira fixa estofada', descricao: 'Azul, empilhável', patrimonio: 'PMF-2016-00980', categoria_id: 1, secretaria_id: 2, quantidade: 40, quantidade_reservada: 0, estado_conservacao: 'regular', valor_unitario_estimado: 95.0,   catmat_code: null, criado_em: '2026-06-29T09:10:00Z' },
  { id: 9,  nome: 'Toner HP 85A (original)', descricao: 'Lacrado, compra duplicada', patrimonio: 'PMF-2025-01500', categoria_id: 3, secretaria_id: 3, quantidade: 45, quantidade_reservada: 0, estado_conservacao: 'novo',  valor_unitario_estimado: 310.0,  catmat_code: null, criado_em: '2026-06-29T09:20:00Z' },
  { id: 10, nome: 'Geladeira frost free 340L', descricao: 'Branca, funcionando', patrimonio: 'PMF-2019-00650', categoria_id: 5, secretaria_id: 5, quantidade: 2,  quantidade_reservada: 0, estado_conservacao: 'bom',     valor_unitario_estimado: 1800.0, catmat_code: null, criado_em: '2026-06-29T09:30:00Z' },
  { id: 11, nome: 'Ventilador de parede 60cm', descricao: 'Preto, oscilante', patrimonio: 'PMF-2021-00432', categoria_id: 5, secretaria_id: 4, quantidade: 18, quantidade_reservada: 0, estado_conservacao: 'bom',     valor_unitario_estimado: 240.0,  catmat_code: null, criado_em: '2026-06-29T09:40:00Z' },
  { id: 12, nome: 'Estante de aço 6 prateleiras', descricao: 'Desmontada, completa', patrimonio: 'PMF-2018-00777', categoria_id: 1, secretaria_id: 6, quantidade: 14, quantidade_reservada: 0, estado_conservacao: 'regular', valor_unitario_estimado: 280.0, catmat_code: null, criado_em: '2026-06-29T10:00:00Z' },
  { id: 13, nome: 'Telefone IP com fonte', descricao: 'Compatível com central atual', patrimonio: 'PMF-2020-01890', categoria_id: 2, secretaria_id: 3, quantidade: 20, quantidade_reservada: 0, estado_conservacao: 'otimo', valor_unitario_estimado: 380.0,  catmat_code: null, criado_em: '2026-06-29T10:10:00Z' },
  { id: 14, nome: 'Quadro branco 2,0 x 1,2m', descricao: 'Com suporte de parede', patrimonio: 'PMF-2019-00233', categoria_id: 6, secretaria_id: 1, quantidade: 9,  quantidade_reservada: 0, estado_conservacao: 'bom',     valor_unitario_estimado: 190.0,  catmat_code: null, criado_em: '2026-06-29T10:20:00Z' },
  { id: 15, nome: 'Álcool em gel 70% galão 5L', descricao: 'Validade 2027, excedente', patrimonio: 'PMF-2025-02001', categoria_id: 4, secretaria_id: 2, quantidade: 60, quantidade_reservada: 0, estado_conservacao: 'novo', valor_unitario_estimado: 55.0,   catmat_code: null, criado_em: '2026-06-29T10:30:00Z' },
]

// Duas requisições de exemplo: uma já transferida (para o KPI abrir com valor)
// e uma aprovada (para demonstrar a confirmação de transferência ao vivo).
export const REQUISICOES = [
  { id: 1, item_id: 3, secretaria_solicitante_id: 5, quantidade: 6, justificativa: 'Sala de atendimento do CRAS Norte', status: 'transferida', intencao_id: null, criado_em: '2026-06-30T14:00:00Z', atualizado_em: '2026-07-01T11:00:00Z' },
  { id: 2, item_id: 2, secretaria_solicitante_id: 1, quantidade: 4, justificativa: 'Laboratório de informática — monitores queimados', status: 'aprovada', intencao_id: null, criado_em: '2026-07-01T15:00:00Z', atualizado_em: '2026-07-02T10:00:00Z' },
]
