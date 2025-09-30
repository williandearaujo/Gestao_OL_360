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
    prefix="/areas",
    tags=["areas"]
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
async def get_areas():
    """Listar todas as áreas com fallback gracioso"""
    try:
        logger.info("🔍 Buscando áreas com fallback gracioso")

        db = get_db()
        cursor = db.cursor()

        # Verificar se tabela areas existe
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='areas'")
        if not cursor.fetchone():
            logger.warning("⚠️ Tabela areas não existe")
            return {
                "error": "Tabela areas não existe. Execute a migration primeiro.",
                "success": False,
                "areas": []
            }

        # Obter colunas existentes
        columns = safe_get_table_columns(db, "areas")

        # Campos básicos obrigatórios
        basic_columns = ["id", "nome", "sigla"]
        existing_basic = [col for col in basic_columns if col in columns]

        # Campos opcionais
        optional_fields = ["descricao", "cor", "icone", "diretor_id", "ativa", "prioridade", "created_at", "updated_at"]
        for field in optional_fields:
            if field in columns:
                existing_basic.append(field)

        query = f"SELECT {', '.join(existing_basic)} FROM areas ORDER BY nome"
        cursor.execute(query)
        rows = cursor.fetchall()

        areas = []
        for row in rows:
            area = dict(row)

            # Adicionar campos padrão se não existirem
            defaults = {
                "cor": "#3B82F6",
                "ativa": True,
                "descricao": "",
                "prioridade": 1,
                "icone": "building"
            }

            for field, default_value in defaults.items():
                if field not in area:
                    area[field] = default_value

            areas.append(area)

        cursor.close()
        db.close()

        logger.info(f"✅ Retornando {len(areas)} áreas")
        return areas

    except Exception as e:
        logger.error(f"❌ Erro ao buscar áreas: {e}")
        return {
            "error": str(e),
            "success": False,
            "areas": []
        }


@router.get("/{area_id}")
async def get_area(area_id: int):
    """Buscar área por ID com fallback gracioso"""
    try:
        db = get_db()
        cursor = db.cursor()

        # Verificar se tabela existe
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='areas'")
        if not cursor.fetchone():
            raise HTTPException(status_code=500, detail="Tabela areas não existe")

        # Obter colunas existentes
        columns = safe_get_table_columns(db, "areas")

        # Campos disponíveis
        available_fields = [col for col in columns if col in [
            "id", "nome", "sigla", "descricao", "cor", "icone", "diretor_id",
            "ativa", "prioridade", "created_at", "updated_at"
        ]]

        if not available_fields:
            available_fields = ["*"]

        query = f"SELECT {', '.join(available_fields)} FROM areas WHERE id = ?"
        cursor.execute(query, (area_id,))
        row = cursor.fetchone()

        if not row:
            raise HTTPException(status_code=404, detail="Área não encontrada")

        area = dict(row)

        # Campos padrão
        defaults = {
            "cor": "#3B82F6",
            "ativa": True,
            "descricao": "",
            "prioridade": 1,
            "icone": "building"
        }

        for field, default_value in defaults.items():
            if field not in area:
                area[field] = default_value

        cursor.close()
        db.close()

        return area

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Erro ao buscar área {area_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")


@router.post("/")
async def create_area(area_data: Dict[Any, Any]):
    """Criar nova área com fallback gracioso"""
    try:
        # Validações básicas
        required_fields = ["nome", "sigla"]
        for field in required_fields:
            if not area_data.get(field):
                raise HTTPException(status_code=400, detail=f"{field} é obrigatório")

        db = get_db()
        cursor = db.cursor()

        # Verificar se tabela existe
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='areas'")
        if not cursor.fetchone():
            raise HTTPException(status_code=500, detail="Tabela areas não existe")

        # Verificar se sigla já existe
        cursor.execute("SELECT id FROM areas WHERE sigla = ?", (area_data.get("sigla"),))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Sigla já está em uso")

        # Obter colunas existentes
        columns = safe_get_table_columns(db, "areas")

        # Preparar dados
        fields = []
        values = []
        params = []

        # Campos obrigatórios
        required_data = {
            "nome": area_data.get("nome"),
            "sigla": area_data.get("sigla").upper()  # Sigla sempre maiúscula
        }

        for field, value in required_data.items():
            if field in columns:
                fields.append(field)
                values.append("?")
                params.append(value)

        # Campos opcionais
        optional_data = {
            "descricao": area_data.get("descricao", ""),
            "cor": area_data.get("cor", "#3B82F6"),
            "icone": area_data.get("icone", "building"),
            "diretor_id": area_data.get("diretor_id"),
            "ativa": area_data.get("ativa", True),
            "prioridade": area_data.get("prioridade", 1)
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
        query = f"INSERT INTO areas ({', '.join(fields)}) VALUES ({', '.join(values)})"
        cursor.execute(query, params)
        db.commit()

        area_id = cursor.lastrowid

        cursor.close()
        db.close()

        logger.info(f"✅ Área '{area_data.get('nome')}' ({area_data.get('sigla')}) criada com ID {area_id}")
        return {
            "message": "Área criada com sucesso",
            "area_id": area_id,
            "success": True
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Erro ao criar área: {e}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")


@router.put("/{area_id}")
async def update_area(area_id: int, area_data: Dict[Any, Any]):
    """Atualizar área com fallback gracioso"""
    try:
        db = get_db()
        cursor = db.cursor()

        # Verificar se área existe
        cursor.execute("SELECT id FROM areas WHERE id = ?", (area_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Área não encontrada")

        # Se está alterando sigla, verificar se não já existe
        new_sigla = area_data.get("sigla")
        if new_sigla:
            new_sigla = new_sigla.upper()  # Sigla sempre maiúscula
            cursor.execute("SELECT id FROM areas WHERE sigla = ? AND id != ?", (new_sigla, area_id))
            if cursor.fetchone():
                raise HTTPException(status_code=400, detail="Sigla já está em uso por outra área")
            area_data["sigla"] = new_sigla  # Atualizar no dict

        # Obter colunas existentes
        columns = safe_get_table_columns(db, "areas")

        # Preparar campos para atualizar
        set_clauses = []
        params = []

        updatable_fields = {
            "nome": area_data.get("nome"),
            "sigla": area_data.get("sigla"),
            "descricao": area_data.get("descricao"),
            "cor": area_data.get("cor"),
            "icone": area_data.get("icone"),
            "diretor_id": area_data.get("diretor_id"),
            "ativa": area_data.get("ativa"),
            "prioridade": area_data.get("prioridade")
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
        params.append(area_id)
        query = f"UPDATE areas SET {', '.join(set_clauses)} WHERE id = ?"
        result = cursor.execute(query, params)

        if result.rowcount == 0:
            raise HTTPException(status_code=404, detail="Área não encontrada")

        db.commit()
        cursor.close()
        db.close()

        logger.info(f"✅ Área {area_id} atualizada com sucesso")
        return {
            "message": "Área atualizada com sucesso",
            "success": True
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Erro ao atualizar área {area_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")


@router.delete("/{area_id}")
async def delete_area(area_id: int):
    """Deletar área com fallback gracioso"""
    try:
        db = get_db()
        cursor = db.cursor()

        # Verificar se área existe
        cursor.execute("SELECT nome, sigla FROM areas WHERE id = ?", (area_id,))
        area_row = cursor.fetchone()

        if not area_row:
            raise HTTPException(status_code=404, detail="Área não encontrada")

        area_name = area_row[0] if area_row else "Desconhecida"
        area_sigla = area_row[1] if len(area_row) > 1 else ""

        # Executar delete
        cursor.execute("DELETE FROM areas WHERE id = ?", (area_id,))

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Área não encontrada")

        db.commit()
        cursor.close()
        db.close()

        logger.info(f"✅ Área '{area_name}' ({area_sigla}) (ID {area_id}) deletada com sucesso")
        return {
            "message": f"Área '{area_name}' ({area_sigla}) deletada com sucesso",
            "success": True
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Erro ao deletar área {area_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")


# ============================================================================
# 🔗 ENDPOINTS ESPECIAIS
# ============================================================================

@router.patch("/{area_id}/toggle-active")
async def toggle_area_active(area_id: int):
    """Alternar status ativa/inativa da área"""
    try:
        db = get_db()
        cursor = db.cursor()

        columns = safe_get_table_columns(db, "areas")

        if "ativa" not in columns:
            raise HTTPException(status_code=400, detail="Campo 'ativa' não existe na tabela")

        # Obter status atual
        cursor.execute("SELECT ativa, nome FROM areas WHERE id = ?", (area_id,))
        row = cursor.fetchone()

        if not row:
            raise HTTPException(status_code=404, detail="Área não encontrada")

        # Alternar status
        current_status = bool(row[0])
        new_status = not current_status
        area_name = row[1]

        cursor.execute("UPDATE areas SET ativa = ? WHERE id = ?", (new_status, area_id))

        # Timestamp de atualização
        if "updated_at" in columns:
            cursor.execute("UPDATE areas SET updated_at = ? WHERE id = ?",
                           (datetime.now().isoformat(), area_id))

        db.commit()
        cursor.close()
        db.close()

        status_text = "ativada" if new_status else "desativada"
        logger.info(f"✅ Área '{area_name}' {status_text}")

        return {
            "message": f"Área '{area_name}' {status_text} com sucesso",
            "ativa": new_status,
            "success": True
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Erro ao alternar status da área {area_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")


@router.get("/{area_id}/teams")
async def get_area_teams(area_id: int):
    """Obter equipes de uma área"""
    try:
        db = get_db()
        cursor = db.cursor()

        # Verificar se tabela teams existe e tem campo area_id
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='teams'")
        if not cursor.fetchone():
            return []

        team_columns = safe_get_table_columns(db, "teams")
        if "area_id" not in team_columns:
            return []

        # Buscar equipes da área
        available_fields = [col for col in team_columns if col in [
            "id", "nome", "descricao", "cor", "ativo"
        ]]

        query = f"SELECT {', '.join(available_fields)} FROM teams WHERE area_id = ?"
        cursor.execute(query, (area_id,))
        rows = cursor.fetchall()

        teams = [dict(row) for row in rows]

        cursor.close()
        db.close()

        return teams

    except Exception as e:
        logger.error(f"❌ Erro ao buscar equipes da área {area_id}: {e}")
        return []


@router.get("/{area_id}/employees")
async def get_area_employees(area_id: int):
    """Obter funcionários de uma área"""
    try:
        db = get_db()
        cursor = db.cursor()

        # Verificar se tabela employees existe e tem campo area_id
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='employees'")
        if not cursor.fetchone():
            return []

        emp_columns = safe_get_table_columns(db, "employees")
        if "area_id" not in emp_columns:
            return []

        # Buscar funcionários da área
        available_fields = [col for col in emp_columns if col in [
            "id", "nome", "email", "cargo", "status", "equipe"
        ]]

        query = f"SELECT {', '.join(available_fields)} FROM employees WHERE area_id = ?"
        cursor.execute(query, (area_id,))
        rows = cursor.fetchall()

        employees = [dict(row) for row in rows]

        cursor.close()
        db.close()

        return employees

    except Exception as e:
        logger.error(f"❌ Erro ao buscar funcionários da área {area_id}: {e}")
        return []


@router.get("/{area_id}/managers")
async def get_area_managers(area_id: int):
    """Obter gerentes de uma área"""
    try:
        db = get_db()
        cursor = db.cursor()

        # Verificar se tabela managers existe e tem campo area_id
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='managers'")
        if not cursor.fetchone():
            return []

        mgr_columns = safe_get_table_columns(db, "managers")
        if "area_id" not in mgr_columns:
            return []

        # Buscar gerentes da área
        available_fields = [col for col in mgr_columns if col in [
            "id", "nome", "email", "cargo", "nivel_hierarquico", "ativo"
        ]]

        where_clause = "WHERE area_id = ?"
        if "ativo" in mgr_columns:
            where_clause += " AND ativo = 1"

        query = f"SELECT {', '.join(available_fields)} FROM managers {where_clause}"
        cursor.execute(query, (area_id,))
        rows = cursor.fetchall()

        managers = [dict(row) for row in rows]

        cursor.close()
        db.close()

        return managers

    except Exception as e:
        logger.error(f"❌ Erro ao buscar gerentes da área {area_id}: {e}")
        return []


@router.get("/stats/summary")
async def get_areas_stats():
    """Obter estatísticas das áreas"""
    try:
        db = get_db()
        cursor = db.cursor()

        # Verificar se tabela existe
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='areas'")
        if not cursor.fetchone():
            return {
                "total": 0,
                "active": 0,
                "inactive": 0,
                "by_priority": []
            }

        columns = safe_get_table_columns(db, "areas")

        stats = {
            "total": 0,
            "active": 0,
            "inactive": 0,
            "by_priority": []
        }

        # Total
        cursor.execute("SELECT COUNT(*) FROM areas")
        stats["total"] = cursor.fetchone()[0]

        # Por status (se campo existir)
        if "ativa" in columns:
            cursor.execute("SELECT COUNT(*) FROM areas WHERE ativa = 1")
            stats["active"] = cursor.fetchone()[0]

            cursor.execute("SELECT COUNT(*) FROM areas WHERE ativa = 0")
            stats["inactive"] = cursor.fetchone()[0]

        # Por prioridade (se campo existir)
        if "prioridade" in columns:
            cursor.execute("""
                           SELECT prioridade, COUNT(*) as count
                           FROM areas
                           WHERE prioridade IS NOT NULL
                           GROUP BY prioridade
                           ORDER BY prioridade
                           """)

            stats["by_priority"] = [
                {"prioridade": row[0], "count": row[1]}
                for row in cursor.fetchall()
            ]

        cursor.close()
        db.close()

        return stats

    except Exception as e:
        logger.error(f"❌ Erro ao obter estatísticas das áreas: {e}")
        return {
            "total": 0,
            "active": 0,
            "inactive": 0,
            "by_priority": [],
            "error": str(e)
        }
