from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_employees():
    """Teste básico sem banco"""
    return [
        {
            "id": 1,
            "nome": "João Silva Teste",
            "email": "joao@teste.com",
            "cargo": "Analista",
            "area": "TI",
            "nivel": "SENIOR",
            "status": "ATIVO"
        },
        {
            "id": 2,
            "nome": "Maria Santos Teste",
            "email": "maria@teste.com", 
            "cargo": "Consultora",
            "area": "SOC",
            "nivel": "PLENO",
            "status": "ATIVO"
        }
    ]

@router.get("/debug")
def debug():
    return {"message": "Employees router funcionando!", "status": "OK"}
