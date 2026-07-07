from typing import Literal

from pydantic import EmailStr
from sqlmodel import SQLModel, Field

Papel = Literal["gestor", "secretaria"]


class UsuarioBase(SQLModel):
    nome: str
    email: EmailStr
    papel: Papel
    secretaria_id: int


class UsuarioCreate(UsuarioBase):
    senha: str = Field(min_length=8)  # texto puro; hash acontece no service, antes de bater no banco


class UsuarioUpdate(SQLModel):
    nome: str | None = None
    email: EmailStr | None = None
    papel: Papel | None = None
    secretaria_id: int | None = None
    senha: str | None = Field(default=None, min_length=8)


class UsuarioRead(UsuarioBase):
    id: int
    # senha_hash nunca entra aqui — schema de saída não expõe hash

