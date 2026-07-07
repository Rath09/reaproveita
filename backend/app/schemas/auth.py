from sqlmodel import SQLModel

from app.schemas.usuario import UsuarioRead


class LoginRequest(SQLModel):
    email: str
    senha: str


class TokenResponse(SQLModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    usuario: UsuarioRead

