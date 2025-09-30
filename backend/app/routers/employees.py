from fastapi import APIRouter, HTTPException, Depends, Request
from typing import List, Optional, Dict, Any
import json
import sqlite3
from datetime import datetime, date, timedelta
import logging
import traceback

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/employees",
    tags=["employees"]
)


# ============================================================================
# 🔧 SISTEMA DE FALLBACK E LOG DE ERROS
# ============================================================================

def get_db():
    """Retorna conexão com banco gestao360.db com row_factory"""
    conn = sqlite3.connect("gestao360.db")
    conn.row_factory = sqlite3.Row
    return conn


def log_system_error(db, error_type: str, description: str, details: Dict = None):
    """Log de erros do sistema para monitoramento admin"""
    try:
        cursor = db.cursor()

        # Verificar se tabela system_logs existe
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='system_logs'")
        if cursor.fetchone():
            cursor.execute("""
                           INSERT INTO system_logs
                           (employee_id, action_type, action_description, metadata, user_who_made_change, created_at)
                           VALUES (NULL, ?, ?, ?, 'SISTEMA', datetime('now'))
                           """, (
                               error_type,
                               description,
                               json.dumps(details or {}, ensure_ascii=False)
                           ))
            db.commit()
        else:
            # Se não existe, criar arquivo de log
            with open("system_errors.log", "a") as f:
                f.write(f"{datetime.now().isoformat()} - {error_type}: {description}\n")
                if details:
                    f.write(f"Detalhes: {json.dumps(details, ensure_ascii=False)}\n")
                f.write("---\n")

        logger.warning(f"⚠️ Sistema: {error_type} - {description}")
    except Exception as e:
        logger.error(f"❌ Erro ao criar log de erro: {e}")


def safe_get_table_columns(db, table_name: str) -> List[str]:
    """Obter colunas existentes de uma tabela de forma segura"""
    try:
        cursor = db.cursor()
        cursor.execute(f"PRAGMA table_info({table_name})")
        columns = [row[1] for row in cursor.fetchall()]
        return columns
    except Exception as e:
        logger.error(f"❌ Erro ao obter colunas da tabela {table_name}: {e}")
        return []


def create_system_log_safe(db, employee_id: int, action_type: str, description: str, user: str = "Sistema",
                           old_data: Dict = None, new_data: Dict = None, metadata: Dict = None):
    """Criar log no sistema de forma segura (ignora se tabela não existe)"""
    try:
        cursor = db.cursor()

        # Verificar se tabela existe
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='system_logs'")
        if not cursor.fetchone():
            log_system_error(db, "MISSING_TABLE", f"Tabela system_logs não existe - ação {action_type} não foi logada",
                             {
                                 "employee_id": employee_id,
                                 "action": action_type,
                                 "description": description
                             })
            return False

        # Verificar colunas existentes
        columns = safe_get_table_columns(db, "system_logs")
        required_columns = ["employee_id", "action_type", "action_description", "created_at"]

        missing_columns = [col for col in required_columns if col not in columns]
        if missing_columns:
            log_system_error(db, "MISSING_COLUMNS", f"Colunas faltando em system_logs: {missing_columns}", {
                "missing": missing_columns,
                "existing": columns
            })
            return False

        # Inserir log com colunas existentes
        base_query = "INSERT INTO system_logs (employee_id, action_type, action_description, created_at"
        base_values = "?, ?, ?, datetime('now'"
        params = [employee_id, action_type, description]

        # Adicionar colunas opcionais se existirem
        if "old_data" in columns and old_data:
            base_query += ", old_data"
            base_values += ", ?"
            params.append(json.dumps(old_data, ensure_ascii=False))

        if "new_data" in columns and new_data:
            base_query += ", new_data"
            base_values += ", ?"
            params.append(json.dumps(new_data, ensure_ascii=False))

        if "user_who_made_change" in columns:
            base_query += ", user_who_made_change"
            base_values += ", ?"
            params.append(user)

        if "metadata" in columns and metadata:
            base_query += ", metadata"
            base_values += ", ?"
            params.append(json.dumps(metadata, ensure_ascii=False))

        final_query = f"{base_query}) VALUES ({base_values})"

        cursor.execute(final_query, params)
        db.commit()

        logger.info(f"✅ Log criado: {action_type} para employee {employee_id}")
        return True

    except Exception as e:
        log_system_error(db, "LOG_ERROR", f"Erro ao criar log: {str(e)}", {
            "employee_id": employee_id,
            "action_type": action_type,
            "error": str(e),
            "traceback": traceback.format_exc()
        })
        return False


