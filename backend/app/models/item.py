from sqlmodel import SQLModel, Field
from datetime import datetime, timezone
from decimal import Decimal

from sqlalchemy import Column, Numeric


class Item(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    nome: str = Field(nullable=False)
    descricao: str = Field(nullable=False)
    patrimonio: str = Field(nullable=False)
    categoria_id: int = Field(foreign_key="categoria.id", ondelete="RESTRICT", index=True)
    secretaria_id: int = Field(foreign_key="secretaria.id", ondelete="RESTRICT", index=True)
    quantidade: int = Field(nullable=False)
    quantidade_reservada: int = Field(default=0, nullable=False)
    estado_conservacao: str = Field(nullable=False)
    valor_unitario_estimado: Decimal = Field(sa_column=Column(Numeric(15, 2), nullable=False))
    catmat_code: str = Field(nullable=True)
    criado_em: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)

