from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Gestão OL 360 API", version="1.0.0")

# Configurar CORS para permitir requisições do frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Backend Gestão OL 360 está rodando!", "version": "1.0.0"}

@app.get("/health")
def health_check():
    return {"status": "OK", "service": "Gestão OL 360 API"}

# Rotas básicas de exemplo
@app.get("/api/colaboradores")
def get_colaboradores():
    return [
        {
            "id": 1,
            "nome": "João Silva",
            "cargo": "Analista Sênior",
            "equipe": "Red Team",
            "equipe_cor": "#e74c3c"
        },
        {
            "id": 2,
            "nome": "Ana Costa", 
            "cargo": "Analista Júnior",
            "equipe": "Blue Team",
            "equipe_cor": "#3498db"
        }
    ]
