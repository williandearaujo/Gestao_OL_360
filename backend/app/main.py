from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, joinedload
from app.database import get_db, engine, Base
from app.models.employee import Employee
from app.models.knowledge import Knowledge
from app.models.employee_knowledge import EmployeeKnowledge
from app.models.team import Team
from app.models.manager import Manager
from datetime import datetime, date, timedelta
from typing import Optional, List

# Criar tabelas
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Gestão OL 360 API", version="1.0.2")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "Gestão OL 360 API - Funcionando!",
        "version": "1.0.2",
        "endpoints": {
            "employees": "/employees",
            "teams": "/teams",
            "managers": "/managers",
            "knowledge": "/knowledge",
            "employee-knowledge": "/employee-knowledge",
            "docs": "/docs"
        }
    }


# === EMPLOYEES ENDPOINTS ===
@app.get("/employees")
def get_employees(db: Session = Depends(get_db)):
    """Listar funcionários com campos corretos"""
    try:
        employees = db.query(Employee).all()
        return [
            {
                "id": emp.id,
                "nome": emp.nome,
                "email": emp.email,
                "cargo": emp.cargo,
                "area": emp.equipe,
                "equipe": emp.equipe,
                "nivel": emp.nivel,
                "status": emp.status,
                "telefone": emp.telefone or "",
                "cpf": emp.cpf or "",
                "rg": emp.rg or "",
                "data_admissao": str(emp.data_admissao) if emp.data_admissao else None,
                "data_nascimento": str(emp.data_nascimento) if emp.data_nascimento else None,
                "estado_civil": emp.estado_civil or "SOLTEIRO",
                "salario": emp.salario or 0.0,
                "competencias": emp.competencias or [],
                "endereco": emp.endereco or {},
                "pdi": emp.pdi or {},
                "ferias": emp.ferias or {},
                "reunioes_1x1": emp.reunioes_1x1 or {},
                "dayoff": emp.dayoff or {},
                "team_id": emp.team_id,
                "manager_id": emp.manager_id
            }
            for emp in employees
        ]
    except Exception as e:
        print(f"❌ Erro ao buscar employees: {str(e)}")
        return {"error": str(e)}


@app.get("/employees/{employee_id}")
def get_employee(employee_id: int, db: Session = Depends(get_db)):
    """Obter funcionário por ID"""
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    return {
        "id": employee.id,
        "nome": employee.nome,
        "email": employee.email,
        "cargo": employee.cargo,
        "area": employee.equipe,
        "equipe": employee.equipe,
        "nivel": employee.nivel,
        "status": employee.status,
        "telefone": employee.telefone or "",
        "cpf": employee.cpf or "",
        "rg": employee.rg or "",
        "data_admissao": str(employee.data_admissao) if employee.data_admissao else None,
        "data_nascimento": str(employee.data_nascimento) if employee.data_nascimento else None,
        "estado_civil": employee.estado_civil or "SOLTEIRO",
        "salario": employee.salario or 0.0,
        "competencias": employee.competencias or [],
        "endereco": employee.endereco or {},
        "pdi": employee.pdi or {},
        "ferias": employee.ferias or {},
        "reunioes_1x1": employee.reunioes_1x1 or {},
        "dayoff": employee.dayoff or {},
        "team_id": employee.team_id,
        "manager_id": employee.manager_id
    }


