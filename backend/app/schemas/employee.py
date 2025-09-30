from pydantic import BaseModel, EmailStr, validator
from typing import Optional, List, Dict, Any
from datetime import date, datetime
from enum import Enum


# ============================================================================
# 📋 ENUMS PARA VALIDAÇÃO
# ============================================================================

class StatusEnum(str, Enum):
    ATIVO = "ATIVO"
    INATIVO = "INATIVO"
    FERIAS = "FERIAS"
    LICENCA = "LICENCA"
    AFASTADO = "AFASTADO"
    DEMITIDO = "DEMITIDO"


class NivelEnum(str, Enum):
    ESTAGIARIO = "ESTAGIARIO"
    JUNIOR = "JUNIOR"
    PLENO = "PLENO"
    SENIOR = "SENIOR"
    DIRETOR = "DIRETOR"


class AccessLevelEnum(str, Enum):
    COLABORADOR = "COLABORADOR"
    COORDENADOR = "COORDENADOR"
    GERENTE = "GERENTE"
    DIRETOR = "DIRETOR"
    ADMIN = "ADMIN"


class EstadoCivilEnum(str, Enum):
    SOLTEIRO = "SOLTEIRO"
    CASADO = "CASADO"
    DIVORCIADO = "DIVORCIADO"
    VIUVO = "VIUVO"
    UNIAO_ESTAVEL = "UNIAO_ESTAVEL"


# ============================================================================
# 📝 SCHEMAS BASE
# ============================================================================

class EmployeeBase(BaseModel):
    nome: str
    email: EmailStr
    telefone: Optional[str] = None
    cpf: str
    rg: Optional[str] = None
    data_nascimento: date
    estado_civil: EstadoCivilEnum = EstadoCivilEnum.SOLTEIRO
    cargo: str
    equipe: str
    nivel: NivelEnum = NivelEnum.JUNIOR
    status: StatusEnum = StatusEnum.ATIVO
    data_admissao: date
    salario: float
    endereco: Dict[str, str] = {}
    competencias: List[str] = []
    avatar: Optional[str] = None
    access_level: AccessLevelEnum = AccessLevelEnum.COLABORADOR
    manager_id: Optional[int] = None
    team_id: Optional[int] = None
    area_id: Optional[int] = None
    observacoes: Optional[str] = ""

    @validator('email')
    def validate_email(cls, v):
        if not v or '@' not in v:
            raise ValueError('Email inválido')
        return v.lower()

    @validator('cpf')
    def validate_cpf(cls, v):
        if v and len(v.replace('.', '').replace('-', '')) != 11:
            raise ValueError('CPF deve ter 11 dígitos')
        return v

    @validator('salario')
    def validate_salario(cls, v):
        if v and v <= 0:
            raise ValueError('Salário deve ser positivo')
        return v


class EmployeeCreate(EmployeeBase):
    # Campos de gestão empresarial com valores padrão
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
        "dias_utilizados": 0,
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
    nivel: Optional[NivelEnum] = None
    status: Optional[StatusEnum] = None
    salario: Optional[float] = None
    endereco: Optional[Dict[str, str]] = None
    competencias: Optional[List[str]] = None
    avatar: Optional[str] = None
    access_level: Optional[AccessLevelEnum] = None
    manager_id: Optional[int] = None
    team_id: Optional[int] = None
    area_id: Optional[int] = None
    observacoes: Optional[str] = None
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
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None,
            date: lambda v: v.isoformat() if v else None
        }


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


# ============================================================================
# 📋 SCHEMAS PARA GESTÃO EMPRESARIAL
# ============================================================================

class PDISchema(BaseModel):
    data_ultimo: Optional[date] = None
    data_atual: Optional[date] = None
    data_proximo: Optional[date] = None
    status: str = "NUNCA_AGENDADO"
    objetivos: List[Dict[str, Any]] = []
    progresso: float = 0.0
    observacoes: str = ""
    checks: List[Dict[str, Any]] = []
    historico: List[Dict[str, Any]] = []


class Reuniao1x1Schema(BaseModel):
    data_ultimo: Optional[date] = None
    data_atual: Optional[date] = None
    data_proximo: Optional[date] = None
    status: str = "NUNCA_AGENDADO"
    frequencia: str = "MENSAL"
    historico: List[Dict[str, Any]] = []


class FeriasSchema(BaseModel):
    ultimo_periodo: Optional[Dict[str, Any]] = None
    proximo_periodo: Optional[Dict[str, Any]] = None
    dias_disponivel: int = 30
    dias_utilizados: int = 0
    dias_vencidos: int = 0
    status: str = "SEM_DIREITO"
    historico: List[Dict[str, Any]] = []
    ferias_vencidas: int = 0
    pode_vender: int = 10


class DayoffSchema(BaseModel):
    mes_aniversario: Optional[int] = None
    usado_ano_atual: bool = False
    data_usado: Optional[date] = None
    data_proximo: Optional[date] = None
    status: str = "DISPONIVEL"
    historico: List[Dict[str, Any]] = []
