from pydantic import BaseModel, validator
from typing import Optional, List, Dict, Any
from datetime import date, datetime

class KnowledgeBase(BaseModel):
    nome: str
    categoria: str
    fornecedor: Optional[str] = None
    tipo: str = "CERTIFICACAO"
    validade_anos: int = 3
    descricao: Optional[str] = None

class KnowledgeCreate(KnowledgeBase):
    pass

class KnowledgeUpdate(BaseModel):
    nome: Optional[str] = None
    categoria: Optional[str] = None
    fornecedor: Optional[str] = None
    tipo: Optional[str] = None
    validade_anos: Optional[int] = None
    descricao: Optional[str] = None

class KnowledgeResponse(KnowledgeBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class EmployeeKnowledgeBase(BaseModel):
    employee_id: int
    knowledge_id: int
    status: str = "DESEJADO"
    data_obtencao: Optional[date] = None
    data_expiracao: Optional[date] = None
    data_alvo: Optional[date] = None
    certificado_arquivo: Optional[str] = None

class EmployeeKnowledgeCreate(EmployeeKnowledgeBase):
    pass

class EmployeeKnowledgeUpdate(BaseModel):
    status: Optional[str] = None
    data_obtencao: Optional[date] = None
    data_expiracao: Optional[date] = None
    data_alvo: Optional[date] = None
    certificado_arquivo: Optional[str] = None

class EmployeeKnowledgeResponse(EmployeeKnowledgeBase):
    id: int
    knowledge: KnowledgeResponse
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

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
