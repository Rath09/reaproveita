```
cd backend

python -m venv .env

.\.env\Scripts\activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```