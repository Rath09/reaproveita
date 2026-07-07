from sqlmodel import Session

from app.core.exceptions import CredenciaisInvalidasError
from app.core.security import criar_access_token, verificar_senha
from app.models.usuario import Usuario
from app.repositories import usuario as repo_usuario


def autenticar(session: Session, email: str, senha: str) -> tuple[Usuario, str]:
    usuario = repo_usuario.buscar_por_email(session, email)
    if usuario is None or not verificar_senha(senha, usuario.senha_hash):
        raise CredenciaisInvalidasError()

    token = criar_access_token(usuario.id, usuario.papel, usuario.secretaria_id)
    return usuario, token

