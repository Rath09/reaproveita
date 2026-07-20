from sqlalchemy import func
from sqlmodel import Session, select, func, or_

from app.schemas.item import FiltrosItem  # ajuste o import conforme sua estrutura
from app.models.item import Item


def inserir(session: Session, item: Item) -> Item:
    session.add(item)
    session.commit()
    session.refresh(item)
    return item


def buscar_por_id(session: Session, item_id: int) -> Item | None:
    return session.get(Item, item_id)


def _escapar_like(valor: str) -> str:
    # patrimonio/nome podem conter % ou _, que são coringas do LIKE
    return valor.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")

def _aplicar_filtros(statement, filtros: FiltrosItem):
    if filtros.q:
        termo = f"%{_escapar_like(filtros.q)}%"
        statement = statement.where(
            or_(
                Item.nome.ilike(termo, escape="\\"),
                Item.patrimonio.ilike(termo, escape="\\"),
            )
        )
    if filtros.categoria_id is not None:
        statement = statement.where(Item.categoria_id == filtros.categoria_id)
    if filtros.estado_conservacao is not None:
        statement = statement.where(Item.estado_conservacao == filtros.estado_conservacao)
    if filtros.secretaria_id is not None:
        statement = statement.where(Item.secretaria_id == filtros.secretaria_id)
    if filtros.status is not None:
        saldo_livre = Item.quantidade - Item.quantidade_reservada
        if filtros.status == "disponivel":
            statement = statement.where(saldo_livre > 0)
        elif filtros.status == "reservado":
            statement = statement.where(saldo_livre <= 0, Item.quantidade > 0)
        else:  # transferido
            statement = statement.where(saldo_livre <= 0, Item.quantidade <= 0)
    if filtros.older_than is not None:
        statement = statement.where(Item.criado_em < filtros.older_than)
    return statement

def listar(session: Session, offset: int, limit: int, filtros: FiltrosItem) -> list[Item]:
    statement = _aplicar_filtros(select(Item), filtros)
    statement = statement.offset(offset).limit(limit)
    return list(session.exec(statement).all())

def contar_total(session: Session, filtros: FiltrosItem) -> int:
    statement = _aplicar_filtros(select(func.count()).select_from(Item), filtros)
    return session.exec(statement).one()


def atualizar(session: Session, item: Item, dados: dict) -> Item:
    for campo, valor in dados.items():
        setattr(item, campo, valor)
    session.add(item)
    session.commit()
    session.refresh(item)
    return item

