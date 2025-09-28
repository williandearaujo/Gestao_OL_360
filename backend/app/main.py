from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import create_tables
from .routers import employees, knowledge, auth

app = FastAPI(
    title="Gestão 360 - OL Tecnologia",
    description="Sistema completo de gestão de colaboradores e conhecimentos",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Criar tabelas na inicialização
@app.on_event("startup")
def startup_event():
    create_tables()

# Incluir routers
app.include_router(employees.router, prefix="/api")
app.include_router(knowledge.router, prefix="/api")
app.include_router(auth.router, prefix="/api")

@app.get("/")
def root():
    return {
        "message": "Gestão 360 API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "API funcionando perfeitamente"}
