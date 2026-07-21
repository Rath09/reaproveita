from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session

from app.api.deps import get_session, get_usuario_atual
from app.core.exceptions import ItemNaoEncontradoError, SemPermissaoSecretariaError, QuantidadeAbaixoDaReservadaError
from app.schemas.common import PaginatedResponse
from app.schemas.item import ItemCreate, ItemRead, ItemUpdate, FiltrosItem, StatusItem, EstadoConservacao
from app.services import item as service_item

from app.models.usuario import Usuario

router = APIRouter(prefix="/itens", tags=["itens"], dependencies=[Depends(get_usuario_atual)])


@router.post("", response_model=ItemRead, status_code=201)
def criar_item(
    dados: ItemCreate,
    session: Session = Depends(get_session),
    usuario_atual: Usuario = Depends(get_usuario_atual)
):
    return service_item.criar_item(session, dados, usuario_atual.secretaria_id)


@router.get("/{item_id}", response_model=ItemRead)
def obter_item(
    item_id: int,
    session: Session = Depends(get_session)
):
    try:
        return service_item.obter_item(session, item_id)
    except ItemNaoEncontradoError:
        raise HTTPException(status_code=404, detail="item não encontrado")


@router.get("", response_model=PaginatedResponse[ItemRead])
def listar_itens(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    q: str | None = Query(default=None, min_length=1, description="Busca em nome e patrimônio"),
    categoria_id: int | None = Query(default=None),
    estado_conservacao: EstadoConservacao | None = Query(default=None),
    status: StatusItem | None = Query(default=None),
    secretaria_id: int | None = Query(default=None),
    older_than: int | None = Query(default=None),
    session: Session = Depends(get_session),
):
    threshold = None if older_than is None else datetime.now() - timedelta(days=older_than)
    filtros = FiltrosItem(
        q=q,
        categoria_id=categoria_id,
        estado_conservacao=estado_conservacao,
        status=status,
        secretaria_id=secretaria_id,
        older_than=threshold,
    )
    itens, total = service_item.listar_itens(session, page, page_size, filtros)
    return PaginatedResponse(dados=itens, total=total, page=page, page_size=page_size)


@router.patch("/{item_id}", response_model=ItemRead)
def atualizar_item(
    item_id: int,
    dados: ItemUpdate,
    session: Session = Depends(get_session),
    usuario_atual: Usuario = Depends(get_usuario_atual)
):
    try:
        return service_item.atualizar_item(session, item_id, dados, usuario_atual.secretaria_id)
    except ItemNaoEncontradoError:
        raise HTTPException(status_code=404, detail="item não encontrado")
    except SemPermissaoSecretariaError as erro:
        raise HTTPException(status_code=403, detail=f"sem permissão para editar item da secretaria {erro}")
    except QuantidadeAbaixoDaReservadaError:
        raise HTTPException(status_code=409, detail=f"quantidade abaixa da reservada")
    
