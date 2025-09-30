from fastapi import APIRouter, HTTPException, Request
import sqlite3
import json
import logging
from datetime import datetime
from typing import List, Optional, Dict, Any

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/managers",
    tags=["managers"]
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


@router.get("/")
async def get_managers():
    """Listar todos os gerentes com fallback gracioso"""
    try:
        logger.info("🔍 Buscando gerentes com fallback gracioso")

        db = get_db()
        cursor = db.cursor()

        # Verificar se tabela managers existe
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='managers'")
        if not cursor.fetchone():
            logger.warning("⚠️ Tabela managers não existe")
            return {
                "error": "Tabela managers não existe. Execute a migration primeiro.",
                "success": False,
                "managers": []
            }

        # Obter colunas existentes
        columns = safe_get_table_columns(db, "managers")

        # Campos básicos obrigatórios
        basic_columns = ["id", "nome", "email", "cargo"]
        existing_basic = [col for col in basic_columns if col in columns]

        # Campos opcionais
        optional_fields = ["telefone", "nivel_hierarquico", "departamento", "area_id", "user_id", "ativo",
                           "observacoes", "created_at", "updated_at"]
        for field in optional_fields:
            if field in columns:
                existing_basic.append(field)

        # Filtrar apenas ativos se campo exists
        where_clause = "WHERE ativo = 1" if "ativo" in columns else ""
        query = f"SELECT {', '.join(existing_basic)} FROM managers {where_clause} ORDER BY nome"

        cursor.execute(query)
        rows = cursor.fetchall()

        managers = []
        for row in rows:
            manager = dict(row)

            # Adicionar campos padrão se não existirem
            defaults = {
                "ativo": True,
                "nivel_hierarquico": "GERENTE",
                "observacoes": "",
                "telefone": ""
            }

            for field, default_value in defaults.items():
                if field not in manager:
                    manager[field] = default_value

            managers.append(manager)

        cursor.close()
        db.close()

        logger.info(f"✅ Retornando {len(managers)} gerentes")
        return managers

    except Exception as e:
        logger.error(f"❌ Erro ao buscar gerentes: {e}")
        return {
            "error": str(e),
            "success": False,
            "managers": []
        }


@router.get("/{manager_id}")
async def get_manager(manager_id: int):
    """Buscar gerente por ID com fallback gracioso"""
    try:
        db = get_db()
        cursor = db.cursor()

        # Verificar se tabela existe
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='managers'")
        if not cursor.fetchone():
            raise HTTPException(status_code=500, detail="Tabela managers não existe")

        # Obter colunas existentes
        columns = safe_get_table_columns(db, "managers")

        # Campos disponíveis
        available_fields = [col for col in columns if col in [
            "id", "nome", "email", "telefone", "cargo", "nivel_hierarquico",
            "departamento", "area_id", "user_id", "ativo", "observacoes",
            "created_at", "updated_at"
        ]]

        if not available_fields:
            available_fields = ["*"]

        query = f"SELECT {', '.join(available_fields)} FROM managers WHERE id = ?"
        cursor.execute(query, (manager_id,))
        row = cursor.fetchone()

        if not row:
            raise HTTPException(status_code=404, detail="Gerente não encontrado")

        manager = dict(row)

        # Campos padrão
        defaults = {
            "ativo": True,
            "nivel_hierarquico": "GERENTE",
            "observacoes": "",
            "telefone": "",
            "departamento": ""
        }

        for field, default_value in defaults.items():
            if field not in manager:
                manager[field] = default_value

        cursor.close()
        db.close()

        return manager

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Erro ao buscar gerente {manager_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")


@router.post("/")
async def create_manager(manager_data: Dict[Any, Any]):
    """Criar novo gerente com fallback gracioso"""
    try:
        # Validações básicas
        required_fields = ["nome", "email", "cargo"]
        for field in required_fields:
            if not manager_data.get(field):
                raise HTTPException(status_code=400, detail=f"{field} é obrigatório")

        db = get_db()
        cursor = db.cursor()

        # Verificar se tabela existe
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='managers'")
        if not cursor.fetchone():
            raise HTTPException(status_code=500, detail="Tabela managers não existe")

        # Verificar se email já existe
        cursor.execute("SELECT id FROM managers WHERE email = ?", (manager_data.get("email"),))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Email já cadastrado")

        # Obter colunas existentes
        columns = safe_get_table_columns(db, "managers")

        # Preparar dados
        fields = []
        values = []
        params = []

        # Campos obrigatórios
        required_data = {
            "nome": manager_data.get("nome"),
            "email": manager_data.get("email"),
            "cargo": manager_data.get("cargo")
        }

        for field, value in required_data.items():
            if field in columns:
                fields.append(field)
                values.append("?")
                params.append(value)

        # Campos opcionais
        optional_data = {
            "telefone": manager_data.get("telefone"),
            "nivel_hierarquico": manager_data.get("nivel_hierarquico", "GERENTE"),
            "departamento": manager_data.get("departamento"),
            "area_id": manager_data.get("area_id"),
            "user_id": manager_data.get("user_id"),
            "ativo": manager_data.get("ativo", True),
            "observacoes": manager_data.get("observacoes", "")
        }

        for field, value in optional_data.items():
            if field in columns and value is not None:
                fields.append(field)
                values.append("?")
                params.append(value)

        # Timestamps
        current_time = datetime.now().isoformat()
        if "created_at" in columns:
            fields.append("created_at")
            values.append("?")
            params.append(current_time)

        if "updated_at" in columns:
            fields.append("updated_at")
            values.append("?")
            params.append(current_time)

        # Executar insert
        query = f"INSERT INTO managers ({', '.join(fields)}) VALUES ({', '.join(values)})"
        cursor.execute(query, params)
        db.commit()

        manager_id = cursor.lastrowid

        cursor.close()
        db.close()

        logger.info(f"✅ Gerente '{manager_data.get('nome')}' criado com ID {manager_id}")
        return {
            "message": "Gerente criado com sucesso",
            "manager_id": manager_id,
            "success": True
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Erro ao criar gerente: {e}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")


@router.put("/{manager_id}")
async def update_manager(manager_id: int, manager_data: Dict[Any, Any]):
    """Atualizar gerente com fallback gracioso"""
    try:
        db = get_db()
        cursor = db.cursor()

        # Verificar se gerente existe
        cursor.execute("SELECT id FROM managers WHERE id = ?", (manager_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Gerente não encontrado")

        # Se está alterando email, verificar se não já existe
        new_email = manager_data.get("email")
        if new_email:
            cursor.execute("SELECT id FROM managers WHERE email = ? AND id != ?", (new_email, manager_id))
            if cursor.fetchone():
                raise HTTPException(status_code=400, detail="Email já está em uso por outro gerente")

        # Obter colunas existentes
        columns = safe_get_table_columns(db, "managers")

        # Preparar campos para atualizar
        set_clauses = []
        params = []

        updatable_fields = {
            "nome": manager_data.get("nome"),
            "email": manager_data.get("email"),
            "telefone": manager_data.get("telefone"),
            "cargo": manager_data.get("cargo"),
            "nivel_hierarquico": manager_data.get("nivel_hierarquico"),
            "departamento": manager_data.get("departamento"),
            "area_id": manager_data.get("area_id"),
            "user_id": manager_data.get("user_id"),
            "ativo": manager_data.get("ativo"),
            "observacoes": manager_data.get("observacoes")
        }

        for field, value in updatable_fields.items():
            if field in columns and value is not None:
                set_clauses.append(f"{field} = ?")
                params.append(value)

        # Timestamp de atualização
        if "updated_at" in columns:
            set_clauses.append("updated_at = ?")
            params.append(datetime.now().isoformat())

        if not set_clauses:
            return {
                "message": "Nenhum campo para atualizar",
                "success": True
            }

        # Executar update
        params.append(manager_id)
        query = f"UPDATE managers SET {', '.join(set_clauses)} WHERE id = ?"
        result = cursor.execute(query, params)

        if result.rowcount == 0:
            raise HTTPException(status_code=404, detail="Gerente não encontrado")

        db.commit()
        cursor.close()
        db.close()

        logger.info(f"✅ Gerente {manager_id} atualizado com sucesso")
        return {
            "message": "Gerente atualizado com sucesso",
            "success": True
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Erro ao atualizar gerente {manager_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")


@router.delete("/{manager_id}")
async def delete_manager(manager_id: int):
    """Deletar gerente com fallback gracioso"""
    try:
        db = get_db()
        cursor = db.cursor()

        # Verificar se gerente existe
        cursor.execute("SELECT nome FROM managers WHERE id = ?", (manager_id,))
        manager_row = cursor.fetchone()

        if not manager_row:
            raise HTTPException(status_code=404, detail="Gerente não encontrado")

        manager_name = manager_row[0] if manager_row else "Desconhecido"

        # Executar delete
        cursor.execute("DELETE FROM managers WHERE id = ?", (manager_id,))

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Gerente não encontrado")

        db.commit()
        cursor.close()
        db.close()

        logger.info(f"✅ Gerente '{manager_name}' (ID {manager_id}) deletado com sucesso")
        return {
            "message": f"Gerente '{manager_name}' deletado com sucesso",
            "success": True
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Erro ao deletar gerente {manager_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")


# ============================================================================
# 🔗 ENDPOINTS ESPECIAIS
# ============================================================================

@router.get("/area/{area_id}")
async def get_managers_by_area(area_id: int):
    """Buscar gerentes por área"""
    try:
        db = get_db()
        cursor = db.cursor()

        columns = safe_get_table_columns(db, "managers")

        if "area_id" not in columns:
            return []  # Se não tem campo area_id, retorna vazio

        # Campos disponíveis
        available_fields = [col for col in columns if col in [
            "id", "nome", "email", "cargo", "nivel_hierarquico", "ativo"
        ]]

        where_clause = "WHERE area_id = ?"
        if "ativo" in columns:
            where_clause += " AND ativo = 1"

        query = f"SELECT {', '.join(available_fields)} FROM managers {where_clause} ORDER BY nome"
        cursor.execute(query, (area_id,))
        rows = cursor.fetchall()

        managers = [dict(row) for row in rows]

        cursor.close()
        db.close()

        return managers

    except Exception as e:
        logger.error(f"❌ Erro ao buscar gerentes da área {area_id}: {e}")
        return []


@router.patch("/{manager_id}/toggle-active")
async def toggle_manager_active(manager_id: int):
    """Alternar status ativo/inativo do gerente"""
    try:
        db = get_db()
        cursor = db.cursor()

        columns = safe_get_table_columns(db, "managers")

        if "ativo" not in columns:
            raise HTTPException(status_code=400, detail="Campo 'ativo' não existe na tabela")

        # Obter status atual
        cursor.execute("SELECT ativo, nome FROM managers WHERE id = ?", (manager_id,))
        row = cursor.fetchone()

        if not row:
            raise HTTPException(status_code=404, detail="Gerente não encontrado")

        # Alternar status
        current_status = bool(row[0])
        new_status = not current_status
        manager_name = row[1]

        cursor.execute("UPDATE managers SET ativo = ? WHERE id = ?", (new_status, manager_id))

        # Timestamp de atualização
        if "updated_at" in columns:
            cursor.execute("UPDATE managers SET updated_at = ? WHERE id = ?",
                           (datetime.now().isoformat(), manager_id))

        db.commit()
        cursor.close()
        db.close()

        status_text = "ativado" if new_status else "desativado"
        logger.info(f"✅ Gerente '{manager_name}' {status_text}")

        return {
            "message": f"Gerente '{manager_name}' {status_text} com sucesso",
            "ativo": new_status,
            "success": True
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Erro ao alternar status do gerente {manager_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")


@router.get("/{manager_id}/team")
async def get_manager_team(manager_id: int):
    """Obter equipe gerenciada por um gerente"""
    try:
        db = get_db()
        cursor = db.cursor()

        # Verificar se tabela teams existe e tem campo manager_id
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='teams'")
        if not cursor.fetchone():
            return []

        team_columns = safe_get_table_columns(db, "teams")
        if "manager_id" not in team_columns:
            return []

        # Buscar equipes do gerente
        available_fields = [col for col in team_columns if col in [
            "id", "nome", "descricao", "cor", "area_id", "ativo"
        ]]

        query = f"SELECT {', '.join(available_fields)} FROM teams WHERE manager_id = ?"
        cursor.execute(query, (manager_id,))
        rows = cursor.fetchall()

        teams = [dict(row) for row in rows]

        cursor.close()
        db.close()

        return teams

    except Exception as e:
        logger.error(f"❌ Erro ao buscar equipe do gerente {manager_id}: {e}")
        return []


@router.get("/{manager_id}/employees")
async def get_manager_employees(manager_id: int):
    """Obter funcionários gerenciados por um gerente"""
    try:
        db = get_db()
        cursor = db.cursor()

        # Verificar se tabela employees existe e tem campo manager_id
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='employees'")
        if not cursor.fetchone():
            return []

        emp_columns = safe_get_table_columns(db, "employees")
        if "manager_id" not in emp_columns:
            return []

        # Buscar funcionários do gerente
        available_fields = [col for col in emp_columns if col in [
            "id", "nome", "email", "cargo", "status", "equipe"
        ]]

        query = f"SELECT {', '.join(available_fields)} FROM employees WHERE manager_id = ?"
        cursor.execute(query, (manager_id,))
        rows = cursor.fetchall()

        employees = [dict(row) for row in rows]

        cursor.close()
        db.close()

        return employees

    except Exception as e:
        logger.error(f"❌ Erro ao buscar funcionários do gerente {manager_id}: {e}")
        return []


@router.get("/stats/summary")
async def get_managers_stats():
    """Obter estatísticas dos gerentes"""
    try:
        db = get_db()
        cursor = db.cursor()

        # Verificar se tabela existe
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='managers'")
        if not cursor.fetchone():
            return {
                "total": 0,
                "active": 0,
                "inactive": 0,
                "by_level": [],
                "by_area": []
            }

        columns = safe_get_table_columns(db, "managers")

        stats = {
            "total": 0,
            "active": 0,
            "inactive": 0,
            "by_level": [],
            "by_area": []
        }

        # Total
        where_clause = "WHERE ativo = 1" if "ativo" in columns else ""
        query = f"SELECT COUNT(*) FROM managers {where_clause}"
        cursor.execute(query)
        stats["total"] = cursor.fetchone()[0]

        # Por status (se campo existir)
        if "ativo" in columns:
            cursor.execute("SELECT COUNT(*) FROM managers WHERE ativo = 1")
            stats["active"] = cursor.fetchone()[0]

            cursor.execute("SELECT COUNT(*) FROM managers WHERE ativo = 0")
            stats["inactive"] = cursor.fetchone()[0]

        # Por nível hierárquico (se campo existir)
        if "nivel_hierarquico" in columns:
            cursor.execute("""
                           SELECT nivel_hierarquico, COUNT(*) as count
                           FROM managers
                           WHERE nivel_hierarquico IS NOT NULL
                           GROUP BY nivel_hierarquico
                           ORDER BY count DESC
                           """)

            stats["by_level"] = [
                {"nivel": row[0], "count": row[1]}
                for row in cursor.fetchall()
            ]

        # Por área (se campo existir)
        if "area_id" in columns:
            cursor.execute("""
                           SELECT area_id, COUNT(*) as count
                           FROM managers
                           WHERE area_id IS NOT NULL
                           GROUP BY area_id
                           ORDER BY count DESC
                           """)

            stats["by_area"] = [
                {"area_id": row[0], "count": row[1]}
                for row in cursor.fetchall()
            ]

        cursor.close()
        db.close()

        return stats

    except Exception as e:
        logger.error(f"❌ Erro ao obter estatísticas dos gerentes: {e}")
        return {
            "total": 0,
            "active": 0,
            "inactive": 0,
            "by_level": [],
            "by_area": [],
            "error": str(e)
        }
