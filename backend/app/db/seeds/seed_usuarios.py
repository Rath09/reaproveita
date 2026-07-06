"""
Popula a tabela usuario com registros de exemplo.

Uso:
    python -m app.db.seeds.seed_usuarios
"""
from sqlmodel import Session, select

from app.db.session import create_db_and_tables, engine
from app.models.usuario import Usuario
from app.models.secretaria import Secretaria
from app.models.categoria import Categoria
from app.models.item import Item

from app.core.security import hash_senha

# lista simples de dicts — cada um vira 1 linha na tabela
USUARIOS_SEED = [
    {"nome": "Rodrigo Lopes", "email": "rodrigof.lops@gmail.com", "senha_hash": hash_senha("dev"), "papel": "dev", "secretaria_id": 1},
    {"nome": "Rafael Rondon", "email": "rrmontebello@gmail.com", "senha_hash": hash_senha("dev"), "papel": "dev", "secretaria_id": 1},
    {"nome": "Gabriel Leal", "email": "gabriellealrf@gmail.com", "senha_hash": hash_senha("dev"), "papel": "dev", "secretaria_id": 1},
    {"nome": "Gestor 1", "email": "gestor1@gmail.com", "senha_hash": hash_senha("senha"), "papel": "admin", "secretaria_id": 2},
    {"nome": "Servidor 1", "email": "servidor1@gmail.com", "senha_hash": hash_senha("senha"), "papel": "servidor", "secretaria_id": 2},
]

SECRETARIAS_SEED = [
    {"nome": "Iauar", "sigla": "DEV"},
    {"nome": "Secretaria 1", "sigla": "SEC1"},
    {"nome": "Secretaria 2", "sigla": "SEC2"},
    {"nome": "Secretaria 3", "sigla": "SEC3"},
    {"nome": "Secretaria 4", "sigla": "SEC4"},
    {"nome": "Secretaria 5", "sigla": "SEC5"},
    {"nome": "Secretaria 6", "sigla": "SEC6"},
]

CATEGORIAS_SEED = [
    {"nome": "Categoria 1"},
    {"nome": "Categoria 2"},
    {"nome": "Categoria 3"},
    {"nome": "Categoria 4"},
    {"nome": "Categoria 5"},
    {"nome": "Categoria 6"},
]

