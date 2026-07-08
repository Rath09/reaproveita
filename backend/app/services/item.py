from sqlmodel import Session

from app.core.exceptions import ItemNaoEncontradoError, SemPermissaoSecretariaError
from app.models.item import Item
from app.repositories import item as repo_item
from app.schemas.item import ItemCreate, ItemUpdate


def criar_item(session: Session, dados: ItemCreate, secretaria_id: int) -> Item:
    item = Item(**dados.model_dump(), secretaria_id=secretaria_id)  # quantidade_reservada usa o default=0 do model, criado_em usa default_factory
    return repo_item.inserir(session, item)


def obter_item(session: Session, item_id: int) -> Item:
    item = repo_item.buscar_por_id(session, item_id)
    if item is None:
        raise ItemNaoEncontradoError(item_id)
    return item


def listar_itens(session: Session, page: int, page_size: int) -> tuple[list[Item], int]:
    offset = (page - 1) * page_size
    itens = repo_item.listar(session, offset, page_size)
    total = repo_item.contar_total(session)
    return itens, total


def atualizar_item(session: Session, item_id: int, dados: ItemUpdate, secretaria_id: int) -> Item:
    item = obter_item(session, item_id)  # já lança ItemNaoEncontradoError
    if item.secretaria_id != secretaria_id:
        raise SemPermissaoSecretariaError(item.secretaria_id)
    dados_enviados = dados.model_dump(exclude_unset=True)
    return repo_item.atualizar(session, item, dados_enviados)

