from datetime import datetime, timezone

from sqlmodel import Session

from app.core.exceptions import (
    ItemIndisponivelError,
    ItemNaoEncontradoError,
    RequisicaoMesmaSecretariaError,
    RequisicaoNaoEncontradaError,
    TransicaoInvalidaError,
    SemPermissaoSecretariaError,
)
from app.models.item import Item
from app.models.requisicao import Requisicao
from app.repositories import item as repo_item
from app.repositories import requisicao as repo_requisicao
from app.schemas.requisicao import RequisicaoCreate


def _saldo_livre(item: Item) -> int:
    return item.quantidade - item.quantidade_reservada


def criar_requisicao(session: Session, dados: RequisicaoCreate, secretaria_solicitante_id: int) -> Requisicao:
    item = repo_item.buscar_por_id(session, dados.item_id)
    if item is None:
        raise ItemNaoEncontradoError(dados.item_id)

    if item.secretaria_id == secretaria_solicitante_id:
        raise RequisicaoMesmaSecretariaError(dados.item_id)

    if dados.quantidade > _saldo_livre(item):
        raise ItemIndisponivelError(dados.item_id)

    requisicao = Requisicao(
        item_id=dados.item_id,
        secretaria_solicitante_id=secretaria_solicitante_id,
        quantidade=dados.quantidade,
        justificativa=dados.justificativa,
        intencao_id=dados.intencao_id,
        status="pendente",
    )
    return repo_requisicao.inserir(session, requisicao)


def obter_requisicao(session: Session, requisicao_id: int) -> Requisicao:
    requisicao = repo_requisicao.buscar_por_id(session, requisicao_id)
    if requisicao is None:
        raise RequisicaoNaoEncontradaError(requisicao_id)
    return requisicao


def listar_requisicoes(
    session: Session,
    page: int,
    page_size: int,
    status: str | None = None,
    secretaria_solicitante_id: int | None = None,
) -> tuple[list[Requisicao], int]:
    offset = (page - 1) * page_size
    requisicoes = repo_requisicao.listar(session, offset, page_size, status, secretaria_solicitante_id)
    total = repo_requisicao.contar_total(session, status, secretaria_solicitante_id)
    return requisicoes, total


def _marcar_atualizada(session: Session, requisicao: Requisicao, novo_status: str) -> Requisicao:
    return repo_requisicao.atualizar(
        session, requisicao, {"status": novo_status, "atualizado_em": datetime.now(timezone.utc)}
    )


def aprovar(session: Session, requisicao_id: int) -> Requisicao:
    requisicao = obter_requisicao(session, requisicao_id)
    if requisicao.status != "pendente":
        raise TransicaoInvalidaError(requisicao.status, "aprovar")

    item = repo_item.buscar_por_id(session, requisicao.item_id)
    if item is None:
        raise ItemNaoEncontradoError(requisicao.item_id)

    # revalida — pode haver pendentes concorrentes disputando o mesmo saldo
    if requisicao.quantidade > _saldo_livre(item):
        raise ItemIndisponivelError(requisicao.item_id)

    repo_item.atualizar(session, item, {"quantidade_reservada": item.quantidade_reservada + requisicao.quantidade})
    return _marcar_atualizada(session, requisicao, "aprovada")


def recusar(session: Session, requisicao_id: int) -> Requisicao:
    requisicao = obter_requisicao(session, requisicao_id)
    if requisicao.status != "pendente":
        raise TransicaoInvalidaError(requisicao.status, "recusar")
    return _marcar_atualizada(session, requisicao, "recusada")  # sem efeito no item


def confirmar_transferencia(session: Session, requisicao_id: int) -> Requisicao:
    requisicao = obter_requisicao(session, requisicao_id)
    if requisicao.status != "aprovada":
        raise TransicaoInvalidaError(requisicao.status, "confirmar_transferencia")

    item = repo_item.buscar_por_id(session, requisicao.item_id)
    if item is None:
        raise ItemNaoEncontradoError(requisicao.item_id)

    repo_item.atualizar(
        session,
        item,
        {
            "quantidade": item.quantidade - requisicao.quantidade,
            "quantidade_reservada": item.quantidade_reservada - requisicao.quantidade,
        },
    )
    # status do item é recalculado sozinho no ItemRead (computed_field) — nada a fazer aqui
    return _marcar_atualizada(session, requisicao, "transferida")


_ACOES = {
    "aprovar": aprovar,
    "recusar": recusar,
    "confirmar_transferencia": confirmar_transferencia,
}


def executar_acao(session: Session, requisicao_id: int, acao: str, secretaria_id: int) -> Requisicao:
    requisicao = obter_requisicao(session, requisicao_id)
    if requisicao.secretaria_solicitante_id != secretaria_id:
        raise SemPermissaoSecretariaError(requisicao.secretaria_solicitante_id)
    return _ACOES[acao](session, requisicao_id)

