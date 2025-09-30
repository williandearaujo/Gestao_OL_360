from fastapi import APIRouter, HTTPException, Request
import sqlite3
import json
import logging
from datetime import datetime, date
from typing import List, Optional, Dict, Any

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/employee-knowledge",
    tags=["employee-knowledge"]
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
async def get_employee_knowledge():
    """Listar todos os vínculos employee-knowledge com fallback gracioso"""
    try:
        logger.info("🔍 Buscando vínculos employee-knowledge com fallback gracioso")

        db = get_db()
        cursor = db.cursor()

        # Verificar se tabela employee_knowledge existe
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='employee_knowledge'")
        if not cursor.fetchone():
            logger.warning("⚠️ Tabela employee_knowledge não existe")
            return {
                "error": "Tabela employee_knowledge não existe. Execute a migration primeiro.",
                "success": False,
                "links": []
            }

        # Obter colunas existentes
        columns = safe_get_table_columns(db, "employee_knowledge")

        # Verificar se tabelas relacionadas existem
        employees_exists = False
        knowledge_exists = False

        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='employees'")
        employees_exists = cursor.fetchone() is not None

        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='knowledge'")
        knowledge_exists = cursor.fetchone() is not None

        # Query base
        base_fields = ["ek.id", "ek.employee_id", "ek.learning_item_id", "ek.status", "ek.prioridade"]
        optional_fields = ["ek.data_obtencao", "ek.data_expiracao", "ek.data_alvo", "ek.observacoes", "ek.created_at"]

        # Adicionar campos disponíveis
        for field in optional_fields:
            field_name = field.split('.')[-1]  # Remove 'ek.'
            if field_name in columns:
                base_fields.append(field)

        # Adicionar joins se tabelas existem
        if employees_exists:
            base_fields.append("e.nome as employee_nome")

        if knowledge_exists:
            base_fields.append("k.nome as knowledge_nome")

        # Construir query
        query = f"SELECT {', '.join(base_fields)} FROM employee_knowledge ek"

        if employees_exists:
            query += " LEFT JOIN employees e ON ek.employee_id = e.id"

        if knowledge_exists:
            query += " LEFT JOIN knowledge k ON ek.learning_item_id = k.id"

        query += " ORDER BY ek.id"

        cursor.execute(query)
        rows = cursor.fetchall()

        links = []
        for row in rows:
            link = dict(row)

            # Adicionar campos padrão se não existirem
            defaults = {
                "status": "DESEJADO",
                "prioridade": "MEDIA",
                "observacoes": "",
                "employee_nome": f"Funcionário {link.get('employee_id', 'N/A')}",
                "knowledge_nome": f"Conhecimento {link.get('learning_item_id', 'N/A')}"
            }

            for field, default_value in defaults.items():
                if field not in link or link[field] is None:
                    link[field] = default_value

            links.append(link)

        cursor.close()
        db.close()

        logger.info(f"✅ Retornando {len(links)} vínculos employee-knowledge")
        return links

    except Exception as e:
        logger.error(f"❌ Erro ao buscar vínculos employee-knowledge: {e}")
        return {
            "error": str(e),
            "success": False,
            "links": []
        }


@router.get("/employee/{employee_id}")
async def get_employee_knowledge_by_employee(employee_id: int):
    """Buscar conhecimentos de um funcionário específico"""
    try:
        db = get_db()
        cursor = db.cursor()

        # Verificar se tabela existe
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='employee_knowledge'")
        if not cursor.fetchone():
            return []

        # Verificar se tabela knowledge existe
        knowledge_exists = False
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='knowledge'")
        knowledge_exists = cursor.fetchone() is not None

        # Obter colunas existentes
        ek_columns = safe_get_table_columns(db, "employee_knowledge")

        # Query base
        base_fields = ["ek.*"]
        query = "SELECT ek.*"

        if knowledge_exists:
            query += ", k.nome as knowledge_nome, k.tipo, k.categoria"
            query += " FROM employee_knowledge ek LEFT JOIN knowledge k ON ek.learning_item_id = k.id"
        else:
            query += " FROM employee_knowledge ek"

        query += " WHERE ek.employee_id = ? ORDER BY ek.id"

        cursor.execute(query, (employee_id,))
        rows = cursor.fetchall()

        knowledge_list = []
        for row in rows:
            knowledge = dict(row)

            # Campos padrão
            defaults = {
                "status": "DESEJADO",
                "prioridade": "MEDIA",
                "observacoes": "",
                "knowledge_nome": f"Conhecimento {knowledge.get('learning_item_id', 'N/A')}",
                "tipo": "CURSO",
                "categoria": ""
            }

            for field, default_value in defaults.items():
                if field not in knowledge or knowledge[field] is None:
                    knowledge[field] = default_value

            knowledge_list.append(knowledge)

        cursor.close()
        db.close()

        return knowledge_list

    except Exception as e:
        logger.error(f"❌ Erro ao buscar conhecimentos do funcionário {employee_id}: {e}")
        return []