# ✅ ENDPOINT CORRIGIDO - SEM JOINS PROBLEMÁTICOS
@app.get("/employee-knowledge")
def get_employee_knowledge(
        db: Session = Depends(get_db),
        employee_id: Optional[int] = None,
        knowledge_id: Optional[int] = None,
        status: Optional[str] = None,
        skip: int = 0,
        limit: int = 100
):
    query = db.query(EmployeeKnowledge)

    # Filtros
    if employee_id:
        query = query.filter(EmployeeKnowledge.employee_id == employee_id)
    if knowledge_id:
        query = query.filter(EmployeeKnowledge.learning_item_id == knowledge_id)
    if status:
        query = query.filter(EmployeeKnowledge.status == status)

    results = query.offset(skip).limit(limit).all()

    # ✅ QUERIES SEPARADAS (FUNCIONA!)
    response = []
    for item in results:
        # Buscar employee e knowledge separadamente
        employee = db.query(Employee).filter(Employee.id == item.employee_id).first()
        knowledge = db.query(Knowledge).filter(Knowledge.id == item.learning_item_id).first()

        response.append({
            "id": item.id,
            "employee_id": item.employee_id,
            "knowledge_id": item.learning_item_id,
            "status": item.status,
            "prioridade": item.prioridade,
            "data_alvo": item.data_alvo,
            "data_obtencao": item.data_obtencao,
            "data_expiracao": item.data_expiracao,
            "anexo_path": item.anexo_path,
            "observacoes": item.observacoes,
            "employee": {
                "id": employee.id,
                "nome": employee.nome,
                "cargo": employee.cargo,
                "equipe": employee.equipe
            } if employee else None,
            "knowledge": {
                "id": knowledge.id,
                "nome": knowledge.nome,
                "tipo": knowledge.tipo,
                "codigo": getattr(knowledge, 'codigo', ''),
                "vendor": getattr(knowledge, 'fornecedor', ''),
                "area": getattr(knowledge, 'categoria', '')
            } if knowledge else None
        })

    return response


@app.get("/employee-knowledge/stats")
def get_employee_knowledge_stats(db: Session = Depends(get_db)):
    try:
        # Contadores por status
        total = db.query(EmployeeKnowledge).count()
        desejados = db.query(EmployeeKnowledge).filter(EmployeeKnowledge.status == "DESEJADO").count()
        obrigatorios = db.query(EmployeeKnowledge).filter(EmployeeKnowledge.status == "OBRIGATORIO").count()
        obtidos = db.query(EmployeeKnowledge).filter(EmployeeKnowledge.status == "OBTIDO").count()

        # Certificações expirando em 30 dias
        thirty_days = datetime.now().date() + timedelta(days=30)
        expirando = db.query(EmployeeKnowledge).filter(
            EmployeeKnowledge.status == "OBTIDO",
            EmployeeKnowledge.data_expiracao <= thirty_days,
            EmployeeKnowledge.data_expiracao >= datetime.now().date()
        ).count()

        return {
            "total": total,
            "por_status": {
                "desejados": desejados,
                "obrigatorios": obrigatorios,
                "obtidos": obtidos
            },
            "expirando_30d": expirando,
            "success": True
        }

    except Exception as e:
        return {"error": str(e), "success": False}


@app.post("/employees")
def create_employee(employee_data: dict, db: Session = Depends(get_db)):
    """Criar novo funcionário - COM CONVERSÃO DE DATAS E IDs"""
    try:
        print(f"🔍 DADOS RECEBIDOS: {employee_data}")

        # Mapear area para equipe
        if "area" in employee_data:
            employee_data["equipe"] = employee_data.pop("area")

        # ✅ CONVERTER DATAS DE STRING PARA DATE
        date_fields = ["data_nascimento", "data_admissao"]
        for field in date_fields:
            if field in employee_data and employee_data[field]:
                if isinstance(employee_data[field], str):
                    try:
                        employee_data[field] = datetime.strptime(employee_data[field], "%Y-%m-%d").date()
                        print(f"✅ {field} convertido: {employee_data[field]}")
                    except ValueError:
                        print(f"❌ Erro ao converter {field}: {employee_data[field]}")
                        employee_data[field] = None

        # ✅ CONVERTER SALÁRIO VAZIO PARA FLOAT
        if "salario" in employee_data:
            if employee_data["salario"] == '' or employee_data["salario"] is None:
                employee_data["salario"] = 0.0
            else:
                employee_data["salario"] = float(employee_data["salario"])

        # ✅ CONVERTER IDs PARA INT (se não for None)
        id_fields = ["team_id", "manager_id"]
        for field in id_fields:
            if field in employee_data:
                if employee_data[field] == '' or employee_data[field] is None:
                    employee_data[field] = None
                else:
                    employee_data[field] = int(employee_data[field])
                print(f"🔢 {field}: {employee_data[field]}")

        # ✅ FILTRAR CAMPOS VÁLIDOS (INCLUINDO team_id E manager_id)
        allowed_fields = [
            'nome', 'email', 'cargo', 'equipe', 'nivel', 'status',
            'telefone', 'cpf', 'rg', 'data_nascimento', 'estado_civil',
            'data_admissao', 'salario', 'endereco', 'competencias',
            'team_id', 'manager_id'
        ]

        filtered_data = {k: v for k, v in employee_data.items() if k in allowed_fields}
        print(f"📝 DADOS FILTRADOS E CONVERTIDOS: {filtered_data}")

        employee = Employee(**filtered_data)
        db.add(employee)
        db.commit()
        db.refresh(employee)

        print(f"🎉 FUNCIONÁRIO CRIADO COM ID: {employee.id}")
        print(f"👥 Team ID: {employee.team_id}, Manager ID: {employee.manager_id}")

        return {"id": employee.id, "message": "Funcionário criado com sucesso", "success": True}

    except Exception as e:
        print(f"💥 ERRO: {str(e)}")
        db.rollback()
        return {"error": str(e), "success": False}


