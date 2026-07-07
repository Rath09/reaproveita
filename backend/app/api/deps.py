from typing import Generator

import jwt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlmodel import Session

from app.core.security import decodificar_access_token
from app.db.session import engine
from app.models.usuario import Usuario
from app.repositories import usuario as repo_usuario

# auto_error=False é proposital: dependendo da versão do FastAPI, o
# comportamento padrão do HTTPBearer devolve 403 quando falta o header,
# em vez de 401. Assumindo controle manual aqui, o código fica
# determinístico independente da versão instalada.
security_scheme = HTTPBearer(auto_error=False)


def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session


def get_usuario_atual(
    credenciais: HTTPAuthorizationCredentials | None = Depends(security_scheme),
    session: Session = Depends(get_session),
) -> Usuario:
    if credenciais is None:
        raise HTTPException(status_code=401, detail="token ausente")

    try:
        payload = decodificar_access_token(credenciais.credentials)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="token expirado")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="token inválido")

    usuario = repo_usuario.buscar_por_id(session, int(payload["sub"]))
    if usuario is None:
        raise HTTPException(status_code=401, detail="usuário do token não existe mais")
    return usuario


def exigir_papel(*papeis_permitidos: str):
    """Uso: Depends(exigir_papel("admin")). Compara contra Usuario.papel (banco), não contra o rótulo do token."""

    def dependency(usuario: Usuario = Depends(get_usuario_atual)) -> Usuario:
        if usuario.papel not in papeis_permitidos:
            raise HTTPException(status_code=403, detail="acesso negado para este papel")
        return usuario

    return dependency

