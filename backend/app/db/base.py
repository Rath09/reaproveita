# Import de todo model criado precisa entrar aqui, senão ele não é
# registrado no metadata do SQLModel e create_all() não cria a tabela.
from app.models.usuario import Usuario  # noqa: F401
from app.models.secretaria import Secretaria  # noqa: F401
from app.models.item import Item  # noqa: F401
from app.models.categoria import Categoria  # noqa: F401
from app.models.requisicao import Requisicao  # noqa: F401
