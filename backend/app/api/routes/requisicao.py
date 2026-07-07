from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session

from app.api.deps import get_session
from app.core.exceptions import (
    ItemIndisponivelError,
    ItemNaoEncontradoError,
    RequisicaoMesmaSecretariaError,
    RequisicaoNaoEncontradaError,
    TransicaoInvalidaError,
)
from app.schemas.common import PaginatedResponse
from app.schemas.requisicao import RequisicaoAcao, RequisicaoCreate, RequisicaoRead, StatusRequisicao
from app.services import requisicao as service_requisicao

router = APIRouter(prefix="/requisicoes", tags=["requisicoes"])


@router.post("", response_model=RequisicaoRead, status_code=201)
def criar_requisicao(
    dados: RequisicaoCreate,
    secretaria_solicitante_id: int = Query(..., description="TEMP: virá do JWT quando o Auth existir"),
    session: Session = Depends(get_session),
):
    try:
        return service_requisicao.criar_requisicao(session, dados, secretaria_solicitante_id)
    except ItemNaoEncontradoError:
        raise HTTPException(status_code=404, detail="item não encontrado")
    except RequisicaoMesmaSecretariaError:
        raise HTTPException(status_code=400, detail="não é possível requisitar item da própria secretaria")
    except ItemIndisponivelError:
        raise HTTPException(status_code=409, detail="ITEM_INDISPONIVEL")


@router.patch("/{requisicao_id}", response_model=RequisicaoRead)
def executar_acao(requisicao_id: int, dados: RequisicaoAcao, session: Session = Depends(get_session)):
    try:
        return service_requisicao.executar_acao(session, requisicao_id, dados.acao)
    except RequisicaoNaoEncontradaError:
        raise HTTPException(status_code=404, detail="requisição não encontrada")
    except ItemNaoEncontradoError:
        raise HTTPException(status_code=404, detail="item vinculado não encontrado")
    except ItemIndisponivelError:
        raise HTTPException(status_code=409, detail="ITEM_INDISPONIVEL")
    except TransicaoInvalidaError as erro:
        raise HTTPException(status_code=409, detail=f"TRANSICAO_INVALIDA: {erro}")


@router.get("", response_model=PaginatedResponse[RequisicaoRead])
def listar_requisicoes(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    status: StatusRequisicao | None = None,
    secretaria_solicitante_id: int | None = None,
    session: Session = Depends(get_session),
):
    requisicoes, total = service_requisicao.listar_requisicoes(
        session, page, page_size, status, secretaria_solicitante_id
    )
    return PaginatedResponse(dados=requisicoes, total=total, page=page, page_size=page_size)