@router.post("/")
async def create_employee_knowledge(link_data: Dict[Any, Any]):
    """Criar novo vínculo employee-knowledge com fallback gracioso"""
    try:
        # Validações básicas
        required_fields = ["employee_id", "learning_item_id"]
        for field in required_fields:
            if not link_data.get(field):
                raise HTTPException(status_code=400, detail=f"{field} é obrigatório")

        db = get_db()
        cursor = db.cursor()

        # Verificar se tabela existe
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='employee_knowledge'")
        if not cursor.fetchone():
            raise HTTPException(status_code=500, detail="Tabela employee_knowledge não existe")

        # Verificar se vínculo já existe
        cursor.execute("""
                       SELECT id
                       FROM employee_knowledge
                       WHERE employee_id = ?
                         AND learning_item_id = ?
                       """, (link_data.get("employee_id"), link_data.get("learning_item_id")))

        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Vínculo já existe para este funcionário e conhecimento")

        # Obter colunas existentes
        columns = safe_get_table_columns(db, "employee_knowledge")

        # Preparar dados
        fields = []
        values = []
        params = []

        # Campos obrigatórios
        required_data = {
            "employee_id": link_data.get("employee_id"),
            "learning_item_id": link_data.get("learning_item_id")
        }

        for field, value in required_data.items():
            if field in columns:
                fields.append(field)
                values.append("?")
                params.append(value)

        # Campos opcionais
        optional_data = {
            "status": link_data.get("status", "DESEJADO"),
            "prioridade": link_data.get("prioridade", "MEDIA"),
            "progresso": link_data.get("progresso", 0.0),
            "data_obtencao": link_data.get("data_obtencao"),
            "data_expiracao": link_data.get("data_expiracao"),
            "data_alvo": link_data.get("data_alvo"),
            "data_inicio": link_data.get("data_inicio"),
            "anexo_path": link_data.get("anexo_path"),
            "anexo_nome": link_data.get("anexo_nome"),
            "anexo_tipo": link_data.get("anexo_tipo"),
            "valor_investido": link_data.get("valor_investido"),
            "reembolsavel": link_data.get("reembolsavel", False),
            "reembolsado": link_data.get("reembolsado", False),
            "observacoes": link_data.get("observacoes", ""),
            "notas_gestor": link_data.get("notas_gestor"),
            "nota_avaliacao": link_data.get("nota_avaliacao")
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
        query = f"INSERT INTO employee_knowledge ({', '.join(fields)}) VALUES ({', '.join(values)})"
        cursor.execute(query, params)
        db.commit()

        link_id = cursor.lastrowid

        cursor.close()
        db.close()

        logger.info(f"✅ Vínculo employee-knowledge criado com ID {link_id}")
        return {
            "message": "Vínculo criado com sucesso",
            "link_id": link_id,
            "success": True
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Erro ao criar vínculo employee-knowledge: {e}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")


@router.put("/{link_id}")
async def update_employee_knowledge(link_id: int, link_data: Dict[Any, Any]):
    """Atualizar vínculo employee-knowledge com fallback gracioso"""
    try:
        db = get_db()
        cursor = db.cursor()

        # Verificar se vínculo existe
        cursor.execute("SELECT id FROM employee_knowledge WHERE id = ?", (link_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Vínculo não encontrado")

        # Obter colunas existentes
        columns = safe_get_table_columns(db, "employee_knowledge")

        # Preparar campos para atualizar
        set_clauses = []
        params = []

        updatable_fields = {
            "status": link_data.get("status"),
            "prioridade": link_data.get("prioridade"),
            "progresso": link_data.get("progresso"),
            "data_obtencao": link_data.get("data_obtencao"),
            "data_expiracao": link_data.get("data_expiracao"),
            "data_alvo": link_data.get("data_alvo"),
            "data_inicio": link_data.get("data_inicio"),
            "anexo_path": link_data.get("anexo_path"),
            "anexo_nome": link_data.get("anexo_nome"),
            "anexo_tipo": link_data.get("anexo_tipo"),
            "valor_investido": link_data.get("valor_investido"),
            "reembolsavel": link_data.get("reembolsavel"),
            "reembolsado": link_data.get("reembolsado"),
            "observacoes": link_data.get("observacoes"),
            "notas_gestor": link_data.get("notas_gestor"),
            "nota_avaliacao": link_data.get("nota_avaliacao")
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
        params.append(link_id)
        query = f"UPDATE employee_knowledge SET {', '.join(set_clauses)} WHERE id = ?"
        result = cursor.execute(query, params)

        if result.rowcount == 0:
            raise HTTPException(status_code=404, detail="Vínculo não encontrado")

        db.commit()
        cursor.close()
        db.close()

        logger.info(f"✅ Vínculo employee-knowledge {link_id} atualizado com sucesso")
        return {
            "message": "Vínculo atualizado com sucesso",
            "success": True
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Erro ao atualizar vínculo {link_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")


@router.delete("/{link_id}")
async def delete_employee_knowledge(link_id: int):
    """Deletar vínculo employee-knowledge com fallback gracioso"""
    try:
        db = get_db()
        cursor = db.cursor()

        # Verificar se vínculo existe
        cursor.execute("SELECT id FROM employee_knowledge WHERE id = ?", (link_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Vínculo não encontrado")

        # Executar delete
        cursor.execute("DELETE FROM employee_knowledge WHERE id = ?", (link_id,))

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Vínculo não encontrado")

        db.commit()
        cursor.close()
        db.close()

        logger.info(f"✅ Vínculo employee-knowledge {link_id} deletado com sucesso")
        return {
            "message": "Vínculo deletado com sucesso",
            "success": True
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Erro ao deletar vínculo {link_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")


# ============================================================================
# 📊 ENDPOINTS DE RELATÓRIOS E ESTATÍSTICAS
# ============================================================================

@router.get("/stats/by-status")
async def get_stats_by_status():
    """Obter estatísticas por status"""
    try:
        db = get_db()
        cursor = db.cursor()

        columns = safe_get_table_columns(db, "employee_knowledge")

        if "status" not in columns:
            return []

        cursor.execute("""
                       SELECT status, COUNT(*) as count
                       FROM employee_knowledge
                       GROUP BY status
                       ORDER BY count DESC
                       """)

        stats = [{"status": row[0], "count": row[1]} for row in cursor.fetchall()]

        cursor.close()
        db.close()

        return stats

    except Exception as e:
        logger.error(f"❌ Erro ao obter estatísticas por status: {e}")
        return []


@router.get("/stats/by-priority")
async def get_stats_by_priority():
    """Obter estatísticas por prioridade"""
    try:
        db = get_db()
        cursor = db.cursor()

        columns = safe_get_table_columns(db, "employee_knowledge")

        if "prioridade" not in columns:
            return []

        cursor.execute("""
                       SELECT prioridade, COUNT(*) as count
                       FROM employee_knowledge
                       GROUP BY prioridade
                       ORDER BY count DESC
                       """)

        stats = [{"prioridade": row[0], "count": row[1]} for row in cursor.fetchall()]

        cursor.close()
        db.close()

        return stats

    except Exception as e:
        logger.error(f"❌ Erro ao obter estatísticas por prioridade: {e}")
        return []


@router.get("/knowledge/{knowledge_id}/employees")
async def get_knowledge_employees(knowledge_id: int):
    """Obter funcionários que têm/querem um conhecimento específico"""
    try:
        db = get_db()
        cursor = db.cursor()

        # Verificar se tabela employees existe
        employees_exists = False
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='employees'")
        employees_exists = cursor.fetchone() is not None

        # Query base
        query = "SELECT ek.*"
        if employees_exists:
            query += ", e.nome as employee_nome, e.email, e.cargo"
            query += " FROM employee_knowledge ek LEFT JOIN employees e ON ek.employee_id = e.id"
        else:
            query += " FROM employee_knowledge ek"

        query += " WHERE ek.learning_item_id = ? ORDER BY ek.status, ek.prioridade"

        cursor.execute(query, (knowledge_id,))
        rows = cursor.fetchall()

        employees = []
        for row in rows:
            employee = dict(row)

            # Campos padrão
            if "employee_nome" not in employee:
                employee["employee_nome"] = f"Funcionário {employee.get('employee_id', 'N/A')}"

            employees.append(employee)

        cursor.close()
        db.close()

        return employees

    except Exception as e:
        logger.error(f"❌ Erro ao buscar funcionários do conhecimento {knowledge_id}: {e}")
        return []
