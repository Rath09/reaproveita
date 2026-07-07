class EmailJaCadastradoError(Exception):
    """Levantada quando já existe usuario com o e-mail informado."""


class UsuarioNaoEncontradoError(Exception):
    """Levantada quando usuario_id não existe no banco."""


class ItemNaoEncontradoError(Exception):
    """Levantada quando item_id não existe no banco."""

class ItemIndisponivelError(Exception):
    """Quantidade requisitada > saldo_livre do item."""


class RequisicaoMesmaSecretariaError(Exception):
    """Secretaria solicitante é a mesma dona do item."""


class RequisicaoNaoEncontradaError(Exception):
    """requisicao_id não existe no banco."""


class TransicaoInvalidaError(Exception):
    """Ação pedida não é válida pro status atual da requisição."""

    def __init__(self, status_atual: str, acao: str):
        self.status_atual = status_atual
        self.acao = acao
        super().__init__(f"ação '{acao}' inválida para status '{status_atual}'")


class CredenciaisInvalidasError(Exception):
    """E-mail não existe ou senha não confere no login."""

