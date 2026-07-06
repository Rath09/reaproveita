from sqlalchemy import func
from sqlmodel import Session, select

from app.models.item import Item


def inserir(session: Session, item: Item) -> Item:
    session.add(item)
    session.commit()
    session.refresh(item)
    return item


def buscar_por_id(session: Session, item_id: int) -> Item | None:
    return session.get(Item, item_id)


def listar(session: Session, offset: int, limit: int) -> list[Item]:
    statement = select(Item).offset(offset).limit(limit)
    return list(session.exec(statement).all())


def contar_total(session: Session) -> int:
    statement = select(func.count()).select_from(Item)
    return session.exec(statement).one()


def atualizar(session: Session, item: Item, dados: dict) -> Item:
    for campo, valor in dados.items():
        setattr(item, campo, valor)
    session.add(item)
    session.commit()
    session.refresh(item)
    return item

