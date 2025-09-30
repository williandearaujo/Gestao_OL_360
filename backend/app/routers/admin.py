from fastapi import APIRouter, HTTPException, Request, Depends
import sqlite3
import json
import logging
from datetime import datetime
from typing import List, Optional, Dict, Any
from app.utils.admin_utils import (
    get_system_logs, get_log_stats, backup_database,
    get_dashboard_data, get_all_users, create_user
)
from app.utils.auth import require_admin

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/admin",
    tags=["admin"]
)


def get_db():
    """Retorna conexão com banco gestao360.db com row_factory"""
    conn = sqlite3.connect("gestao360.db")
    conn.row_factory = sqlite3.Row
    return conn


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


@router.get("/logs")
async def get_logs(
        limit: int = 100,
        level: str = None,
        current_user: Dict[str, Any] = Depends(require_admin)
):
    """Obter logs do sistema"""
    logs = get_system_logs(limit, level)
    stats = get_log_stats()

    return {
        "logs": logs,
        "stats": stats,
        "total_returned": len(logs)
    }


@router.post("/backup")
async def create_backup(
        backup_name: str = None,
        current_user: Dict[str, Any] = Depends(require_admin)
):
    """Criar backup do banco"""
    result = backup_database(backup_name)
    return result


@router.get("/dashboard")
async def get_admin_dashboard(current_user: Dict[str, Any] = Depends(require_admin)):
    """Obter dados do dashboard administrativo"""
    return get_dashboard_data()


@router.get("/users")
async def list_users(current_user: Dict[str, Any] = Depends(require_admin)):
    """Listar todos os usuários"""
    return get_all_users()


@router.post("/users")
async def create_new_user(
        user_data: Dict[str, Any],
        current_user: Dict[str, Any] = Depends(require_admin)
):
    """Criar novo usuário"""
    return create_user(user_data)