@app.post("/employee-knowledge")
def create_employee_knowledge(knowledge_data: dict, db: Session = Depends(get_db)):
    try:
        print(f"🔍 DADOS RECEBIDOS: {knowledge_data}")

        # Campos obrigatórios
        required_fields = ['employee_id', 'learning_item_id', 'status']
        for field in required_fields:
            if field not in knowledge_data:
                return {"error": f"Campo {field} é obrigatório", "success": False}

        # ✅ CONVERTER IDs PARA INT
        knowledge_data["employee_id"] = int(knowledge_data["employee_id"])
        knowledge_data["learning_item_id"] = int(knowledge_data["learning_item_id"])

        # Verificar duplicata
        existing = db.query(EmployeeKnowledge).filter(
            EmployeeKnowledge.employee_id == knowledge_data['employee_id'],
            EmployeeKnowledge.learning_item_id == knowledge_data['learning_item_id']
        ).first()

        if existing:
            return {"error": "Vínculo já existe para este colaborador", "success": False}

        # Processar dados
        processed_data = {
            "employee_id": knowledge_data["employee_id"],
            "learning_item_id": knowledge_data["learning_item_id"],
            "status": knowledge_data.get("status", "DESEJADO"),
            "prioridade": knowledge_data.get("prioridade", "MEDIA"),
            "data_alvo": knowledge_data.get("data_alvo"),
            "data_obtencao": knowledge_data.get("data_obtencao"),
            "data_expiracao": knowledge_data.get("data_expiracao"),
            "anexo_path": knowledge_data.get("anexo_path"),
            "observacoes": knowledge_data.get("observacoes", "")
        }

        # ✅ CONVERTER STRINGS VAZIAS PARA None
        for field in ['data_alvo', 'data_obtencao', 'data_expiracao', 'anexo_path', 'observacoes']:
            if processed_data[field] == '':
                processed_data[field] = None

        # Converter datas válidas
        for date_field in ['data_alvo', 'data_obtencao', 'data_expiracao']:
            if processed_data[date_field]:
                try:
                    processed_data[date_field] = datetime.strptime(
                        processed_data[date_field], "%Y-%m-%d"
                    ).date()
                except:
                    processed_data[date_field] = None

        print(f"📝 DADOS PROCESSADOS: {processed_data}")

        # Criar vínculo
        employee_knowledge = EmployeeKnowledge(**processed_data)
        db.add(employee_knowledge)
        db.commit()
        db.refresh(employee_knowledge)

        print(f"🎉 VÍNCULO CRIADO COM ID: {employee_knowledge.id}")

        return {
            "id": employee_knowledge.id,
            "message": "Vínculo criado com sucesso",
            "success": True
        }

    except Exception as e:
        db.rollback()
        print(f"❌ ERRO: {str(e)}")
        return {"error": str(e), "success": False}