ITENS_SEED = [
    {
    "nome":"Banquinho de madeira 1",
    "descricao":"Banco de madeira confortável",
    "patrimonio":"PMF-2019-00871",
    "categoria_id":"1",
    "secretaria_id": "2",
    "quantidade":"5",
    "estado_conservacao":"regular",
    "valor_unitario_estimado":"45.00",
    "catmat_code":"123"
},{
    "nome":"Banquinho de madeira 2",
    "descricao":"Banco de madeira confortável",
    "patrimonio":"PMF-2019-00871",
    "categoria_id":"1",
    "secretaria_id": "2",
    "quantidade":"5",
    "estado_conservacao":"regular",
    "valor_unitario_estimado":"45.00",
    "catmat_code":"123"
},{
    "nome":"Banquinho de madeira 3",
    "descricao":"Banco de madeira confortável",
    "patrimonio":"PMF-2019-00871",
    "categoria_id":"1",
    "secretaria_id": "2",
    "quantidade":"5",
    "estado_conservacao":"regular",
    "valor_unitario_estimado":"45.00",
    "catmat_code":"123"
},{
    "nome":"Banquinho de madeira 4",
    "descricao":"Banco de madeira confortável",
    "patrimonio":"PMF-2019-00871",
    "categoria_id":"1",
    "secretaria_id": "2",
    "quantidade":"5",
    "estado_conservacao":"regular",
    "valor_unitario_estimado":"45.00",
    "catmat_code":"123"
},{
    "nome":"Banquinho de madeira 5",
    "descricao":"Banco de madeira confortável",
    "patrimonio":"PMF-2019-00871",
    "categoria_id":"1",
    "secretaria_id": "2",
    "quantidade":"5",
    "estado_conservacao":"regular",
    "valor_unitario_estimado":"45.00",
    "catmat_code":"123"
},{
    "nome":"Banquinho de madeira 6",
    "descricao":"Banco de madeira confortável",
    "patrimonio":"PMF-2019-00871",
    "categoria_id":"1",
    "secretaria_id": "2",
    "quantidade":"5",
    "estado_conservacao":"regular",
    "valor_unitario_estimado":"45.00",
    "catmat_code":"123"
},{
    "nome":"Banquinho de madeira 7",
    "descricao":"Banco de madeira confortável",
    "patrimonio":"PMF-2019-00871",
    "categoria_id":"1",
    "secretaria_id": "2",
    "quantidade":"5",
    "estado_conservacao":"regular",
    "valor_unitario_estimado":"45.00",
    "catmat_code":"123"
},{
    "nome":"Banquinho de madeira 8",
    "descricao":"Banco de madeira confortável",
    "patrimonio":"PMF-2019-00871",
    "categoria_id":"1",
    "secretaria_id": "2",
    "quantidade":"5",
    "estado_conservacao":"regular",
    "valor_unitario_estimado":"45.00",
    "catmat_code":"123"
},{
    "nome":"Banquinho de madeira 9",
    "descricao":"Banco de madeira confortável",
    "patrimonio":"PMF-2019-00871",
    "categoria_id":"1",
    "secretaria_id": "2",
    "quantidade":"5",
    "estado_conservacao":"regular",
    "valor_unitario_estimado":"45.00",
    "catmat_code":"123"
},{
    "nome":"Banquinho de madeira 10",
    "descricao":"Banco de madeira confortável",
    "patrimonio":"PMF-2019-00871",
    "categoria_id":"1",
    "secretaria_id": "2",
    "quantidade":"5",
    "estado_conservacao":"regular",
    "valor_unitario_estimado":"45.00",
    "catmat_code":"123"
},{
    "nome":"Banquinho de madeira 11",
    "descricao":"Banco de madeira confortável",
    "patrimonio":"PMF-2019-00871",
    "categoria_id":"1",
    "secretaria_id": "2",
    "quantidade":"5",
    "estado_conservacao":"regular",
    "valor_unitario_estimado":"45.00",
    "catmat_code":"123"
},{
    "nome":"Banquinho de madeira 12",
    "descricao":"Banco de madeira confortável",
    "patrimonio":"PMF-2019-00871",
    "categoria_id":"1",
    "secretaria_id": "2",
    "quantidade":"5",
    "estado_conservacao":"regular",
    "valor_unitario_estimado":"45.00",
    "catmat_code":"123"
},{
    "nome":"Banquinho de madeira 13",
    "descricao":"Banco de madeira confortável",
    "patrimonio":"PMF-2019-00871",
    "categoria_id":"1",
    "secretaria_id": "2",
    "quantidade":"5",
    "estado_conservacao":"regular",
    "valor_unitario_estimado":"45.00",
    "catmat_code":"123"
},{
    "nome":"Banquinho de madeira 14",
    "descricao":"Banco de madeira confortável",
    "patrimonio":"PMF-2019-00871",
    "categoria_id":"1",
    "secretaria_id": "2",
    "quantidade":"5",
    "estado_conservacao":"regular",
    "valor_unitario_estimado":"45.00",
    "catmat_code":"123"
},{
    "nome":"Banquinho de madeira 15",
    "descricao":"Banco de madeira confortável",
    "patrimonio":"PMF-2019-00871",
    "categoria_id":"1",
    "secretaria_id": "2",
    "quantidade":"5",
    "estado_conservacao":"regular",
    "valor_unitario_estimado":"45.00",
    "catmat_code":"123"
},
]


def run() -> None:
    create_db_and_tables()  # garante que a tabela existe, mesmo rodando isso sozinho

    with Session(engine) as session:
        for sec in SECRETARIAS_SEED:
            secretaria = Secretaria(**sec)
            session.add(secretaria)
            session.commit()
            session.refresh(secretaria)
            print(f"\n[ok] criado {secretaria.nome} (id={secretaria.id} | siga={secretaria.sigla})\n")
        
        for dados in USUARIOS_SEED:
            usuario = Usuario(**dados)
            session.add(usuario)
            session.commit()
            session.refresh(usuario)  # relê do banco pra pegar o id gerado
            print(f"\n[ok] criado {usuario.email} (id={usuario.id})\n")
        
        for cat in CATEGORIAS_SEED:
            categoria = Categoria(**cat)
            session.add(categoria)
            session.commit()
            session.refresh(categoria)
            print(f"\n[ok] criado {categoria.nome} (id={categoria.id})\n")
        
        for i in ITENS_SEED:
            item = Item(**i)
            session.add(item)
            session.commit()
            session.refresh(item)
            print(f"\n[ok] criado {item.nome} (id={item.id})\n")


if __name__ == "__main__":
    run()