@router.get("/stats")
async def get_admin_stats():
    """Obter estatísticas administrativas com fallback gracioso"""
    try:
        logger.info("🔍 Obtendo estatísticas administrativas com fallback")

        db = get_db()
        cursor = db.cursor()

        stats = {
            "employees": {"total": 0, "active": 0, "inactive": 0},
            "teams": {"total": 0, "active": 0, "inactive": 0},
            "areas": {"total": 0, "active": 0, "inactive": 0},
            "managers": {"total": 0},
            "knowledge": {"total": 0},
            "employee_knowledge": {"total": 0, "desejado": 0, "obrigatorio": 0, "obtido": 0},
            "summary": {
                "total_records": 0,
                "completion_rate": 0,
                "system_health": "healthy",
                "last_updated": datetime.now().isoformat()
            }
        }

        # EMPLOYEES
        try:
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='employees'")
            if cursor.fetchone():
                cursor.execute("SELECT COUNT(*) as total FROM employees")
                result = cursor.fetchone()
                stats["employees"]["total"] = result[0] if result else 0

                # Verificar se campo status existe
                columns = safe_get_table_columns(db, "employees")
                if "status" in columns:
                    cursor.execute("SELECT COUNT(*) as active FROM employees WHERE status = 'ATIVO'")
                    result = cursor.fetchone()
                    stats["employees"]["active"] = result[0] if result else 0

                    cursor.execute("SELECT COUNT(*) as inactive FROM employees WHERE status = 'INATIVO'")
                    result = cursor.fetchone()
                    stats["employees"]["inactive"] = result[0] if result else 0
        except Exception as e:
            logger.warning(f"⚠️ Erro employees stats: {e}")

        # TEAMS
        try:
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='teams'")
            if cursor.fetchone():
                cursor.execute("SELECT COUNT(*) as total FROM teams")
                result = cursor.fetchone()
                stats["teams"]["total"] = result[0] if result else 0

                # Verificar se campo ativo existe
                columns = safe_get_table_columns(db, "teams")
                if "ativo" in columns:
                    cursor.execute("SELECT COUNT(*) as active FROM teams WHERE ativo = 1")
                    result = cursor.fetchone()
                    stats["teams"]["active"] = result[0] if result else 0

                    cursor.execute("SELECT COUNT(*) as inactive FROM teams WHERE ativo = 0")
                    result = cursor.fetchone()
                    stats["teams"]["inactive"] = result[0] if result else 0
        except Exception as e:
            logger.warning(f"⚠️ Erro teams stats: {e}")

        # AREAS
        try:
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='areas'")
            if cursor.fetchone():
                cursor.execute("SELECT COUNT(*) as total FROM areas")
                result = cursor.fetchone()
                stats["areas"]["total"] = result[0] if result else 0

                # Verificar se campo ativa existe
                columns = safe_get_table_columns(db, "areas")
                if "ativa" in columns:
                    cursor.execute("SELECT COUNT(*) as active FROM areas WHERE ativa = 1")
                    result = cursor.fetchone()
                    stats["areas"]["active"] = result[0] if result else 0

                    cursor.execute("SELECT COUNT(*) as inactive FROM areas WHERE ativa = 0")
                    result = cursor.fetchone()
                    stats["areas"]["inactive"] = result[0] if result else 0
        except Exception as e:
            logger.warning(f"⚠️ Erro areas stats: {e}")

        # MANAGERS
        try:
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='managers'")
            if cursor.fetchone():
                columns = safe_get_table_columns(db, "managers")
                where_clause = "WHERE ativo = 1" if "ativo" in columns else ""
                cursor.execute(f"SELECT COUNT(*) as total FROM managers {where_clause}")
                result = cursor.fetchone()
                stats["managers"]["total"] = result[0] if result else 0
        except Exception as e:
            logger.warning(f"⚠️ Erro managers stats: {e}")

        # KNOWLEDGE
        try:
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='knowledge'")
            if cursor.fetchone():
                cursor.execute("SELECT COUNT(*) as total FROM knowledge")
                result = cursor.fetchone()
                stats["knowledge"]["total"] = result[0] if result else 0
        except Exception as e:
            logger.warning(f"⚠️ Erro knowledge stats: {e}")

        # EMPLOYEE_KNOWLEDGE
        try:
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='employee_knowledge'")
            if cursor.fetchone():
                cursor.execute("SELECT COUNT(*) as total FROM employee_knowledge")
                result = cursor.fetchone()
                stats["employee_knowledge"]["total"] = result[0] if result else 0

                # Verificar se campo status existe
                columns = safe_get_table_columns(db, "employee_knowledge")
                if "status" in columns:
                    cursor.execute("SELECT COUNT(*) as desejado FROM employee_knowledge WHERE status = 'DESEJADO'")
                    result = cursor.fetchone()
                    stats["employee_knowledge"]["desejado"] = result[0] if result else 0

                    cursor.execute(
                        "SELECT COUNT(*) as obrigatorio FROM employee_knowledge WHERE status = 'OBRIGATORIO'")
                    result = cursor.fetchone()
                    stats["employee_knowledge"]["obrigatorio"] = result[0] if result else 0

                    cursor.execute("SELECT COUNT(*) as obtido FROM employee_knowledge WHERE status = 'OBTIDO'")
                    result = cursor.fetchone()
                    stats["employee_knowledge"]["obtido"] = result[0] if result else 0
        except Exception as e:
            logger.warning(f"⚠️ Erro employee_knowledge stats: {e}")

        # SUMMARY
        total_records = (
                stats["employees"]["total"] +
                stats["teams"]["total"] +
                stats["areas"]["total"] +
                stats["managers"]["total"] +
                stats["knowledge"]["total"] +
                stats["employee_knowledge"]["total"]
        )

        stats["summary"]["total_records"] = total_records

        if stats["employee_knowledge"]["total"] > 0:
            completion_rate = (stats["employee_knowledge"]["obtido"] / stats["employee_knowledge"]["total"]) * 100
            stats["summary"]["completion_rate"] = round(completion_rate, 2)

        cursor.close()
        db.close()

        logger.info("✅ Estatísticas obtidas com sucesso")
        return stats

    except Exception as e:
        logger.error(f"❌ Erro ao obter estatísticas: {e}")
        return {
            "error": str(e),
            "employees": {"total": 0, "active": 0, "inactive": 0},
            "teams": {"total": 0, "active": 0, "inactive": 0},
            "areas": {"total": 0, "active": 0, "inactive": 0},
            "managers": {"total": 0},
            "knowledge": {"total": 0},
            "employee_knowledge": {"total": 0, "desejado": 0, "obrigatorio": 0, "obtido": 0},
            "summary": {
                "total_records": 0,
                "completion_rate": 0,
                "system_health": "error",
                "last_updated": datetime.now().isoformat()
            }
        }


@router.get("/health")
async def get_admin_health():
    """Verificar saúde do sistema com fallback gracioso"""
    try:
        db = get_db()
        cursor = db.cursor()

        # Testar conexão com banco
        cursor.execute("SELECT 1")
        cursor.fetchone()

        # Verificar se principais tabelas existem
        tables_check = {
            "employees": False,
            "areas": False,
            "teams": False,
            "managers": False,
            "knowledge": False,
            "employee_knowledge": False
        }

        for table in tables_check.keys():
            try:
                cursor.execute(f"SELECT name FROM sqlite_master WHERE type='table' AND name='{table}'")
                tables_check[table] = cursor.fetchone() is not None
            except:
                pass

        all_tables_exist = all(tables_check.values())

        cursor.close()
        db.close()

        return {
            "status": "online" if all_tables_exist else "partial",
            "database": "connected" if all_tables_exist else "issues",
            "tables": tables_check,
            "last_check": datetime.now().isoformat(),
            "version": "2.0.0"
        }

    except Exception as e:
        logger.error(f"❌ Erro no health check: {e}")
        return {
            "status": "offline",
            "database": "disconnected",
            "error": str(e),
            "last_check": datetime.now().isoformat(),
            "version": "2.0.0"
        }


