from sqlalchemy import func
from sqlmodel import Session, select

from app.models.requisicao import Requisicao


def inserir(session: Session, requisicao: Requisicao) -> Requisicao:
    session.add(requisicao)
    session.commit()
    session.refresh(requisicao)
    return requisicao


def buscar_por_id(session: Session, requisicao_id: int) -> Requisicao | None:
    return session.get(Requisicao, requisicao_id)


def _aplicar_filtros(statement, status: str | None, secretaria_solicitante_id: int | None):
    if status is not None:
        statement = statement.where(Requisicao.status == status)
    if secretaria_solicitante_id is not None:
        statement = statement.where(Requisicao.secretaria_solicitante_id == secretaria_solicitante_id)
    return statement


def listar(
    session: Session,
    offset: int,
    limit: int,
    status: str | None = None,
    secretaria_solicitante_id: int | None = None,
) -> list[Requisicao]:
    statement = _aplicar_filtros(select(Requisicao), status, secretaria_solicitante_id)
    statement = statement.offset(offset).limit(limit)
    return list(session.exec(statement).all())


def contar_total(session: Session, status: str | None = None, secretaria_solicitante_id: int | None = None) -> int:
    statement = _aplicar_filtros(select(func.count()).select_from(Requisicao), status, secretaria_solicitante_id)
    return session.exec(statement).one()


def atualizar(session: Session, requisicao: Requisicao, dados: dict) -> Requisicao:
    for campo, valor in dados.items():
        setattr(requisicao, campo, valor)
    session.add(requisicao)
    session.commit()
    session.refresh(requisicao)
    return requisicao

