from sqlalchemy import func
from sqlmodel import Session, select

from app.models.usuario import Usuario


def inserir(session: Session, usuario: Usuario) -> Usuario:
    session.add(usuario)
    session.commit()
    session.refresh(usuario)  # busca o id gerado pelo SQLite
    return usuario


def buscar_por_id(session: Session, usuario_id: int) -> Usuario | None:
    return session.get(Usuario, usuario_id)


def buscar_por_email(session: Session, email: str) -> Usuario | None:
    statement = select(Usuario).where(Usuario.email == email)
    return session.exec(statement).first()


def listar(session: Session, offset: int, limit: int) -> list[Usuario]:
    statement = select(Usuario).offset(offset).limit(limit)
    return list(session.exec(statement).all())


def contar_total(session: Session) -> int:
    statement = select(func.count()).select_from(Usuario)
    return session.exec(statement).one()


def atualizar(session: Session, usuario: Usuario, dados: dict) -> Usuario:
    """Recebe o objeto já carregado + dict de campos a mudar. Aplica e salva."""
    for campo, valor in dados.items():
        setattr(usuario, campo, valor)
    session.add(usuario)
    session.commit()
    session.refresh(usuario)
    return usuario
