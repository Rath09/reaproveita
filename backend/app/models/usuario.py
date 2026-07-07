from sqlmodel import SQLModel, Field


class Usuario(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    nome: str = Field(nullable=False)
    email: str = Field(nullable=False, unique=True, index=True)
    senha_hash: str = Field(nullable=False)
    papel: str = Field(nullable=False)
    secretaria_id: int = Field(foreign_key="secretaria.id", ondelete="RESTRICT", index=True)

