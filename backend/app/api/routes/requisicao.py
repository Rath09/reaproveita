from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session

from app.api.deps import exigir_papel, get_session, get_usuario_atual
from app.models.usuario import Usuario
from app.core.exceptions import (
    ItemIndisponivelError,
    ItemNaoEncontradoError,
    RequisicaoMesmaSecretariaError,
    RequisicaoNaoEncontradaError,
    TransicaoInvalidaError,
    SemPermissaoSecretariaError,
)
from app.schemas.common import PaginatedResponse
from app.schemas.requisicao import RequisicaoAcao, RequisicaoCreate, RequisicaoRead, StatusRequisicao
from app.services import requisicao as service_requisicao

router = APIRouter(prefix="/requisicoes", tags=["requisicoes"], dependencies=[Depends(get_usuario_atual)])


@router.post("", response_model=RequisicaoRead, status_code=201)
def criar_requisicao(
    dados: RequisicaoCreate,
    usuario_atual: Usuario = Depends(get_usuario_atual),
    session: Session = Depends(get_session),
):
    try:
        return service_requisicao.criar_requisicao(session, dados, usuario_atual.secretaria_id)
    except ItemNaoEncontradoError:
        raise HTTPException(status_code=404, detail="item não encontrado")
    except RequisicaoMesmaSecretariaError:
        raise HTTPException(status_code=400, detail="não é possível requisitar item da própria secretaria")
    except ItemIndisponivelError:
        raise HTTPException(status_code=409, detail="ITEM_INDISPONIVEL")


@router.patch("/{requisicao_id}", response_model=RequisicaoRead)
def executar_acao(
    requisicao_id: int,
    dados: RequisicaoAcao,
    session: Session = Depends(get_session),
    usuario_atual: Usuario = Depends(exigir_papel("gestor"))
):
    try:
        return service_requisicao.executar_acao(session, requisicao_id, dados.acao, usuario_atual.secretaria_id)
    except RequisicaoNaoEncontradaError:
        raise HTTPException(status_code=404, detail="requisição não encontrada")
    except ItemNaoEncontradoError:
        raise HTTPException(status_code=404, detail="item vinculado não encontrado")
    except ItemIndisponivelError:
        raise HTTPException(status_code=409, detail="ITEM_INDISPONIVEL")
    except TransicaoInvalidaError as erro:
        raise HTTPException(status_code=409, detail=f"TRANSICAO_INVALIDA: {erro}")
    except SemPermissaoSecretariaError as erro:
        raise HTTPException(status_code=403, detail=f"sem permissão para editar requisição da secretaria {erro}")


@router.get("", response_model=PaginatedResponse[RequisicaoRead])
def listar_requisicoes(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    status: StatusRequisicao | None = None,
    usuario_atual: Usuario = Depends(get_usuario_atual),
    session: Session = Depends(get_session),
):
    #secretaria_filtro = None if usuario_atual.papel == "gestor" else usuario_atual.secretaria_id
    requisicoes, total = service_requisicao.listar_requisicoes(session, page, page_size, status, usuario_atual.secretaria_id)
    return PaginatedResponse(dados=requisicoes, total=total, page=page, page_size=page_size)

