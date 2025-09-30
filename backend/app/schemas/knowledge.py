from pydantic import BaseModel, validator
from typing import Optional, List, Dict, Any
from datetime import date, datetime
from enum import Enum

# ============================================================================
# 📋 ENUMS PARA KNOWLEDGE
# ============================================================================

class TipoKnowledgeEnum(str, Enum):
    CERTIFICACAO = "CERTIFICACAO"
    FORMACAO = "FORMACAO"
    CURSO = "CURSO"
    TREINAMENTO = "TREINAMENTO"

class StatusKnowledgeEnum(str, Enum):
    DESEJADO = "DESEJADO"
    EM_PROGRESSO = "EM_PROGRESSO"
    EM_ANDAMENTO = "EM_ANDAMENTO"  # Compatibilidade
    OBTIDO = "OBTIDO"
    EXPIRADO = "EXPIRADO"
    OBRIGATORIO = "OBRIGATORIO"

class PrioridadeEnum(str, Enum):
    ALTA = "ALTA"
    MEDIA = "MEDIA"
    BAIXA = "BAIXA"

class DificuldadeEnum(str, Enum):
    FACIL = "FACIL"
    MEDIO = "MEDIO"
    DIFICIL = "DIFICIL"

class ModalidadeEnum(str, Enum):
    PRESENCIAL = "PRESENCIAL"
    EAD = "EAD"
    HIBRIDO = "HIBRIDO"

class NivelFormacaoEnum(str, Enum):
    TECNICO = "TECNICO"
    SUPERIOR = "SUPERIOR"
    POS_GRADUACAO = "POS_GRADUACAO"
    MESTRADO = "MESTRADO"
    DOUTORADO = "DOUTORADO"

# ============================================================================
# 📝 SCHEMAS KNOWLEDGE
# ============================================================================

class KnowledgeBase(BaseModel):
    nome: str
    codigo: Optional[str] = None
    tipo: TipoKnowledgeEnum = TipoKnowledgeEnum.CURSO
    categoria: str
    area: Optional[str] = None  # Compatibilidade frontend
    fornecedor: Optional[str] = None
    vendor: Optional[str] = None  # Compatibilidade frontend
    validade_anos: Optional[float] = None
    validade_meses: Optional[int] = None
    nivel_formacao: Optional[NivelFormacaoEnum] = None
    nivel: Optional[str] = "BASICO"
    modalidade: ModalidadeEnum = ModalidadeEnum.EAD
    preco: Optional[float] = None
    carga_horaria: Optional[int] = None
    descricao: Optional[str] = ""
    link: Optional[str] = None
    pre_requisitos: Optional[str] = None
    tags: Optional[str] = None
    dificuldade: DificuldadeEnum = DificuldadeEnum.MEDIO
    ativo: bool = True
    popular: bool = False
    obrigatorio: bool = False

    @validator('preco')
    def validate_preco(cls, v):
        if v is not None and v < 0:
            raise ValueError('Preço não pode ser negativo')
        return v

    @validator('carga_horaria')
    def validate_carga_horaria(cls, v):
        if v is not None and v <= 0:
            raise ValueError('Carga horária deve ser positiva')
        return v

class KnowledgeCreate(KnowledgeBase):
    pass

class KnowledgeUpdate(BaseModel):
    nome: Optional[str] = None
    codigo: Optional[str] = None
    tipo: Optional[TipoKnowledgeEnum] = None
    categoria: Optional[str] = None
    area: Optional[str] = None
    fornecedor: Optional[str] = None
    vendor: Optional[str] = None
    validade_anos: Optional[float] = None
    validade_meses: Optional[int] = None
    nivel_formacao: Optional[NivelFormacaoEnum] = None
    nivel: Optional[str] = None
    modalidade: Optional[ModalidadeEnum] = None
    preco: Optional[float] = None
    carga_horaria: Optional[int] = None
    descricao: Optional[str] = None
    link: Optional[str] = None
    pre_requisitos: Optional[str] = None
    tags: Optional[str] = None
    dificuldade: Optional[DificuldadeEnum] = None
    ativo: Optional[bool] = None
    popular: Optional[bool] = None
    obrigatorio: Optional[bool] = None

class KnowledgeResponse(KnowledgeBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# ============================================================================
# 📝 SCHEMAS EMPLOYEE-KNOWLEDGE
# ============================================================================

class EmployeeKnowledgeBase(BaseModel):
    employee_id: int
    learning_item_id: int  # Compatibilidade com frontend
    knowledge_id: Optional[int] = None  # Compatibilidade
    status: StatusKnowledgeEnum = StatusKnowledgeEnum.DESEJADO
    prioridade: PrioridadeEnum = PrioridadeEnum.MEDIA
    progresso: float = 0.0
    data_obtencao: Optional[date] = None
    data_expiracao: Optional[date] = None
    data_alvo: Optional[date] = None
    data_inicio: Optional[date] = None
    anexo_path: Optional[str] = None
    anexo_nome: Optional[str] = None
    anexo_tipo: Optional[str] = None
    valor_investido: Optional[float] = None
    reembolsavel: bool = False
    reembolsado: bool = False
    observacoes: Optional[str] = ""
    notas_gestor: Optional[str] = None
    nota_avaliacao: Optional[float] = None

    @validator('progresso')
    def validate_progresso(cls, v):
        if v < 0 or v > 100:
            raise ValueError('Progresso deve estar entre 0 e 100')
        return v

    @validator('nota_avaliacao')
    def validate_nota_avaliacao(cls, v):
        if v is not None and (v < 1 or v > 10):
            raise ValueError('Nota de avaliação deve estar entre 1 e 10')
        return v

class EmployeeKnowledgeCreate(EmployeeKnowledgeBase):
    pass

class EmployeeKnowledgeUpdate(BaseModel):
    status: Optional[StatusKnowledgeEnum] = None
    prioridade: Optional[PrioridadeEnum] = None
    progresso: Optional[float] = None
    data_obtencao: Optional[date] = None
    data_expiracao: Optional[date] = None
    data_alvo: Optional[date] = None
    data_inicio: Optional[date] = None
    anexo_path: Optional[str] = None
    anexo_nome: Optional[str] = None
    anexo_tipo: Optional[str] = None
    valor_investido: Optional[float] = None
    reembolsavel: Optional[bool] = None
    reembolsado: Optional[bool] = None
    observacoes: Optional[str] = None
    notas_gestor: Optional[str] = None
    nota_avaliacao: Optional[float] = None

class EmployeeKnowledgeResponse(EmployeeKnowledgeBase):
    id: int
    knowledge: Optional[KnowledgeResponse] = None
    employee_nome: Optional[str] = None
    knowledge_nome: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# ============================================================================
# 📊 SCHEMAS DE ESTATÍSTICAS
# ============================================================================

class KnowledgeStats(BaseModel):
    total_catalogo: int
    total_obtidas: int
    total_desejadas: int
    total_em_andamento: int
    vencendo_30_dias: int
    vencidas: int
    por_categoria: Dict[str, int]
    por_fornecedor: Dict[str, int]
    por_status: Dict[str, int]
    por_tipo: Dict[str, int]
    por_prioridade: Dict[str, int]

class CertificacaoExpirando(BaseModel):
    employee_id: int
    employee_nome: str
    knowledge_id: int
    knowledge_nome: str
    data_expiracao: date
    dias_para_expirar: int
    prioridade: str
