from decimal import Decimal

from sqlmodel import SQLModel


class KpiResponse(SQLModel):
    compras_evitadas_valor: Decimal
    itens_transferidos: int
    requisicoes_concluidas: int
