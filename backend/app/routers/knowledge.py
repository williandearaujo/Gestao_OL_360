from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models.knowledge import Knowledge
from ..models.employee_knowledge import EmployeeKnowledge
from ..models.employee import Employee
from ..schemas.knowledge import (
    KnowledgeCreate, KnowledgeUpdate, KnowledgeResponse, KnowledgeStats,
    EmployeeKnowledgeCreate, EmployeeKnowledgeUpdate, EmployeeKnowledgeResponse
)
from ..utils.knowledge_utils import calculate_knowledge_stats
import base64

router = APIRouter(prefix="/knowledge", tags=["knowledge"])

# ==================== CATÁLOGO DE CONHECIMENTOS ====================

@router.get("/catalog", response_model=List[KnowledgeResponse])
def get_knowledge_catalog(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = Query(None),
    categoria: Optional[str] = Query(None),
    fornecedor: Optional[str] = Query(None),
    tipo: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Knowledge)
    
    if search:
        query = query.filter(
            Knowledge.nome.ilike(f"%{search}%") |
            Knowledge.descricao.ilike(f"%{search}%")
        )
    
    if categoria:
        query = query.filter(Knowledge.categoria == categoria)
    
    if fornecedor:
        query = query.filter(Knowledge.fornecedor == fornecedor)
    
    if tipo:
        query = query.filter(Knowledge.tipo == tipo)
    
    knowledge_list = query.offset(skip).limit(limit).all()
    return knowledge_list

@router.get("/catalog/stats", response_model=KnowledgeStats)
def get_knowledge_stats(db: Session = Depends(get_db)):
    knowledge_list = db.query(Knowledge).all()
    employee_knowledge_list = db.query(EmployeeKnowledge).all()
    return calculate_knowledge_stats(knowledge_list, employee_knowledge_list)

@router.get("/catalog/{knowledge_id}", response_model=KnowledgeResponse)
def get_knowledge_item(knowledge_id: int, db: Session = Depends(get_db)):
    knowledge = db.query(Knowledge).filter(Knowledge.id == knowledge_id).first()
    if not knowledge:
        raise HTTPException(status_code=404, detail="Conhecimento não encontrado")
    return knowledge

