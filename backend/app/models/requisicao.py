from datetime import datetime, timezone

from sqlmodel import SQLModel, Field


class Requisicao(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    item_id: int = Field(foreign_key="item.id", ondelete="RESTRICT", index=True)
    secretaria_solicitante_id: int = Field(foreign_key="secretaria.id", ondelete="RESTRICT", index=True)
    quantidade: int = Field(nullable=False)
    justificativa: str = Field(nullable=False)
    status: str = Field(nullable=False, default="pendente")
    intencao_id: int | None = Field(default=None, nullable=True)  # sem FK — tabela intencao ainda não existe (§3.5)
    criado_em: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)
    atualizado_em: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)

