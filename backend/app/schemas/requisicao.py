from typing import Literal
from datetime import datetime

from sqlmodel import SQLModel

StatusRequisicao = Literal["pendente", "aprovada", "recusada", "transferida"]
AcaoGestor = Literal["aprovar", "recusar", "confirmar_transferencia"]


class RequisicaoCreate(SQLModel):
    item_id: int
    quantidade: int
    justificativa: str
    intencao_id: int | None = None
    # secretaria_solicitante_id NÃO entra aqui — vem do usuário autenticado, não do corpo da requisição


class RequisicaoAcao(SQLModel):
    acao: AcaoGestor


class RequisicaoRead(SQLModel):
    id: int
    item_id: int
    secretaria_solicitante_id: int
    quantidade: int
    justificativa: str
    status: StatusRequisicao
    intencao_id: int | None
    criado_em: datetime
    atualizado_em: datetime

