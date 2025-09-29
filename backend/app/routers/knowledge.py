from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_knowledge():
    """Teste básico sem banco"""
    return [
        {
            "id": 1,
            "nome": "CISSP Teste",
            "tipo": "CERTIFICACAO",
            "codigo": "CISSP-001",
            "vendor": "ISC2",
            "area": "Cibersegurança"
        },
        {
            "id": 2,
            "nome": "CEH Teste",
            "tipo": "CERTIFICACAO",
            "codigo": "CEH-001", 
            "vendor": "EC-Council",
            "area": "Ethical Hacking"
        }
    ]

@router.get("/debug")
def debug():
    return {"message": "Knowledge router funcionando!", "status": "OK"}
