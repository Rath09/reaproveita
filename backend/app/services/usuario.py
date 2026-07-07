from sqlmodel import Session

from app.core.exceptions import EmailJaCadastradoError, UsuarioNaoEncontradoError
from app.core.security import hash_senha
from app.models.usuario import Usuario
from app.repositories import usuario as repo_usuario
from app.schemas.usuario import UsuarioCreate, UsuarioUpdate


def criar_usuario(session: Session, dados: UsuarioCreate) -> Usuario:
    if repo_usuario.buscar_por_email(session, dados.email) is not None:
        raise EmailJaCadastradoError(dados.email)

    dados_usuario = dados.model_dump(exclude={"senha"})
    usuario = Usuario(**dados_usuario, senha_hash=hash_senha(dados.senha))
    return repo_usuario.inserir(session, usuario)


def obter_usuario(session: Session, usuario_id: int) -> Usuario:
    usuario = repo_usuario.buscar_por_id(session, usuario_id)
    if usuario is None:
        raise UsuarioNaoEncontradoError(usuario_id)
    return usuario


def listar_usuarios(session: Session, page: int, page_size: int) -> tuple[list[Usuario], int]:
    offset = (page - 1) * page_size
    usuarios = repo_usuario.listar(session, offset, page_size)
    total = repo_usuario.contar_total(session)
    return usuarios, total


def atualizar_usuario(session: Session, usuario_id: int, dados: UsuarioUpdate) -> Usuario:
    usuario = obter_usuario(session, usuario_id)  # já lança UsuarioNaoEncontradoError

    dados_enviados = dados.model_dump(exclude_unset=True)  # só o que o cliente mandou

    if "senha" in dados_enviados:
        senha_nova = dados_enviados.pop("senha")
        dados_enviados["senha_hash"] = hash_senha(senha_nova)

    if "email" in dados_enviados and dados_enviados["email"] != usuario.email:
        if repo_usuario.buscar_por_email(session, dados_enviados["email"]) is not None:
            raise EmailJaCadastradoError(dados_enviados["email"])

    return repo_usuario.atualizar(session, usuario, dados_enviados)

