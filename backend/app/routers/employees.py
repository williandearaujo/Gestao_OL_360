from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models.employee import Employee
from ..schemas.employee import EmployeeCreate, EmployeeUpdate, EmployeeResponse, EmployeeStats
from ..utils.employee_utils import calculate_employee_stats

router = APIRouter(prefix="/employees", tags=["employees"])

@router.get("/", response_model=List[EmployeeResponse])
def get_employees(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = Query(None),
    equipe: Optional[str] = Query(None),
    nivel: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Employee)
    
    # Filtros
    if search:
        query = query.filter(
            Employee.nome.ilike(f"%{search}%") |
            Employee.email.ilike(f"%{search}%") |
            Employee.cargo.ilike(f"%{search}%")
        )
    
    if equipe:
        query = query.filter(Employee.equipe == equipe)
    
    if nivel:
        query = query.filter(Employee.nivel == nivel)
    
    if status:
        query = query.filter(Employee.status == status)
    
    employees = query.offset(skip).limit(limit).all()
    return employees

@router.get("/stats", response_model=EmployeeStats)
def get_employee_stats(db: Session = Depends(get_db)):
    employees = db.query(Employee).all()
    return calculate_employee_stats(employees)

@router.get("/{employee_id}", response_model=EmployeeResponse)
def get_employee(employee_id: int, db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Colaborador não encontrado")
    return employee

@router.post("/", response_model=EmployeeResponse)
def create_employee(employee: EmployeeCreate, db: Session = Depends(get_db)):
    # Verificar se email já existe
    if db.query(Employee).filter(Employee.email == employee.email).first():
        raise HTTPException(status_code=400, detail="Email já cadastrado")
    
    # Verificar se CPF já existe
    if db.query(Employee).filter(Employee.cpf == employee.cpf).first():
        raise HTTPException(status_code=400, detail="CPF já cadastrado")
    
    # Calcular mês de aniversário para dayoff
    employee_data = employee.dict()
    employee_data["dayoff"]["mes_aniversario"] = employee.data_nascimento.month
    
    db_employee = Employee(**employee_data)
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee

@router.put("/{employee_id}", response_model=EmployeeResponse)
def update_employee(
    employee_id: int, 
    employee_update: EmployeeUpdate, 
    db: Session = Depends(get_db)
):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Colaborador não encontrado")
    
    update_data = employee_update.dict(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(employee, field, value)
    
    db.commit()
    db.refresh(employee)
    return employee

@router.delete("/{employee_id}")
def delete_employee(employee_id: int, db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Colaborador não encontrado")
    
    db.delete(employee)
    db.commit()
    return {"message": "Colaborador removido com sucesso"}

@router.post("/{employee_id}/upload-photo")
def upload_employee_photo(employee_id: int, photo_base64: str, db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Colaborador não encontrado")
    
    employee.avatar = photo_base64
    db.commit()
    return {"message": "Foto atualizada com sucesso"}

# Endpoints específicos para PDI, Férias, 1x1, etc.
@router.put("/{employee_id}/pdi")
def update_employee_pdi(employee_id: int, pdi_data: dict, db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Colaborador não encontrado")
    
    employee.pdi = {**employee.pdi, **pdi_data}
    db.commit()
    return {"message": "PDI atualizado com sucesso"}

@router.put("/{employee_id}/reunioes-1x1")
def update_employee_meetings(employee_id: int, meeting_data: dict, db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Colaborador não encontrado")
    
    employee.reunioes_1x1 = {**employee.reunioes_1x1, **meeting_data}
    db.commit()
    return {"message": "Reunião 1x1 atualizada com sucesso"}

@router.put("/{employee_id}/ferias")
def update_employee_vacation(employee_id: int, vacation_data: dict, db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Colaborador não encontrado")
    
    employee.ferias = {**employee.ferias, **vacation_data}
    db.commit()
    return {"message": "Férias atualizadas com sucesso"}

@router.put("/{employee_id}/dayoff")
def update_employee_dayoff(employee_id: int, dayoff_data: dict, db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Colaborador não encontrado")
    
    employee.dayoff = {**employee.dayoff, **dayoff_data}
    db.commit()
    return {"message": "Day off atualizado com sucesso"}
