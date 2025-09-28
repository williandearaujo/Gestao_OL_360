from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import date, datetime

class EmployeeBase(BaseModel):
    nome: str
    email: EmailStr
    telefone: Optional[str] = None
    cpf: str
    rg: Optional[str] = None
    data_nascimento: date
    estado_civil: str = "SOLTEIRO"
    cargo: str
    equipe: str
    nivel: str = "JUNIOR"
    status: str = "ATIVO"
    data_admissao: date
    salario: float
    endereco: Dict[str, str]
    competencias: List[str] = []
    avatar: Optional[str] = None

class EmployeeCreate(EmployeeBase):
    pdi: Dict[str, Any] = {
        "data_ultimo": None,
        "data_atual": None,
        "data_proximo": None,
        "status": "NUNCA_AGENDADO",
        "checks": [],
        "historico": []
    }
    reunioes_1x1: Dict[str, Any] = {
        "data_ultimo": None,
        "data_atual": None,
        "data_proximo": None,
        "status": "NUNCA_AGENDADO",
        "historico": []
    }
    ferias: Dict[str, Any] = {
        "ultimo_periodo": None,
        "proximo_periodo": None,
        "dias_disponivel": 30,
        "status": "SEM_DIREITO",
        "historico": [],
        "ferias_vencidas": 0,
        "pode_vender": 10
    }
    dayoff: Dict[str, Any] = {
        "mes_aniversario": None,
        "usado_ano_atual": False,
        "data_usado": None,
        "historico": []
    }

class EmployeeUpdate(BaseModel):
    nome: Optional[str] = None
    email: Optional[EmailStr] = None
    telefone: Optional[str] = None
    cargo: Optional[str] = None
    equipe: Optional[str] = None
    nivel: Optional[str] = None
    status: Optional[str] = None
    salario: Optional[float] = None
    endereco: Optional[Dict[str, str]] = None
    competencias: Optional[List[str]] = None
    avatar: Optional[str] = None
    pdi: Optional[Dict[str, Any]] = None
    reunioes_1x1: Optional[Dict[str, Any]] = None
    ferias: Optional[Dict[str, Any]] = None
    dayoff: Optional[Dict[str, Any]] = None

class EmployeeResponse(EmployeeBase):
    id: int
    pdi: Dict[str, Any]
    reunioes_1x1: Dict[str, Any]
    ferias: Dict[str, Any]
    dayoff: Dict[str, Any]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class EmployeeStats(BaseModel):
    total: int
    ativos: int
    inativos: int
    ferias: int
    licenca: int
    por_equipe: Dict[str, int]
    certificacoes_obtidas: int
    certificacoes_desejadas: int
    vencendo_certificacoes: int
    pdi_atrasados: int
    reunioes_atrasadas: int
    aniversarios: int
    ferias_obrigatorias: int