def safe_update_employee(db, employee_id: int, employee_data: Dict) -> Dict:
    """Atualizar funcionário de forma segura, ignorando campos inexistentes"""
    try:
        cursor = db.cursor()

        # Obter colunas existentes
        columns = safe_get_table_columns(db, "employees")

        if not columns:
            raise Exception("Não foi possível obter estrutura da tabela employees")

        # Campos básicos obrigatórios
        basic_fields = {
            "nome": employee_data.get('nome'),
            "email": employee_data.get('email'),
            "telefone": employee_data.get('telefone'),
            "cpf": employee_data.get('cpf'),
            "cargo": employee_data.get('cargo'),
            "status": employee_data.get('status', 'ATIVO')
        }

        # Campos que tentaremos incluir se existirem
        optional_fields = {
            "rg": employee_data.get('rg'),
            "data_nascimento": employee_data.get('data_nascimento'),
            "estado_civil": employee_data.get('estado_civil', 'SOLTEIRO'),
            "equipe": employee_data.get('equipe'),
            "nivel": employee_data.get('nivel', 'JUNIOR'),
            "data_admissao": employee_data.get('data_admissao'),
            "salario": employee_data.get('salario'),
            "avatar": employee_data.get('avatar'),
            "access_level": employee_data.get('access_level', 'COLABORADOR'),
            "manager_id": employee_data.get('manager_id'),
            "team_id": employee_data.get('team_id'),
            "area_id": employee_data.get('area_id'),
            "observacoes": employee_data.get('observacoes', ''),
            "notas_admin": employee_data.get('notas_admin', ''),
            "usuario_ultima_atualizacao": employee_data.get('updated_by', 'Sistema'),
            "aprovado_por": employee_data.get('aprovado_por'),
            "status_aprovacao": employee_data.get('status_aprovacao', 'APROVADO')
        }

        # Campos JSON especiais
        json_fields = {
            "endereco": employee_data.get('endereco', {}),
            "competencias": employee_data.get('competencias', []),
            "historico_alteracoes": employee_data.get('historico_alteracoes', [])
        }

        # Montar query dinamicamente com campos existentes
        set_clauses = []
        params = []
        ignored_fields = []

        # Adicionar campos básicos
        for field, value in basic_fields.items():
            if field in columns and value is not None:
                set_clauses.append(f"{field} = ?")
                params.append(value)
            elif field not in columns:
                ignored_fields.append(field)

        # Adicionar campos opcionais
        for field, value in optional_fields.items():
            if field in columns and value is not None:
                set_clauses.append(f"{field} = ?")
                params.append(value)
            elif field not in columns:
                ignored_fields.append(field)

        # Adicionar campos JSON
        for field, value in json_fields.items():
            if field in columns:
                set_clauses.append(f"{field} = ?")
                params.append(json.dumps(value, ensure_ascii=False))
            elif field not in columns:
                ignored_fields.append(field)

        # Adicionar timestamps se existirem
        if "data_ultima_atualizacao" in columns:
            set_clauses.append("data_ultima_atualizacao = datetime('now')")

        if "updated_at" in columns:
            set_clauses.append("updated_at = datetime('now')")

        # Executar update
        if set_clauses:
            query = f"UPDATE employees SET {', '.join(set_clauses)} WHERE id = ?"
            params.append(employee_id)

            cursor.execute(query, params)
            db.commit()

        # Log de campos ignorados
        if ignored_fields:
            log_system_error(db, "IGNORED_FIELDS", f"Campos ignorados na atualização do employee {employee_id}", {
                "employee_id": employee_id,
                "ignored_fields": ignored_fields,
                "existing_columns": columns,
                "total_ignored": len(ignored_fields)
            })

        return {
            "updated_fields": len(set_clauses),
            "ignored_fields": ignored_fields,
            "total_columns": len(columns),
            "success": True
        }

    except Exception as e:
        log_system_error(db, "UPDATE_ERROR", f"Erro ao atualizar employee {employee_id}: {str(e)}", {
            "employee_id": employee_id,
            "error": str(e),
            "traceback": traceback.format_exc()
        })
        return {
            "updated_fields": 0,
            "ignored_fields": [],
            "success": False,
            "error": str(e)
        }


