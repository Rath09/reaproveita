import bcrypt
from datetime import datetime, timedelta, timezone

import jwt

from app.core.config import settings


def hash_senha(senha: str) -> str:
    """Gera o hash bcrypt de uma senha em texto puro."""
    senha_bytes = senha.encode("utf-8")
    hash_bytes = bcrypt.hashpw(senha_bytes, bcrypt.gensalt())
    return hash_bytes.decode("utf-8")


def verificar_senha(senha_plana: str, senha_hash: str) -> bool:
    """Compara senha em texto puro com o hash salvo no banco. Usado no login."""
    return bcrypt.checkpw(senha_plana.encode("utf-8"), senha_hash.encode("utf-8"))


def criar_access_token(usuario_id: int, papel_db: str, secretaria_id: int) -> str:
    agora = datetime.now(timezone.utc)
    payload = {
        "sub": str(usuario_id),
        "papel": papel_db,
        "secretaria_id": secretaria_id,
        "exp": agora + timedelta(seconds=settings.jwt_expire_seconds),
    }
    return jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)


def decodificar_access_token(token: str) -> dict:
    """Levanta jwt.ExpiredSignatureError ou jwt.InvalidTokenError — quem chama traduz pra HTTP."""
    return jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])

