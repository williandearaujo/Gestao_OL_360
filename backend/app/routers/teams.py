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
    prefix="/teams",
    tags=["teams"]
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
async def get_teams():
    """Listar todas as equipes com fallback gracioso"""
    try:
        logger.info("🔍 Buscando equipes com fallback gracioso")

        db = get_db()
        cursor = db.cursor()

        # Verificar se tabela teams existe
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='teams'")
        if not cursor.fetchone():
            logger.warning("⚠️ Tabela teams não existe")
            return {
                "error": "Tabela teams não existe. Execute a migration primeiro.",
                "success": False,
                "teams": []
            }

        # Obter colunas existentes
        columns = safe_get_table_columns(db, "teams")

        # Campos básicos obrigatórios
        basic_columns = ["id", "nome"]
        existing_basic = [col for col in basic_columns if col in columns]

        # Campos opcionais
        optional_fields = ["descricao", "cor", "area_id", "manager_id", "meta_membros", "icone", "ativo", "created_at",
                           "updated_at"]
        for field in optional_fields:
            if field in columns:
                existing_basic.append(field)

        query = f"SELECT {', '.join(existing_basic)} FROM teams ORDER BY nome"
        cursor.execute(query)
        rows = cursor.fetchall()

        teams = []
        for row in rows:
            team = dict(row)

            # Adicionar campos padrão se não existirem
            defaults = {
                "cor": "#3B82F6",
                "ativo": True,
                "descricao": "",
                "meta_membros": 5,
                "icone": "team"
            }

            for field, default_value in defaults.items():
                if field not in team:
                    team[field] = default_value

            teams.append(team)

        cursor.close()
        db.close()

        logger.info(f"✅ Retornando {len(teams)} equipes")
        return teams

    except Exception as e:
        logger.error(f"❌ Erro ao buscar equipes: {e}")
        return {
            "error": str(e),
            "success": False,
            "teams": []
        }