# ============================================================================
# 📊 ENDPOINTS COM FALLBACK GRACIOSO
# ============================================================================

@router.get("/")
async def get_employees(
        status: Optional[str] = None,
        area_id: Optional[int] = None,
        team_id: Optional[int] = None,
        search: Optional[str] = None
):
    """Buscar funcionários com fallback gracioso para campos inexistentes"""
    try:
        logger.info(f"🔍 Buscando funcionários com fallback gracioso")

        db = get_db()
        cursor = db.cursor()

        # Verificar se tabela employees existe
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='employees'")
        if not cursor.fetchone():
            log_system_error(db, "MISSING_TABLE", "Tabela employees não encontrada")
            raise HTTPException(status_code=500, detail="Tabela employees não encontrada")

        # Obter colunas existentes
        columns = safe_get_table_columns(db, "employees")

        # Campos básicos que sempre tentamos buscar
        basic_columns = ["id", "nome", "email", "telefone", "cpf", "cargo", "status"]

        # Verificar quais campos básicos existem
        existing_basic = [col for col in basic_columns if col in columns]
        missing_basic = [col for col in basic_columns if col not in columns]

        if missing_basic:
            log_system_error(db, "MISSING_BASIC_COLUMNS", "Campos básicos faltando na tabela employees", {
                "missing": missing_basic,
                "existing": existing_basic
            })

        # Montar query com campos existentes
        select_fields = existing_basic.copy()

        # Adicionar campos opcionais se existirem
        optional_fields = ["data_nascimento", "nivel", "equipe", "manager_id", "team_id", "area_id",
                           "observacoes", "created_at", "updated_at"]

        for field in optional_fields:
            if field in columns:
                select_fields.append(field)

        query = f"SELECT {', '.join(select_fields)} FROM employees WHERE status != 'DELETED'"
        params = []

        # Aplicar filtros apenas se os campos existirem
        if status and "status" in columns:
            query += " AND status = ?"
            params.append(status)

        if area_id and "area_id" in columns:
            query += " AND area_id = ?"
            params.append(area_id)

        if team_id and "team_id" in columns:
            query += " AND team_id = ?"
            params.append(team_id)

        if search and "nome" in columns:
            query += " AND nome LIKE ?"
            params.append(f"%{search}%")

        query += " ORDER BY nome" if "nome" in columns else " ORDER BY id"

        cursor.execute(query, params)
        rows = cursor.fetchall()

        employees = []
        for row in rows:
            employee = dict(row)

            # Adicionar campos padrão para campos faltando
            if "observacoes" not in employee:
                employee["observacoes"] = ""

            if "nivel" not in employee:
                employee["nivel"] = "JUNIOR"

            # Processar campos JSON se existirem
            json_fields = ["endereco", "competencias", "ferias", "dayoff", "pdi", "reunioes_1x1"]
            for field in json_fields:
                if field in columns and employee.get(field):
                    try:
                        employee[field] = json.loads(employee[field])
                    except:
                        employee[field] = {} if field != "competencias" else []
                else:
                    employee[field] = {} if field != "competencias" else []

            employees.append(employee)

        cursor.close()
        db.close()

        logger.info(f"✅ Retornando {len(employees)} funcionários com fallback aplicado")
        return {
            "employees": employees,
            "total": len(employees),
            "sistema": {
                "campos_existentes": len(select_fields),
                "campos_basicos_faltando": missing_basic,
                "fallback_aplicado": len(missing_basic) > 0
            }
        }

    except Exception as e:
        logger.error(f"❌ Erro ao buscar funcionários: {e}")
        db = get_db()
        log_system_error(db, "GET_EMPLOYEES_ERROR", f"Erro ao buscar funcionários: {str(e)}", {
            "error": str(e),
            "traceback": traceback.format_exc()
        })
        db.close()
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")


