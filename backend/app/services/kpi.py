from sqlmodel import Session

from app.repositories import kpi as repo_kpi
from app.schemas.kpi import KpiResponse


def calcular_kpis(session: Session) -> KpiResponse:
    return KpiResponse(
        compras_evitadas_valor=repo_kpi.compras_evitadas_valor(session),
        itens_transferidos=repo_kpi.itens_transferidos(session),
        requisicoes_concluidas=repo_kpi.requisicoes_concluidas(session)
    )