@router.get("/{team_id}")
async def get_team(team_id: int):
    """Buscar equipe por ID com fallback gracioso"""
    try:
        db = get_db()
        cursor = db.cursor()

        # Verificar se tabela existe
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='teams'")
        if not cursor.fetchone():
            raise HTTPException(status_code=500, detail="Tabela teams não existe")

        # Obter colunas existentes
        columns = safe_get_table_columns(db, "teams")

        # Campos disponíveis
        available_fields = [col for col in columns if col in [
            "id", "nome", "descricao", "cor", "area_id", "manager_id",
            "meta_membros", "icone", "ativo", "created_at", "updated_at"
        ]]

        if not available_fields:
            available_fields = ["*"]

        query = f"SELECT {', '.join(available_fields)} FROM teams WHERE id = ?"
        cursor.execute(query, (team_id,))
        row = cursor.fetchone()

        if not row:
            raise HTTPException(status_code=404, detail="Equipe não encontrada")

        team = dict(row)

        # Campos padrão
        defaults = {
            "cor": "#3B82F6",
            "ativo": True,
            "descricao": "",
            "meta_membros": 5,
            "icone": "team"
        }

        for field, default_value in defaults.items():
            if field not in team:
                team[field] = default_value

        cursor.close()
        db.close()

        return team

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Erro ao buscar equipe {team_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")


@router.post("/")
async def create_team(team_data: Dict[Any, Any]):
    """Criar nova equipe com fallback gracioso"""
    try:
        # Validações básicas
        if not team_data.get("nome"):
            raise HTTPException(status_code=400, detail="Nome é obrigatório")

        db = get_db()
        cursor = db.cursor()

        # Verificar se tabela existe
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='teams'")
        if not cursor.fetchone():
            raise HTTPException(status_code=500, detail="Tabela teams não existe")

        # Obter colunas existentes
        columns = safe_get_table_columns(db, "teams")

        # Preparar dados
        fields = []
        values = []
        params = []

        # Campo obrigatório
        if "nome" in columns:
            fields.append("nome")
            values.append("?")
            params.append(team_data.get("nome"))

        # Campos opcionais
        optional_data = {
            "descricao": team_data.get("descricao", ""),
            "cor": team_data.get("cor", "#3B82F6"),
            "area_id": team_data.get("area_id"),
            "manager_id": team_data.get("manager_id"),
            "meta_membros": team_data.get("meta_membros", 5),
            "icone": team_data.get("icone", "team"),
            "ativo": team_data.get("ativo", True)
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
        query = f"INSERT INTO teams ({', '.join(fields)}) VALUES ({', '.join(values)})"
        cursor.execute(query, params)
        db.commit()

        team_id = cursor.lastrowid

        cursor.close()
        db.close()

        logger.info(f"✅ Equipe '{team_data.get('nome')}' criada com ID {team_id}")
        return {
            "message": "Equipe criada com sucesso",
            "team_id": team_id,
            "success": True
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Erro ao criar equipe: {e}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")


@router.put("/{team_id}")
async def update_team(team_id: int, team_data: Dict[Any, Any]):
    """Atualizar equipe com fallback gracioso"""
    try:
        db = get_db()
        cursor = db.cursor()

        # Verificar se equipe existe
        cursor.execute("SELECT id FROM teams WHERE id = ?", (team_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Equipe não encontrada")

        # Obter colunas existentes
        columns = safe_get_table_columns(db, "teams")

        # Preparar campos para atualizar
        set_clauses = []
        params = []

        updatable_fields = {
            "nome": team_data.get("nome"),
            "descricao": team_data.get("descricao"),
            "cor": team_data.get("cor"),
            "area_id": team_data.get("area_id"),
            "manager_id": team_data.get("manager_id"),
            "meta_membros": team_data.get("meta_membros"),
            "icone": team_data.get("icone"),
            "ativo": team_data.get("ativo")
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
        params.append(team_id)
        query = f"UPDATE teams SET {', '.join(set_clauses)} WHERE id = ?"
        result = cursor.execute(query, params)

        if result.rowcount == 0:
            raise HTTPException(status_code=404, detail="Equipe não encontrada")

        db.commit()
        cursor.close()
        db.close()

        logger.info(f"✅ Equipe {team_id} atualizada com sucesso")
        return {
            "message": "Equipe atualizada com sucesso",
            "success": True
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Erro ao atualizar equipe {team_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")


@router.delete("/{team_id}")
async def delete_team(team_id: int):
    """Deletar equipe com fallback gracioso"""
    try:
        db = get_db()
        cursor = db.cursor()

        # Verificar se equipe existe
        cursor.execute("SELECT nome FROM teams WHERE id = ?", (team_id,))
        team_row = cursor.fetchone()

        if not team_row:
            raise HTTPException(status_code=404, detail="Equipe não encontrada")

        team_name = team_row[0] if team_row else "Desconhecida"

        # Executar delete
        cursor.execute("DELETE FROM teams WHERE id = ?", (team_id,))

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Equipe não encontrada")

        db.commit()
        cursor.close()
        db.close()

        logger.info(f"✅ Equipe '{team_name}' (ID {team_id}) deletada com sucesso")
        return {
            "message": f"Equipe '{team_name}' deletada com sucesso",
            "success": True
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Erro ao deletar equipe {team_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")


# ============================================================================
# 🔗 ENDPOINTS ESPECIAIS
# ============================================================================

@router.get("/area/{area_id}")
async def get_teams_by_area(area_id: int):
    """Buscar equipes por área com fallback gracioso"""
    try:
        db = get_db()
        cursor = db.cursor()

        columns = safe_get_table_columns(db, "teams")

        if "area_id" not in columns:
            return []  # Se não tem campo area_id, retorna vazio

        # Campos disponíveis
        available_fields = [col for col in columns if col in [
            "id", "nome", "descricao", "cor", "area_id", "ativo"
        ]]

        query = f"SELECT {', '.join(available_fields)} FROM teams WHERE area_id = ? ORDER BY nome"
        cursor.execute(query, (area_id,))
        rows = cursor.fetchall()

        teams = []
        for row in rows:
            team = dict(row)

            # Campos padrão
            if "cor" not in team:
                team["cor"] = "#3B82F6"
            if "ativo" not in team:
                team["ativo"] = True

            teams.append(team)

        cursor.close()
        db.close()

        return teams

    except Exception as e:
        logger.error(f"❌ Erro ao buscar equipes da área {area_id}: {e}")
        return []


@router.patch("/{team_id}/toggle-active")
async def toggle_team_active(team_id: int):
    """Alternar status ativo/inativo da equipe"""
    try:
        db = get_db()
        cursor = db.cursor()

        columns = safe_get_table_columns(db, "teams")

        if "ativo" not in columns:
            raise HTTPException(status_code=400, detail="Campo 'ativo' não existe na tabela")

        # Obter status atual
        cursor.execute("SELECT ativo, nome FROM teams WHERE id = ?", (team_id,))
        row = cursor.fetchone()

        if not row:
            raise HTTPException(status_code=404, detail="Equipe não encontrada")

        # Alternar status
        current_status = bool(row[0])
        new_status = not current_status
        team_name = row[1]

        cursor.execute("UPDATE teams SET ativo = ? WHERE id = ?", (new_status, team_id))

        # Timestamp de atualização
        if "updated_at" in columns:
            cursor.execute("UPDATE teams SET updated_at = ? WHERE id = ?",
                           (datetime.now().isoformat(), team_id))

        db.commit()
        cursor.close()
        db.close()

        status_text = "ativada" if new_status else "desativada"
        logger.info(f"✅ Equipe '{team_name}' {status_text}")

        return {
            "message": f"Equipe '{team_name}' {status_text} com sucesso",
            "ativo": new_status,
            "success": True
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Erro ao alternar status da equipe {team_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")


@router.get("/{team_id}/members")
async def get_team_members(team_id: int):
    """Obter membros de uma equipe"""
    try:
        db = get_db()
        cursor = db.cursor()

        # Verificar se tabela employees existe
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='employees'")
        if not cursor.fetchone():
            return []

        # Verificar se campo team_id existe na tabela employees
        emp_columns = safe_get_table_columns(db, "employees")
        if "team_id" not in emp_columns:
            return []

        # Buscar membros
        available_fields = [col for col in emp_columns if col in [
            "id", "nome", "email", "cargo", "status"
        ]]

        query = f"SELECT {', '.join(available_fields)} FROM employees WHERE team_id = ?"
        cursor.execute(query, (team_id,))
        rows = cursor.fetchall()

        members = [dict(row) for row in rows]

        cursor.close()
        db.close()

        return members

    except Exception as e:
        logger.error(f"❌ Erro ao buscar membros da equipe {team_id}: {e}")
        return []


@router.get("/stats/summary")
async def get_teams_stats():
    """Obter estatísticas das equipes"""
    try:
        db = get_db()
        cursor = db.cursor()

        # Verificar se tabela existe
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='teams'")
        if not cursor.fetchone():
            return {
                "total": 0,
                "active": 0,
                "inactive": 0,
                "by_area": []
            }

        columns = safe_get_table_columns(db, "teams")

        stats = {
            "total": 0,
            "active": 0,
            "inactive": 0,
            "by_area": []
        }

        # Total
        cursor.execute("SELECT COUNT(*) FROM teams")
        stats["total"] = cursor.fetchone()[0]

        # Por status (se campo existir)
        if "ativo" in columns:
            cursor.execute("SELECT COUNT(*) FROM teams WHERE ativo = 1")
            stats["active"] = cursor.fetchone()[0]

            cursor.execute("SELECT COUNT(*) FROM teams WHERE ativo = 0")
            stats["inactive"] = cursor.fetchone()[0]

        # Por área (se campo existir)
        if "area_id" in columns:
            cursor.execute("""
                           SELECT area_id, COUNT(*) as count
                           FROM teams
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
        logger.error(f"❌ Erro ao obter estatísticas das equipes: {e}")
        return {
            "total": 0,
            "active": 0,
            "inactive": 0,
            "by_area": [],
            "error": str(e)
        }
