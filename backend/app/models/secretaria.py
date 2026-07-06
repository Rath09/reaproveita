from sqlmodel import SQLModel, Field


class Secretaria(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    nome: str = Field(nullable=False)
    sigla: str = Field(nullable=False)
