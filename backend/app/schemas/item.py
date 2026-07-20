from typing import Literal
from decimal import Decimal
from datetime import datetime

from pydantic import computed_field
from sqlmodel import SQLModel

EstadoConservacao = Literal["novo", "otimo", "bom", "regular", "ruim"]
StatusItem = Literal["disponivel", "reservado", "transferido"]



from dataclasses import dataclass

@dataclass
class FiltrosItem:
    q: str | None = None
    categoria_id: int | None = None
    estado_conservacao: EstadoConservacao | None = None
    status: StatusItem | None = None
    secretaria_id: int | None = None
    older_than: datetime | None = None


class ItemBase(SQLModel):
    nome: str
    descricao: str
    patrimonio: str
    categoria_id: int
    #secretaria_id: int  # pegar direto pelo token, sem brecha pra preencher secretaria_id que não pertence
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
    #secretaria_id: int | None = None  # impossibilita mover item para outra secretaria - somente por requisicao
    quantidade: int | None = None
    estado_conservacao: EstadoConservacao | None = None
    valor_unitario_estimado: Decimal | None = None
    catmat_code: str | None = None


class ItemRead(ItemBase):
    id: int
    secretaria_id: int
    quantidade_reservada: int
    criado_em: datetime

    @computed_field
    @property
    def saldo_livre(self) -> int:
        return self.quantidade - self.quantidade_reservada

    @computed_field
    @property
    def status(self) -> StatusItem:
        if self.saldo_livre > 0:
            return "disponivel"
        if self.quantidade > 0:
            return "reservado"
        return "transferido"

