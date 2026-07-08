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
    {"nome": "Gestor 1", "email": "gestor1@gmail.com", "senha_hash": hash_senha("senha"), "papel": "gestor", "secretaria_id": 1},
    {"nome": "Gestor 2", "email": "gestor2@gmail.com", "senha_hash": hash_senha("senha"), "papel": "gestor", "secretaria_id": 2},
    {"nome": "Secretaria 1", "email": "secretaria1@gmail.com", "senha_hash": hash_senha("senha"), "papel": "secretaria", "secretaria_id": 1},
    {"nome": "Secretaria 1_2", "email": "secretaria1_2@gmail.com", "senha_hash": hash_senha("senha"), "papel": "secretaria", "secretaria_id": 1},
    {"nome": "Secretaria 2", "email": "secretaria2@gmail.com", "senha_hash": hash_senha("senha"), "papel": "secretaria", "secretaria_id": 2},
    {"nome": "Secretaria 2_2", "email": "secretaria2_2@gmail.com", "senha_hash": hash_senha("senha"), "papel": "secretaria", "secretaria_id": 2},
    {"nome": "Secretaria 3", "email": "secretaria3@gmail.com", "senha_hash": hash_senha("senha"), "papel": "secretaria", "secretaria_id": 3},
]

SECRETARIAS_SEED = [
    {"nome": "Secretaria de Administração", "sigla": "SEAD"},
    {"nome": "Secretaria de Educação", "sigla": "SEDUC"},
    {"nome": "Secretaria de Saúde", "sigla": "SESA"},
    {"nome": "Secretaria da Fazenda", "sigla": "SEFAZ"},
    {"nome": "Secretaria de Segurança Pública", "sigla": "SESP"},
    {"nome": "Secretaria de Infraestrutura", "sigla": "SEINFRA"},
    {"nome": "Secretaria de Meio Ambiente", "sigla": "SEMA"},
    {"nome": "Secretaria de Agricultura", "sigla": "SEAG"},
    {"nome": "Secretaria de Assistência Social", "sigla": "SEAS"},
    {"nome": "Secretaria de Cultura", "sigla": "SECULT"},
    {"nome": "Secretaria de Esporte e Lazer", "sigla": "SEEL"},
    {"nome": "Secretaria de Desenvolvimento Econômico", "sigla": "SEDEC"},
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
    "secretaria_id": "1",
    "quantidade":"5",
    "estado_conservacao":"regular",
    "valor_unitario_estimado":"45.00",
    "catmat_code":"123"
},{
    "nome":"Banquinho de madeira 2",
    "descricao":"Banco de madeira confortável",
    "patrimonio":"PMF-2019-00871",
    "categoria_id":"1",
    "secretaria_id": "1",
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
    "secretaria_id": "3",
    "quantidade":"5",
    "estado_conservacao":"regular",
    "valor_unitario_estimado":"45.00",
    "catmat_code":"123"
},{
    "nome":"Banquinho de madeira 7",
    "descricao":"Banco de madeira confortável",
    "patrimonio":"PMF-2019-00871",
    "categoria_id":"1",
    "secretaria_id": "3",
    "quantidade":"5",
    "estado_conservacao":"regular",
    "valor_unitario_estimado":"45.00",
    "catmat_code":"123"
},{
    "nome":"Banquinho de madeira 8",
    "descricao":"Banco de madeira confortável",
    "patrimonio":"PMF-2019-00871",
    "categoria_id":"1",
    "secretaria_id": "4",
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
    "secretaria_id": "5",
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
    "secretaria_id": "6",
    "quantidade":"5",
    "estado_conservacao":"regular",
    "valor_unitario_estimado":"45.00",
    "catmat_code":"123"
},{
    "nome":"Banquinho de madeira 13",
    "descricao":"Banco de madeira confortável",
    "patrimonio":"PMF-2019-00871",
    "categoria_id":"1",
    "secretaria_id": "6",
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