@app.put("/employees/{employee_id}")
def update_employee(employee_id: int, employee_data: dict, db: Session = Depends(get_db)):
    """Atualizar funcionário - COM CONVERSÃO DE DATAS E IDs"""
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    try:
        print(f"🔧 ATUALIZANDO FUNCIONÁRIO {employee_id}: {employee_data}")

        # Mapear area para equipe
        if "area" in employee_data:
            employee_data["equipe"] = employee_data.pop("area")

        # ✅ CONVERTER DATAS DE STRING PARA DATE
        date_fields = ["data_nascimento", "data_admissao"]
        for field in date_fields:
            if field in employee_data and employee_data[field]:
                if isinstance(employee_data[field], str):
                    try:
                        employee_data[field] = datetime.strptime(employee_data[field], "%Y-%m-%d").date()
                        print(f"✅ {field} convertido: {employee_data[field]}")
                    except ValueError:
                        print(f"❌ Erro ao converter {field}: {employee_data[field]}")

        # ✅ CONVERTER SALÁRIO
        if "salario" in employee_data:
            if employee_data["salario"] == '' or employee_data["salario"] is None:
                employee_data["salario"] = 0.0
            else:
                employee_data["salario"] = float(employee_data["salario"])

        # ✅ CONVERTER IDs PARA INT
        id_fields = ["team_id", "manager_id"]
        for field in id_fields:
            if field in employee_data:
                if employee_data[field] == '' or employee_data[field] is None:
                    employee_data[field] = None
                else:
                    employee_data[field] = int(employee_data[field])

        # ✅ FILTRAR CAMPOS VÁLIDOS (INCLUINDO team_id E manager_id)
        allowed_fields = [
            'nome', 'email', 'cargo', 'equipe', 'nivel', 'status',
            'telefone', 'cpf', 'rg', 'data_nascimento', 'estado_civil',
            'data_admissao', 'salario', 'endereco', 'competencias',
            'team_id', 'manager_id'
        ]

        # Atualizar apenas campos permitidos
        for field, value in employee_data.items():
            if field in allowed_fields and hasattr(employee, field):
                setattr(employee, field, value)
                print(f"📝 Atualizado {field}: {value}")

        db.commit()
        db.refresh(employee)

        print(f"✅ FUNCIONÁRIO {employee_id} ATUALIZADO!")
        print(f"👥 Team ID: {employee.team_id}, Manager ID: {employee.manager_id}")

        return {"message": "Funcionário atualizado com sucesso", "success": True}

    except Exception as e:
        print(f"💥 ERRO UPDATE: {str(e)}")
        db.rollback()
        return {"error": str(e), "success": False}


@app.put("/employee-knowledge/{id}")
def update_employee_knowledge(id: int, knowledge_data: dict, db: Session = Depends(get_db)):
    try:
        employee_knowledge = db.query(EmployeeKnowledge).filter(EmployeeKnowledge.id == id).first()

        if not employee_knowledge:
            return {"error": "Vínculo não encontrado", "success": False}

        # Atualizar campos
        for key, value in knowledge_data.items():
            if hasattr(employee_knowledge, key):
                # Converter datas
                if key in ['data_alvo', 'data_obtencao', 'data_expiracao'] and value:
                    try:
                        value = datetime.strptime(value, "%Y-%m-%d").date()
                    except:
                        value = None
                setattr(employee_knowledge, key, value)

        db.commit()
        db.refresh(employee_knowledge)

        return {
            "id": employee_knowledge.id,
            "message": "Vínculo atualizado com sucesso",
            "success": True
        }

    except Exception as e:
        db.rollback()
        return {"error": str(e), "success": False}


@app.put("/employees/{employee_id}/inactivate")
def inactivate_employee(employee_id: int, db: Session = Depends(get_db)):
    """Inativar funcionário (soft delete)"""
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    try:
        employee.status = "INATIVO"
        db.commit()
        db.refresh(employee)
        return {"message": "Funcionário inativado com sucesso", "success": True}
    except Exception as e:
        db.rollback()
        return {"error": str(e), "success": False}


@app.delete("/employees/{employee_id}")
def delete_employee(employee_id: int, db: Session = Depends(get_db)):
    """Deletar funcionário permanentemente (hard delete)"""
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    try:
        print(f"🗑️ DELETANDO PERMANENTEMENTE FUNCIONÁRIO {employee_id}: {employee.nome}")
        db.delete(employee)
        db.commit()
        return {"message": "Funcionário deletado permanentemente", "success": True}
    except Exception as e:
        db.rollback()
        return {"error": str(e), "success": False}


@app.delete("/employee-knowledge/{id}")
def delete_employee_knowledge(id: int, db: Session = Depends(get_db)):
    try:
        employee_knowledge = db.query(EmployeeKnowledge).filter(EmployeeKnowledge.id == id).first()

        if not employee_knowledge:
            return {"error": "Vínculo não encontrado", "success": False}

        db.delete(employee_knowledge)
        db.commit()

        return {"message": "Vínculo removido com sucesso", "success": True}

    except Exception as e:
        db.rollback()
        return {"error": str(e), "success": False}


