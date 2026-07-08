from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.api.deps import get_session, get_usuario_atual
from app.schemas.kpi import KpiResponse
from app.services import kpi as service_kpi

router_autenticado = APIRouter(tags=["kpis"], dependencies=[Depends(get_usuario_atual)])
router_publico = APIRouter(prefix="/publico", tags=["kpis"])  # sem dependencies — de propósito, §7


@router_autenticado.get("/kpis", response_model=KpiResponse)
def obter_kpis(session: Session = Depends(get_session)):
    return service_kpi.calcular_kpis(session)


@router_publico.get("/kpis", response_model=KpiResponse)
def obter_kpis_publico(session: Session = Depends(get_session)):
    return service_kpi.calcular_kpis(session)

