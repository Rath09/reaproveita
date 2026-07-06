from sqlalchemy import event
from sqlmodel import SQLModel, create_engine

from app.core.config import settings
from app.db import base  # noqa: F401  garante que todos os models estejam registrados

engine = create_engine(settings.database_url, echo=True)


@event.listens_for(engine, "connect")
def habilitar_fk_sqlite(dbapi_connection, connection_record):
    # O SQLite, por padrão, IGNORA foreign keys mesmo quando declaradas.
    # Sem isso, o foreign_key="secretarias.id" que acabamos de ativar no
    # Usuario existe só "no papel" — o banco deixaria você inserir um
    # secretaria_id=999 que não existe, sem reclamar nada.
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()


def create_db_and_tables() -> None:
    SQLModel.metadata.create_all(engine)