# === TEAMS ENDPOINTS ===
@app.get("/teams")
def get_teams(db: Session = Depends(get_db)):
    """Listar equipes"""
    try:
        teams = db.query(Team).filter(Team.ativo == True).all()
        return [
            {
                "id": team.id,
                "nome": team.nome,
                "descricao": team.descricao,
                "cor": team.cor,
                "ativo": team.ativo,
                "created_at": str(team.created_at) if hasattr(team, 'created_at') else None
            }
            for team in teams
        ]
    except Exception as e:
        print(f"❌ Erro ao buscar teams: {str(e)}")
        return {"error": str(e)}


@app.post("/teams")
def create_team(team_data: dict, db: Session = Depends(get_db)):
    """Criar nova equipe"""
    try:
        team = Team(**team_data)
        db.add(team)
        db.commit()
        db.refresh(team)
        return {"id": team.id, "message": "Equipe criada com sucesso", "success": True}
    except Exception as e:
        db.rollback()
        return {"error": str(e), "success": False}


@app.put("/teams/{team_id}")
def update_team(team_id: int, team_data: dict, db: Session = Depends(get_db)):
    """Atualizar equipe"""
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")

    try:
        for field, value in team_data.items():
            if hasattr(team, field):
                setattr(team, field, value)

        db.commit()
        db.refresh(team)
        return {"message": "Equipe atualizada com sucesso", "success": True}
    except Exception as e:
        db.rollback()
        return {"error": str(e), "success": False}


@app.delete("/teams/{team_id}")
def delete_team(team_id: int, db: Session = Depends(get_db)):
    """Deletar equipe"""
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")

    try:
        db.delete(team)
        db.commit()
        return {"message": "Equipe deletada com sucesso", "success": True}
    except Exception as e:
        db.rollback()
        return {"error": str(e), "success": False}


# === MANAGERS ENDPOINTS ===
@app.get("/managers")
def get_managers(db: Session = Depends(get_db)):
    """Listar gerentes"""
    try:
        managers = db.query(Manager).filter(Manager.ativo == True).all()
        return [
            {
                "id": manager.id,
                "nome": manager.nome,
                "email": manager.email,
                "cargo": manager.cargo,
                "nivel_hierarquico": manager.nivel_hierarquico,
                "telefone": manager.telefone,
                "ativo": manager.ativo,
                "created_at": str(manager.created_at) if hasattr(manager, 'created_at') else None
            }
            for manager in managers
        ]
    except Exception as e:
        print(f"❌ Erro ao buscar managers: {str(e)}")
        return {"error": str(e)}


@app.post("/managers")
def create_manager(manager_data: dict, db: Session = Depends(get_db)):
    """Criar novo gerente"""
    try:
        manager = Manager(**manager_data)
        db.add(manager)
        db.commit()
        db.refresh(manager)
        return {"id": manager.id, "message": "Gerente criado com sucesso", "success": True}
    except Exception as e:
        db.rollback()
        return {"error": str(e), "success": False}


@app.put("/managers/{manager_id}")
def update_manager(manager_id: int, manager_data: dict, db: Session = Depends(get_db)):
    """Atualizar gerente"""
    manager = db.query(Manager).filter(Manager.id == manager_id).first()
    if not manager:
        raise HTTPException(status_code=404, detail="Manager not found")

    try:
        for field, value in manager_data.items():
            if hasattr(manager, field):
                setattr(manager, field, value)

        db.commit()
        db.refresh(manager)
        return {"message": "Gerente atualizado com sucesso", "success": True}
    except Exception as e:
        db.rollback()
        return {"error": str(e), "success": False}


@app.delete("/managers/{manager_id}")
def delete_manager(manager_id: int, db: Session = Depends(get_db)):
    """Deletar gerente"""
    manager = db.query(Manager).filter(Manager.id == manager_id).first()
    if not manager:
        raise HTTPException(status_code=404, detail="Manager not found")

    try:
        db.delete(manager)
        db.commit()
        return {"message": "Gerente deletado com sucesso", "success": True}
    except Exception as e:
        db.rollback()
        return {"error": str(e), "success": False}


