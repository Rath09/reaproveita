class EmailJaCadastradoError(Exception):
    """Levantada quando já existe usuario com o e-mail informado."""


class UsuarioNaoEncontradoError(Exception):
    """Levantada quando usuario_id não existe no banco."""


class ItemNaoEncontradoError(Exception):
    """Levantada quando item_id não existe no banco."""

