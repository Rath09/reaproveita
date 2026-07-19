from decimal import Decimal

from sqlalchemy import func
from sqlmodel import Session, select

from app.models.item import Item
from app.models.requisicao import Requisicao


def compras_evitadas_valor(session: Session) -> Decimal:
    """
    Soma quantidade * valor_unitario sobre transferências confirmadas.
    Doc pede 'valor da intenção vinculada quando existir; senão, do item' —
    como intenção não existe ainda, sempre cai no valor do item.
    """
    statement = (
        select(func.sum(Requisicao.quantidade * Item.valor_unitario_estimado))
        .join(Item, Item.id == Requisicao.item_id)
        .where(Requisicao.status == "transferida")
    )
    resultado = session.exec(statement).one()
    return resultado if resultado is not None else Decimal("0.00")


def itens_transferidos(session: Session) -> int:
    """Soma de quantidade (unidades físicas movidas), não contagem de requisições."""
    statement = select(func.sum(Requisicao.quantidade)).where(Requisicao.status == "transferida")
    resultado = session.exec(statement).one()
    return resultado if resultado is not None else 0


def requisicoes_concluidas(session: Session) -> int:
    """Contagem de requisições (pedidos), diferente de itens_transferidos (unidades)."""
    statement = select(func.count()).where(Requisicao.status == "transferida")
    return session.exec(statement).one()
