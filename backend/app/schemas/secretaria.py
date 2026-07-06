from sqlmodel import SQLModel


class SecretariaBase(SQLModel):
    nome: str
    sigla: str


class SecretariaCreate(SecretariaBase):
    pass


class SecretariaUpdate(SQLModel):
    nome: str | None = None
    sigla: str | None = None


class SecretariaRead(SecretariaBase):
    id: int