@router.post("/catalog", response_model=KnowledgeResponse)
def create_knowledge(knowledge: KnowledgeCreate, db: Session = Depends(get_db)):
    # Verificar se já existe
    existing = db.query(Knowledge).filter(
        Knowledge.nome == knowledge.nome,
        Knowledge.fornecedor == knowledge.fornecedor
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Este conhecimento já existe no catálogo")
    
    db_knowledge = Knowledge(**knowledge.dict())
    db.add(db_knowledge)
    db.commit()
    db.refresh(db_knowledge)
    return db_knowledge

@router.put("/catalog/{knowledge_id}", response_model=KnowledgeResponse)
def update_knowledge(
    knowledge_id: int,
    knowledge_update: KnowledgeUpdate,
    db: Session = Depends(get_db)
):
    knowledge = db.query(Knowledge).filter(Knowledge.id == knowledge_id).first()
    if not knowledge:
        raise HTTPException(status_code=404, detail="Conhecimento não encontrado")
    
    update_data = knowledge_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(knowledge, field, value)
    
    db.commit()
    db.refresh(knowledge)
    return knowledge

@router.delete("/catalog/{knowledge_id}")
def delete_knowledge(knowledge_id: int, db: Session = Depends(get_db)):
    knowledge = db.query(Knowledge).filter(Knowledge.id == knowledge_id).first()
    if not knowledge:
        raise HTTPException(status_code=404, detail="Conhecimento não encontrado")
    
    # Verificar se há vínculos com colaboradores
    employee_knowledge = db.query(EmployeeKnowledge).filter(
        EmployeeKnowledge.knowledge_id == knowledge_id
    ).first()
    
    if employee_knowledge:
        raise HTTPException(
            status_code=400, 
            detail="Não é possível excluir: há colaboradores vinculados a este conhecimento"
        )
    
    db.delete(knowledge)
    db.commit()
    return {"message": "Conhecimento removido do catálogo"}

# ==================== CONHECIMENTOS DOS COLABORADORES ====================

@router.get("/employees", response_model=List[EmployeeKnowledgeResponse])
def get_employee_knowledge_list(
    employee_id: Optional[int] = Query(None),
    knowledge_id: Optional[int] = Query(None),
    status: Optional[str] = Query(None),
    vencendo: Optional[bool] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(EmployeeKnowledge)
    
    if employee_id:
        query = query.filter(EmployeeKnowledge.employee_id == employee_id)
    
    if knowledge_id:
        query = query.filter(EmployeeKnowledge.knowledge_id == knowledge_id)
    
    if status:
        query = query.filter(EmployeeKnowledge.status == status)
    
    if vencendo:
        from datetime import date, timedelta
        thirty_days_from_now = date.today() + timedelta(days=30)
        query = query.filter(
            EmployeeKnowledge.data_expiracao <= thirty_days_from_now,
            EmployeeKnowledge.data_expiracao >= date.today()
        )
    
    return query.all()

@router.post("/employees", response_model=EmployeeKnowledgeResponse)
def assign_knowledge_to_employee(
    employee_knowledge: EmployeeKnowledgeCreate,
    db: Session = Depends(get_db)
):
    # Verificar se colaborador existe
    employee = db.query(Employee).filter(Employee.id == employee_knowledge.employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Colaborador não encontrado")
    
    # Verificar se conhecimento existe
    knowledge = db.query(Knowledge).filter(Knowledge.id == employee_knowledge.knowledge_id).first()
    if not knowledge:
        raise HTTPException(status_code=404, detail="Conhecimento não encontrado")
    
    # Verificar se vínculo já existe
    existing = db.query(EmployeeKnowledge).filter(
        EmployeeKnowledge.employee_id == employee_knowledge.employee_id,
        EmployeeKnowledge.knowledge_id == employee_knowledge.knowledge_id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Este conhecimento já está vinculado ao colaborador")
    
    # Calcular data de expiração automaticamente se obtido
    employee_knowledge_data = employee_knowledge.dict()
    if employee_knowledge.status == "OBTIDO" and employee_knowledge.data_obtencao:
        from datetime import timedelta
        expiration_date = employee_knowledge.data_obtencao + timedelta(days=knowledge.validade_anos * 365)
        employee_knowledge_data["data_expiracao"] = expiration_date
    
    db_employee_knowledge = EmployeeKnowledge(**employee_knowledge_data)
    db.add(db_employee_knowledge)
    db.commit()
    db.refresh(db_employee_knowledge)
    return db_employee_knowledge

@router.put("/employees/{employee_knowledge_id}", response_model=EmployeeKnowledgeResponse)
def update_employee_knowledge(
    employee_knowledge_id: int,
    update_data: EmployeeKnowledgeUpdate,
    db: Session = Depends(get_db)
):
    employee_knowledge = db.query(EmployeeKnowledge).filter(
        EmployeeKnowledge.id == employee_knowledge_id
    ).first()
    
    if not employee_knowledge:
        raise HTTPException(status_code=404, detail="Vínculo não encontrado")
    
    update_dict = update_data.dict(exclude_unset=True)
    
    # Recalcular expiração se necessário
    if "data_obtencao" in update_dict and update_dict["data_obtencao"]:
        knowledge = db.query(Knowledge).filter(
            Knowledge.id == employee_knowledge.knowledge_id
        ).first()
        from datetime import timedelta
        expiration_date = update_dict["data_obtencao"] + timedelta(days=knowledge.validade_anos * 365)
        update_dict["data_expiracao"] = expiration_date
    
    for field, value in update_dict.items():
        setattr(employee_knowledge, field, value)
    
    db.commit()
    db.refresh(employee_knowledge)
    return employee_knowledge

@router.delete("/employees/{employee_knowledge_id}")
def remove_knowledge_from_employee(employee_knowledge_id: int, db: Session = Depends(get_db)):
    employee_knowledge = db.query(EmployeeKnowledge).filter(
        EmployeeKnowledge.id == employee_knowledge_id
    ).first()
    
    if not employee_knowledge:
        raise HTTPException(status_code=404, detail="Vínculo não encontrado")
    
    db.delete(employee_knowledge)
    db.commit()
    return {"message": "Conhecimento removido do colaborador"}

@router.post("/employees/{employee_knowledge_id}/upload-certificate")
async def upload_certificate(
    employee_knowledge_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    employee_knowledge = db.query(EmployeeKnowledge).filter(
        EmployeeKnowledge.id == employee_knowledge_id
    ).first()
    
    if not employee_knowledge:
        raise HTTPException(status_code=404, detail="Vínculo não encontrado")
    
    # Validar tipo de arquivo
    allowed_types = ["application/pdf", "image/jpeg", "image/png"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Tipo de arquivo não permitido")
    
    # Converter para base64
    content = await file.read()
    base64_content = base64.b64encode(content).decode()
    file_data = f"data:{file.content_type};base64,{base64_content}"
    
    employee_knowledge.certificado_arquivo = file_data
    db.commit()
    
    return {"message": "Certificado enviado com sucesso"}

# ==================== RELATÓRIOS E FILTROS ====================

@router.get("/categories")
def get_knowledge_categories(db: Session = Depends(get_db)):
    categories = db.query(Knowledge.categoria).distinct().all()
    return [cat[0] for cat in categories if cat[0]]

@router.get("/vendors")
def get_knowledge_vendors(db: Session = Depends(get_db)):
    vendors = db.query(Knowledge.fornecedor).distinct().all()
    return [vendor[0] for vendor in vendors if vendor[0]]

@router.get("/types")
def get_knowledge_types(db: Session = Depends(get_db)):
    types = db.query(Knowledge.tipo).distinct().all()
    return [type_[0] for type_ in types if type_[0]]

@router.get("/expiring-soon")
def get_expiring_knowledge(days: int = 30, db: Session = Depends(get_db)):
    from datetime import date, timedelta
    
    target_date = date.today() + timedelta(days=days)
    
    expiring = db.query(EmployeeKnowledge).filter(
        EmployeeKnowledge.data_expiracao <= target_date,
        EmployeeKnowledge.data_expiracao >= date.today(),
        EmployeeKnowledge.status == "OBTIDO"
    ).all()
    
    return expiring
