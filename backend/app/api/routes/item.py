from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session

from app.api.deps import get_session, get_usuario_atual
from app.core.exceptions import ItemNaoEncontradoError
from app.schemas.common import PaginatedResponse
from app.schemas.item import ItemCreate, ItemRead, ItemUpdate
from app.services import item as service_item

router = APIRouter(prefix="/itens", tags=["itens"], dependencies=[Depends(get_usuario_atual)])


@router.post("", response_model=ItemRead, status_code=201)
def criar_item(dados: ItemCreate, session: Session = Depends(get_session)):
    return service_item.criar_item(session, dados)


@router.get("/{item_id}", response_model=ItemRead)
def obter_item(item_id: int, session: Session = Depends(get_session)):
    try:
        return service_item.obter_item(session, item_id)
    except ItemNaoEncontradoError:
        raise HTTPException(status_code=404, detail="item não encontrado")


@router.get("", response_model=PaginatedResponse[ItemRead])
def listar_itens(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    session: Session = Depends(get_session),
):
    itens, total = service_item.listar_itens(session, page, page_size)
    return PaginatedResponse(dados=itens, total=total, page=page, page_size=page_size)


@router.patch("/{item_id}", response_model=ItemRead)
def atualizar_item(item_id: int, dados: ItemUpdate, session: Session = Depends(get_session)):
    try:
        return service_item.atualizar_item(session, item_id, dados)
    except ItemNaoEncontradoError:
        raise HTTPException(status_code=404, detail="item não encontrado")