@router.get("/{employee_id}")
async def get_employee(employee_id: int):
    """Buscar funcionário específico com fallback gracioso"""
    try:
        db = get_db()
        cursor = db.cursor()

        # Obter colunas existentes
        columns = safe_get_table_columns(db, "employees")

        # Montar query com campos existentes
        existing_fields = [col for col in columns if col in [
            "id", "nome", "email", "telefone", "cpf", "rg", "data_nascimento",
            "estado_civil", "cargo", "equipe", "nivel", "status", "data_admissao",
            "salario", "endereco", "competencias", "avatar", "access_level",
            "manager_id", "team_id", "area_id", "observacoes", "notas_admin",
            "created_at", "updated_at"
        ]]

        if not existing_fields:
            existing_fields = ["*"]  # Fallback para todas as colunas

        query = f"SELECT {', '.join(existing_fields)} FROM employees WHERE id = ? AND status != 'DELETED'"

        cursor.execute(query, (employee_id,))
        row = cursor.fetchone()

        if not row:
            raise HTTPException(status_code=404, detail="Funcionário não encontrado")

        employee = dict(row)

        # Adicionar campos padrão se não existirem
        default_fields = {
            "observacoes": "",
            "notas_admin": "",
            "nivel": "JUNIOR",
            "access_level": "COLABORADOR",
            "status": "ATIVO"
        }

        for field, default_value in default_fields.items():
            if field not in employee:
                employee[field] = default_value

        # Processar campos JSON
        json_fields = ["endereco", "competencias", "ferias", "dayoff", "pdi", "reunioes_1x1"]
        for field in json_fields:
            if field in employee and employee[field]:
                try:
                    employee[field] = json.loads(employee[field])
                except:
                    employee[field] = {} if field != "competencias" else []
            else:
                employee[field] = {} if field != "competencias" else []

        cursor.close()
        db.close()

        logger.info(f"✅ Funcionário {employee_id} retornado com fallback aplicado")
        return employee

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Erro ao buscar funcionário {employee_id}: {e}")
        db = get_db()
        log_system_error(db, "GET_EMPLOYEE_ERROR", f"Erro ao buscar funcionário {employee_id}: {str(e)}", {
            "employee_id": employee_id,
            "error": str(e),
            "traceback": traceback.format_exc()
        })
        db.close()
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")


