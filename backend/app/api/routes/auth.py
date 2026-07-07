from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from app.api.deps import get_session
from app.core.config import settings
from app.core.exceptions import CredenciaisInvalidasError
from app.schemas.auth import LoginRequest, TokenResponse
from app.services import auth as service_auth

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
def login(dados: LoginRequest, session: Session = Depends(get_session)):
    try:
        usuario, token = service_auth.autenticar(session, dados.email, dados.senha)
    except CredenciaisInvalidasError:
        raise HTTPException(status_code=401, detail="credenciais inválidas")

    return TokenResponse(access_token=token, expires_in=settings.jwt_expire_seconds, usuario=usuario)

