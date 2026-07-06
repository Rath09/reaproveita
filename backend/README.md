```
cd backend

python -m venv venv

.\venv\Scripts\activate

pip install -r requirements.txt

python -m app.db.seeds.seed_usuarios

uvicorn app.main:app --reload
```