@router.get("/dashboard-data")
async def get_dashboard_data(limit: int = 5):
    """Obter dados para dashboard administrativo"""
    try:
        db = get_db()
        cursor = db.cursor()

        dashboard = {
            "recent_employees": [],
            "recent_teams": [],
            "recent_areas": [],
            "recent_knowledge": [],
            "success": True
        }

        # RECENT EMPLOYEES
        try:
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='employees'")
            if cursor.fetchone():
                columns = safe_get_table_columns(db, "employees")

                # Campos disponíveis
                available_fields = [col for col in columns if
                                    col in ["id", "nome", "email", "cargo", "status", "created_at"]]

                if available_fields:
                    query = f"SELECT {', '.join(available_fields)} FROM employees"
                    if "created_at" in columns:
                        query += " ORDER BY created_at DESC"
                    query += f" LIMIT {limit}"

                    cursor.execute(query)
                    employees = cursor.fetchall()

                    dashboard["recent_employees"] = [
                        {
                            "id": emp[0] if len(emp) > 0 else None,
                            "nome": emp[1] if len(emp) > 1 else "N/A",
                            "email": emp[2] if len(emp) > 2 else "N/A",
                            "cargo": emp[3] if len(emp) > 3 else "N/A",
                            "status": emp[4] if len(emp) > 4 else "ATIVO",
                            "created_at": str(emp[5]) if len(emp) > 5 and emp[5] else None
                        }
                        for emp in employees
                    ]
        except Exception as e:
            logger.warning(f"⚠️ Erro recent employees: {e}")

        # RECENT TEAMS
        try:
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='teams'")
            if cursor.fetchone():
                columns = safe_get_table_columns(db, "teams")

                # Campos disponíveis
                available_fields = [col for col in columns if
                                    col in ["id", "nome", "descricao", "area_id", "ativo", "created_at"]]

                if available_fields:
                    query = f"SELECT {', '.join(available_fields)} FROM teams"
                    if "created_at" in columns:
                        query += " ORDER BY created_at DESC"
                    query += f" LIMIT {limit}"

                    cursor.execute(query)
                    teams = cursor.fetchall()

                    dashboard["recent_teams"] = [dict(zip(available_fields, team)) for team in teams]
        except Exception as e:
            logger.warning(f"⚠️ Erro recent teams: {e}")

        # RECENT AREAS
        try:
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='areas'")
            if cursor.fetchone():
                columns = safe_get_table_columns(db, "areas")

                # Campos disponíveis
                available_fields = [col for col in columns if
                                    col in ["id", "nome", "sigla", "descricao", "ativa", "created_at"]]

                if available_fields:
                    query = f"SELECT {', '.join(available_fields)} FROM areas"
                    if "created_at" in columns:
                        query += " ORDER BY created_at DESC"
                    query += f" LIMIT {limit}"

                    cursor.execute(query)
                    areas = cursor.fetchall()

                    dashboard["recent_areas"] = [dict(zip(available_fields, area)) for area in areas]
        except Exception as e:
            logger.warning(f"⚠️ Erro recent areas: {e}")

        # RECENT KNOWLEDGE
        try:
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='knowledge'")
            if cursor.fetchone():
                columns = safe_get_table_columns(db, "knowledge")

                # Campos disponíveis
                available_fields = [col for col in columns if
                                    col in ["id", "nome", "tipo", "categoria", "fornecedor", "created_at"]]

                if available_fields:
                    query = f"SELECT {', '.join(available_fields)} FROM knowledge"
                    if "created_at" in columns:
                        query += " ORDER BY created_at DESC"
                    query += f" LIMIT {limit}"

                    cursor.execute(query)
                    knowledge = cursor.fetchall()

                    dashboard["recent_knowledge"] = [dict(zip(available_fields, k)) for k in knowledge]
        except Exception as e:
            logger.warning(f"⚠️ Erro recent knowledge: {e}")

        cursor.close()
        db.close()

        return dashboard

    except Exception as e:
        logger.error(f"❌ Erro ao obter dados do dashboard: {e}")
        return {
            "error": str(e),
            "success": False
        }


@router.get("/system-info")
async def get_system_info():
    """Obter informações do sistema"""
    try:
        db = get_db()
        cursor = db.cursor()

        # Verificar versão SQLite
        cursor.execute("SELECT sqlite_version()")
        sqlite_version = cursor.fetchone()[0]

        # Contar tabelas
        cursor.execute("SELECT COUNT(*) as count FROM sqlite_master WHERE type ='table' AND name NOT LIKE 'sqlite_%'")
        tables_count = cursor.fetchone()[0]

        # Listar tabelas
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name")
        table_names = [row[0] for row in cursor.fetchall()]

        cursor.close()
        db.close()

        return {
            "database": {
                "type": "SQLite",
                "version": sqlite_version,
                "tables": tables_count,
                "table_names": table_names
            },
            "api": {
                "version": "2.0.0",
                "status": "running",
                "fallback_enabled": True
            },
            "timestamp": datetime.now().isoformat()
        }

    except Exception as e:
        logger.error(f"❌ Erro ao obter info do sistema: {e}")
        return {"error": str(e)}
