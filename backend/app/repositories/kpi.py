from decimal import Decimal

from sqlalchemy import func
from sqlmodel import Session, select

from app.models.item import Item
from app.models.requisicao import Requisicao

--COMPRAS EVITADAS KPI
SELECT COALESCE(SUM(requisicao.quantidade * item.valor_unitario_estimado), 0) AS total
FROM requisicao
JOIN item ON item.id = requisicao.item_id
WHERE requisicao.status = 'transferida'

--ITENS TRANSFERIDOS KPI

SELECT COUNT(*) AS total
FROM requisicao
WHERE requisicao.status = 'transferida';

--REQUISIÇÕES CONCLUIDAS KPI

SELECT COUNT(*) AS total
FROM requisicao
WHERE requisicao.status = 'transferida';

-- INTENÇAO TOTAL

SELECT COUNT(*) AS total
FROM intencao;

--ITENÇÃO CONVERTIDA

SELECT COUNT(*) AS total
FROM intencao
WHERE status = 'convertida';

-- TAXA DE INTENÇÃO

SELECT CASE WHEN COUNT(*) = 0 THEN 0.0
       ELSE CAST(SUM(CASE WHEN status = 'convertida' THEN 1 ELSE 0 END) AS FLOAT) / COUNT(*)
       END AS taxa
FROM intencao;