@router.put("/{employee_id}")
async def update_employee(employee_id: int, employee_data: Dict[Any, Any], request: Request):
    """Atualizar funcionário com fallback gracioso e log detalhado"""
    try:
        logger.info(f"🔍 Atualizando funcionário {employee_id} com fallback gracioso")

        db = get_db()
        cursor = db.cursor()

        # Verificar se funcionário existe
        cursor.execute("SELECT id FROM employees WHERE id = ? AND status != 'DELETED'", (employee_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Funcionário não encontrado")

        # Usar função de update segura
        update_result = safe_update_employee(db, employee_id, employee_data)

        if not update_result["success"]:
            raise HTTPException(status_code=500, detail=f"Erro na atualização: {update_result.get('error')}")

        # Criar log de sucesso
        create_system_log_safe(
            db=db,
            employee_id=employee_id,
            action_type="UPDATE_SAFE",
            description=f"Funcionário atualizado com fallback: {update_result['updated_fields']} campos",
            user=employee_data.get('updated_by', 'Sistema'),
            metadata={
                "campos_atualizados": update_result['updated_fields'],
                "campos_ignorados": update_result['ignored_fields'],
                "fallback_aplicado": len(update_result['ignored_fields']) > 0,
                "ip_address": str(request.client.host) if request.client else None
            }
        )

        cursor.close()
        db.close()

        logger.info(f"✅ Funcionário {employee_id} atualizado com fallback: {update_result['updated_fields']} campos")

        return {
            "message": "Funcionário atualizado com sucesso (com fallback)",
            "employee_id": employee_id,
            "campos_atualizados": update_result['updated_fields'],
            "campos_ignorados": update_result['ignored_fields'],
            "fallback_aplicado": len(update_result['ignored_fields']) > 0,
            "success": True
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Erro ao atualizar funcionário {employee_id}: {e}")
        db = get_db()
        log_system_error(db, "UPDATE_EMPLOYEE_ERROR", f"Erro ao atualizar funcionário {employee_id}: {str(e)}", {
            "employee_id": employee_id,
            "error": str(e),
            "traceback": traceback.format_exc()
        })
        db.close()
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")


@router.get("/admin/system-health")
async def get_system_health():
    """Endpoint para admin verificar saúde do sistema e campos faltando"""
    try:
        db = get_db()
        cursor = db.cursor()

        # Verificar estrutura das tabelas principais
        tables_health = {}

        main_tables = ["employees", "areas", "teams", "managers", "knowledge", "system_logs"]

        for table in main_tables:
            cursor.execute(f"SELECT name FROM sqlite_master WHERE type='table' AND name='{table}'")
            exists = cursor.fetchone() is not None

            if exists:
                columns = safe_get_table_columns(db, table)
                tables_health[table] = {
                    "exists": True,
                    "columns": columns,
                    "column_count": len(columns)
                }
            else:
                tables_health[table] = {
                    "exists": False,
                    "columns": [],
                    "column_count": 0
                }

        # Buscar erros do sistema (últimos 50)
        system_errors = []
        if tables_health.get("system_logs", {}).get("exists"):
            try:
                cursor.execute("""
                               SELECT action_type, action_description, metadata, created_at
                               FROM system_logs
                               WHERE employee_id IS NULL AND action_type LIKE '%ERROR%'
                                  OR action_type LIKE '%MISSING%'
                                  OR action_type = 'IGNORED_FIELDS'
                               ORDER BY created_at DESC LIMIT 50
                               """)

                for row in cursor.fetchall():
                    error_data = dict(row)
                    if error_data.get("metadata"):
                        try:
                            error_data["metadata"] = json.loads(error_data["metadata"])
                        except:
                            pass
                    system_errors.append(error_data)
            except Exception as e:
                system_errors = [{"error": f"Não foi possível buscar logs: {str(e)}"}]

        cursor.close()
        db.close()

        # Análise de saúde geral
        health_score = 0
        total_checks = len(main_tables)

        for table_health in tables_health.values():
            if table_health["exists"]:
                health_score += 1

        health_percentage = (health_score / total_checks) * 100

        return {
            "health_score": health_percentage,
            "status": "HEALTHY" if health_percentage >= 80 else "DEGRADED" if health_percentage >= 60 else "CRITICAL",
            "tables": tables_health,
            "system_errors": system_errors,
            "recommendations": [
                "Execute migrations para criar tabelas faltando" if health_percentage < 100 else None,
                "Verifique logs de campos ignorados" if len(system_errors) > 0 else None,
                "Sistema funcionando com fallback gracioso" if health_percentage >= 60 else "Atenção: funcionalidades limitadas"
            ],
            "timestamp": datetime.now().isoformat()
        }

    except Exception as e:
        logger.error(f"❌ Erro ao verificar saúde do sistema: {e}")
        return {
            "health_score": 0,
            "status": "ERROR",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }
