from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session

from app.api.deps import exigir_papel, get_session, get_usuario_atual
from app.core.exceptions import EmailJaCadastradoError, UsuarioNaoEncontradoError
from app.schemas.common import PaginatedResponse
from app.schemas.usuario import UsuarioCreate, UsuarioRead, UsuarioUpdate
from app.services import usuario as service_usuario

from app.models.usuario import Usuario

router = APIRouter(prefix="/usuarios", tags=["usuarios"], dependencies=[Depends(get_usuario_atual)])


@router.post("", response_model=UsuarioRead, status_code=201)
def criar_usuario(dados: UsuarioCreate, session: Session = Depends(get_session), _: Usuario = Depends(exigir_papel("gestor"))):
    try:
        return service_usuario.criar_usuario(session, dados)
    except EmailJaCadastradoError as erro:
        raise HTTPException(status_code=409, detail=f"e-mail {erro} já cadastrado")


@router.get("/{usuario_id}", response_model=UsuarioRead)
def obter_usuario(usuario_id: int, session: Session = Depends(get_session)):
    try:
        return service_usuario.obter_usuario(session, usuario_id)
    except UsuarioNaoEncontradoError:
        raise HTTPException(status_code=404, detail="usuario não encontrado")


@router.get("", response_model=PaginatedResponse[UsuarioRead])
def listar_usuarios(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    session: Session = Depends(get_session),
):
    usuarios, total = service_usuario.listar_usuarios(session, page, page_size)
    return PaginatedResponse(dados=usuarios, total=total, page=page, page_size=page_size)


@router.patch("/{usuario_id}", response_model=UsuarioRead)
def atualizar_usuario(usuario_id: int, dados: UsuarioUpdate, session: Session = Depends(get_session), _: Usuario = Depends(exigir_papel("gestor"))):
    try:
        return service_usuario.atualizar_usuario(session, usuario_id, dados)
    except UsuarioNaoEncontradoError:
        raise HTTPException(status_code=404, detail="usuario não encontrado")
    except EmailJaCadastradoError as erro:
        raise HTTPException(status_code=409, detail=f"e-mail {erro} já cadastrado")

