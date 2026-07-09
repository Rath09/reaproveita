# Reaproveita — Back-end (FastAPI)

Interface do Reaproveita: catálogo de itens ociosos, fluxo de requisição e KPIs.
Visão geral do projeto e documentos da equipe: ver o `README.md` na raiz do repositório.

## Rodando localmente

Pré-requisito: Python 3.

```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python -m app.db.seeds.seed_usuarios
uvicorn app.main:app --reload
```

Abra o endereço que aparecer no terminal (normalmente http://127.0.0.1:8000).

## Documentação

Gerada automaticamente com Swagger (http://127.0.0.1:8000/docs)\
Todos os endpoints estão documentados e com resposta padronizada.