# === KNOWLEDGE ENDPOINTS ===
@app.get("/knowledge")
def get_knowledge(db: Session = Depends(get_db)):
    """Listar conhecimentos com campos corretos"""
    try:
        knowledge_items = db.query(Knowledge).all()
        return [
            {
                "id": item.id,
                "nome": item.nome,
                "tipo": item.tipo,
                "codigo": getattr(item, 'codigo', ''),
                "vendor": getattr(item, 'fornecedor', ''),
                "area": getattr(item, 'categoria', ''),
                "validade_meses": item.validade_anos * 12 if item.validade_anos else None,
                "nivel_formacao": getattr(item, 'nivel_formacao', None),
                "link": getattr(item, 'link', None),
                "descricao": item.descricao
            }
            for item in knowledge_items
        ]
    except Exception as e:
        return {"error": str(e)}


@app.get("/knowledge/{knowledge_id}")
def get_knowledge_item(knowledge_id: int, db: Session = Depends(get_db)):
    """Obter conhecimento por ID"""
    item = db.query(Knowledge).filter(Knowledge.id == knowledge_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Knowledge not found")

    return {
        "id": item.id,
        "nome": item.nome,
        "tipo": item.tipo,
        "codigo": getattr(item, 'codigo', ''),
        "vendor": getattr(item, 'fornecedor', ''),
        "area": getattr(item, 'categoria', ''),
        "validade_meses": item.validade_anos * 12 if item.validade_anos else None,
        "nivel_formacao": getattr(item, 'nivel_formacao', None),
        "link": getattr(item, 'link', None),
        "descricao": item.descricao
    }


@app.post("/knowledge")
def create_knowledge(knowledge_data: dict, db: Session = Depends(get_db)):
    """Criar novo conhecimento"""
    try:
        # Mapear campos
        if "vendor" in knowledge_data:
            knowledge_data["fornecedor"] = knowledge_data.pop("vendor")
        if "area" in knowledge_data:
            knowledge_data["categoria"] = knowledge_data.pop("area")
        if "validade_meses" in knowledge_data and knowledge_data["validade_meses"]:
            knowledge_data["validade_anos"] = round(knowledge_data.pop("validade_meses") / 12, 1)

        knowledge = Knowledge(**knowledge_data)
        db.add(knowledge)
        db.commit()
        db.refresh(knowledge)
        return {"id": knowledge.id, "message": "Conhecimento criado com sucesso", "success": True}
    except Exception as e:
        db.rollback()
        return {"error": str(e), "success": False}


@app.put("/knowledge/{knowledge_id}")
def update_knowledge(knowledge_id: int, knowledge_data: dict, db: Session = Depends(get_db)):
    """Atualizar conhecimento"""
    knowledge = db.query(Knowledge).filter(Knowledge.id == knowledge_id).first()
    if not knowledge:
        raise HTTPException(status_code=404, detail="Knowledge not found")

    try:
        # Mapear campos
        if "vendor" in knowledge_data:
            knowledge_data["fornecedor"] = knowledge_data.pop("vendor")
        if "area" in knowledge_data:
            knowledge_data["categoria"] = knowledge_data.pop("area")
        if "validade_meses" in knowledge_data and knowledge_data["validade_meses"]:
            knowledge_data["validade_anos"] = round(knowledge_data.pop("validade_meses") / 12, 1)

        for field, value in knowledge_data.items():
            if hasattr(knowledge, field):
                setattr(knowledge, field, value)

        db.commit()
        db.refresh(knowledge)
        return {"message": "Conhecimento atualizado com sucesso", "success": True}
    except Exception as e:
        db.rollback()
        return {"error": str(e), "success": False}


@app.delete("/knowledge/{knowledge_id}")
def delete_knowledge(knowledge_id: int, db: Session = Depends(get_db)):
    """Deletar conhecimento"""
    knowledge = db.query(Knowledge).filter(Knowledge.id == knowledge_id).first()
    if not knowledge:
        raise HTTPException(status_code=404, detail="Knowledge not found")

    try:
        db.delete(knowledge)
        db.commit()
        return {"message": "Conhecimento deletado com sucesso", "success": True}
    except Exception as e:
        db.rollback()
        return {"error": str(e), "success": False}


@app.get("/health")
def health():
    return {"status": "healthy", "database": "connected", "version": "1.0.2"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
