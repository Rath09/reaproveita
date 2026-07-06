from typing import Literal
from decimal import Decimal
from datetime import datetime

from sqlmodel import SQLModel

EstadoConservacao = Literal["novo", "otimo", "bom", "regular", "ruim"]


class ItemBase(SQLModel):
    nome: str
    descricao: str
    patrimonio: str
    categoria_id: int
    secretaria_id: int
    quantidade: int
    estado_conservacao: EstadoConservacao
    valor_unitario_estimado: Decimal
    catmat_code: str


class ItemCreate(ItemBase):
    pass  # quantidade_reservada nasce em 0 e criado_em é automático — cliente não envia nenhum dos dois


class ItemUpdate(SQLModel):
    nome: str | None = None
    descricao: str | None = None
    patrimonio: str | None = None
    categoria_id: int | None = None
    secretaria_id: int | None = None
    quantidade: int | None = None
    estado_conservacao: EstadoConservacao | None = None
    valor_unitario_estimado: Decimal | None = None
    catmat_code: str | None = None


class ItemRead(ItemBase):
    id: int
    quantidade_reservada: int
    criado_em: datetime

