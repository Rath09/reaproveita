# app FastAPI principal

from fastapi import FastAPI
from app.routers import health

app = FastAPI()
app.include_router(health.router)  # inclui endpoints de health

@app.get("/")
async def root():
    return {"message": "Hello World"}