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
    prefix="/knowledge",
    tags=["knowledge"]
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
async def get_knowledge():
    """Listar todos os conhecimentos com fallback gracioso"""
    try:
        logger.info("🔍 Buscando conhecimentos com fallback gracioso")

        db = get_db()
        cursor = db.cursor()

        # Verificar se tabela knowledge existe
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='knowledge'")
        if not cursor.fetchone():
            logger.warning("⚠️ Tabela knowledge não existe")
            return {
                "error": "Tabela knowledge não existe. Execute a migration primeiro.",
                "success": False,
                "knowledge": []
            }

        # Obter colunas existentes
        columns = safe_get_table_columns(db, "knowledge")

        # Campos básicos obrigatórios
        basic_columns = ["id", "nome"]
        existing_basic = [col for col in basic_columns if col in columns]

        # Campos opcionais
        optional_fields = [
            "codigo", "tipo", "categoria", "area", "fornecedor", "vendor",
            "validade_anos", "validade_meses", "nivel_formacao", "nivel",
            "modalidade", "preco", "carga_horaria", "descricao", "link",
            "pre_requisitos", "tags", "dificuldade", "ativo", "popular",
            "obrigatorio", "created_at", "updated_at"
        ]

        for field in optional_fields:
            if field in columns:
                existing_basic.append(field)

        query = f"SELECT {', '.join(existing_basic)} FROM knowledge ORDER BY nome"
        cursor.execute(query)
        rows = cursor.fetchall()

        knowledge = []
        for row in rows:
            item = dict(row)

            # Adicionar campos padrão se não existirem
            defaults = {
                "tipo": "CURSO",
                "categoria": "",
                "area": "",
                "fornecedor": "",
                "vendor": "",
                "dificuldade": "MEDIO",
                "ativo": True,
                "popular": False,
                "obrigatorio": False,
                "nivel": "BASICO",
                "modalidade": "EAD"
            }

            for field, default_value in defaults.items():
                if field not in item:
                    item[field] = default_value

            # Compatibilidade dupla frontend/backend
            if "categoria" in item and not item.get("area"):
                item["area"] = item["categoria"]
            if "fornecedor" in item and not item.get("vendor"):
                item["vendor"] = item["fornecedor"]

            knowledge.append(item)

        cursor.close()
        db.close()

        logger.info(f"✅ Retornando {len(knowledge)} conhecimentos")
        return knowledge

    except Exception as e:
        logger.error(f"❌ Erro ao buscar conhecimentos: {e}")
        return {
            "error": str(e),
            "success": False,
            "knowledge": []
        }


@router.get("/{knowledge_id}")
async def get_knowledge_by_id(knowledge_id: int):
    """Buscar conhecimento por ID com fallback gracioso"""
    try:
        db = get_db()
        cursor = db.cursor()

        # Verificar se tabela existe
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='knowledge'")
        if not cursor.fetchone():
            raise HTTPException(status_code=500, detail="Tabela knowledge não existe")

        # Obter colunas existentes
        columns = safe_get_table_columns(db, "knowledge")

        # Campos disponíveis
        available_fields = [col for col in columns if col in [
            "id", "nome", "codigo", "tipo", "categoria", "area", "fornecedor", "vendor",
            "validade_anos", "validade_meses", "nivel_formacao", "nivel", "modalidade",
            "preco", "carga_horaria", "descricao", "link", "pre_requisitos", "tags",
            "dificuldade", "ativo", "popular", "obrigatorio", "created_at", "updated_at"
        ]]

        if not available_fields:
            available_fields = ["*"]

        query = f"SELECT {', '.join(available_fields)} FROM knowledge WHERE id = ?"
        cursor.execute(query, (knowledge_id,))
        row = cursor.fetchone()

        if not row:
            raise HTTPException(status_code=404, detail="Conhecimento não encontrado")

        knowledge_item = dict(row)

        # Campos padrão
        defaults = {
            "tipo": "CURSO",
            "categoria": "",
            "area": "",
            "fornecedor": "",
            "vendor": "",
            "dificuldade": "MEDIO",
            "ativo": True,
            "popular": False,
            "obrigatorio": False,
            "nivel": "BASICO",
            "modalidade": "EAD",
            "descricao": "",
            "tags": ""
        }

        for field, default_value in defaults.items():
            if field not in knowledge_item:
                knowledge_item[field] = default_value

        # Compatibilidade dupla
        if "categoria" in knowledge_item and not knowledge_item.get("area"):
            knowledge_item["area"] = knowledge_item["categoria"]
        if "fornecedor" in knowledge_item and not knowledge_item.get("vendor"):
            knowledge_item["vendor"] = knowledge_item["fornecedor"]

        cursor.close()
        db.close()

        return knowledge_item

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Erro ao buscar conhecimento {knowledge_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")


@router.post("/")
async def create_knowledge(knowledge_data: Dict[Any, Any]):
    """Criar novo conhecimento com fallback gracioso"""
    try:
        # Validações básicas
        if not knowledge_data.get("nome"):
            raise HTTPException(status_code=400, detail="Nome é obrigatório")

        db = get_db()
        cursor = db.cursor()

        # Verificar se tabela existe
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='knowledge'")
        if not cursor.fetchone():
            raise HTTPException(status_code=500, detail="Tabela knowledge não existe")

        # Verificar se código já existe (se fornecido)
        codigo = knowledge_data.get("codigo")
        if codigo:
            cursor.execute("SELECT id FROM knowledge WHERE codigo = ?", (codigo,))
            if cursor.fetchone():
                raise HTTPException(status_code=400, detail="Código já está em uso")

        # Obter colunas existentes
        columns = safe_get_table_columns(db, "knowledge")

        # Preparar dados
        fields = []
        values = []
        params = []

        # Campo obrigatório
        if "nome" in columns:
            fields.append("nome")
            values.append("?")
            params.append(knowledge_data.get("nome"))

        # Campos opcionais com valores ou padrões
        optional_data = {
            "codigo": knowledge_data.get("codigo"),
            "tipo": knowledge_data.get("tipo", "CURSO"),
            "categoria": knowledge_data.get("categoria", knowledge_data.get("area", "")),  # Compatibilidade
            "area": knowledge_data.get("area", knowledge_data.get("categoria", "")),  # Compatibilidade
            "fornecedor": knowledge_data.get("fornecedor", knowledge_data.get("vendor", "")),  # Compatibilidade
            "vendor": knowledge_data.get("vendor", knowledge_data.get("fornecedor", "")),  # Compatibilidade
            "validade_anos": knowledge_data.get("validade_anos"),
            "validade_meses": knowledge_data.get("validade_meses"),
            "nivel_formacao": knowledge_data.get("nivel_formacao"),
            "nivel": knowledge_data.get("nivel", "BASICO"),
            "modalidade": knowledge_data.get("modalidade", "EAD"),
            "preco": knowledge_data.get("preco"),
            "carga_horaria": knowledge_data.get("carga_horaria"),
            "descricao": knowledge_data.get("descricao", ""),
            "link": knowledge_data.get("link"),
            "pre_requisitos": knowledge_data.get("pre_requisitos"),
            "tags": knowledge_data.get("tags"),
            "dificuldade": knowledge_data.get("dificuldade", "MEDIO"),
            "ativo": knowledge_data.get("ativo", True),
            "popular": knowledge_data.get("popular", False),
            "obrigatorio": knowledge_data.get("obrigatorio", False)
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
        query = f"INSERT INTO knowledge ({', '.join(fields)}) VALUES ({', '.join(values)})"
        cursor.execute(query, params)
        db.commit()

        knowledge_id = cursor.lastrowid

        cursor.close()
        db.close()

        logger.info(f"✅ Conhecimento '{knowledge_data.get('nome')}' criado com ID {knowledge_id}")
        return {
            "message": "Conhecimento criado com sucesso",
            "knowledge_id": knowledge_id,
            "success": True
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Erro ao criar conhecimento: {e}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")


@router.put("/{knowledge_id}")
async def update_knowledge(knowledge_id: int, knowledge_data: Dict[Any, Any]):
    """Atualizar conhecimento com fallback gracioso"""
    try:
        db = get_db()
        cursor = db.cursor()

        # Verificar se conhecimento existe
        cursor.execute("SELECT id FROM knowledge WHERE id = ?", (knowledge_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Conhecimento não encontrado")

        # Se está alterando código, verificar se não já existe
        new_codigo = knowledge_data.get("codigo")
        if new_codigo:
            cursor.execute("SELECT id FROM knowledge WHERE codigo = ? AND id != ?", (new_codigo, knowledge_id))
            if cursor.fetchone():
                raise HTTPException(status_code=400, detail="Código já está em uso por outro conhecimento")

        # Obter colunas existentes
        columns = safe_get_table_columns(db, "knowledge")

        # Preparar campos para atualizar
        set_clauses = []
        params = []

        updatable_fields = {
            "nome": knowledge_data.get("nome"),
            "codigo": knowledge_data.get("codigo"),
            "tipo": knowledge_data.get("tipo"),
            "categoria": knowledge_data.get("categoria", knowledge_data.get("area")),  # Compatibilidade
            "area": knowledge_data.get("area", knowledge_data.get("categoria")),  # Compatibilidade
            "fornecedor": knowledge_data.get("fornecedor", knowledge_data.get("vendor")),  # Compatibilidade
            "vendor": knowledge_data.get("vendor", knowledge_data.get("fornecedor")),  # Compatibilidade
            "validade_anos": knowledge_data.get("validade_anos"),
            "validade_meses": knowledge_data.get("validade_meses"),
            "nivel_formacao": knowledge_data.get("nivel_formacao"),
            "nivel": knowledge_data.get("nivel"),
            "modalidade": knowledge_data.get("modalidade"),
            "preco": knowledge_data.get("preco"),
            "carga_horaria": knowledge_data.get("carga_horaria"),
            "descricao": knowledge_data.get("descricao"),
            "link": knowledge_data.get("link"),
            "pre_requisitos": knowledge_data.get("pre_requisitos"),
            "tags": knowledge_data.get("tags"),
            "dificuldade": knowledge_data.get("dificuldade"),
            "ativo": knowledge_data.get("ativo"),
            "popular": knowledge_data.get("popular"),
            "obrigatorio": knowledge_data.get("obrigatorio")
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
        params.append(knowledge_id)
        query = f"UPDATE knowledge SET {', '.join(set_clauses)} WHERE id = ?"
        result = cursor.execute(query, params)

        if result.rowcount == 0:
            raise HTTPException(status_code=404, detail="Conhecimento não encontrado")

        db.commit()
        cursor.close()
        db.close()

        logger.info(f"✅ Conhecimento {knowledge_id} atualizado com sucesso")
        return {
            "message": "Conhecimento atualizado com sucesso",
            "success": True
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Erro ao atualizar conhecimento {knowledge_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")


@router.delete("/{knowledge_id}")
async def delete_knowledge(knowledge_id: int):
    """Deletar conhecimento com fallback gracioso"""
    try:
        db = get_db()
        cursor = db.cursor()

        # Verificar se conhecimento existe
        cursor.execute("SELECT nome FROM knowledge WHERE id = ?", (knowledge_id,))
        knowledge_row = cursor.fetchone()

        if not knowledge_row:
            raise HTTPException(status_code=404, detail="Conhecimento não encontrado")

        knowledge_name = knowledge_row[0] if knowledge_row else "Desconhecido"

        # Executar delete
        cursor.execute("DELETE FROM knowledge WHERE id = ?", (knowledge_id,))

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Conhecimento não encontrado")

        db.commit()
        cursor.close()
        db.close()

        logger.info(f"✅ Conhecimento '{knowledge_name}' (ID {knowledge_id}) deletado com sucesso")
        return {
            "message": f"Conhecimento '{knowledge_name}' deletado com sucesso",
            "success": True
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Erro ao deletar conhecimento {knowledge_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")


# ============================================================================
# 🔍 ENDPOINTS DE BUSCA E FILTROS
# ============================================================================

@router.get("/search")
async def search_knowledge(
        q: Optional[str] = None,
        tipo: Optional[str] = None,
        categoria: Optional[str] = None,
        fornecedor: Optional[str] = None,
        dificuldade: Optional[str] = None,
        ativo: Optional[bool] = None,
        popular: Optional[bool] = None,
        obrigatorio: Optional[bool] = None,
        limit: Optional[int] = 100
):
    """Buscar conhecimentos com filtros"""
    try:
        db = get_db()
        cursor = db.cursor()

        # Verificar se tabela existe
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='knowledge'")
        if not cursor.fetchone():
            return []

        columns = safe_get_table_columns(db, "knowledge")

        # Campos disponíveis
        available_fields = [col for col in columns if col in [
            "id", "nome", "codigo", "tipo", "categoria", "area", "fornecedor", "vendor",
            "dificuldade", "ativo", "popular", "obrigatorio"
        ]]

        # Construir query
        where_conditions = []
        params = []

        # Busca por texto
        if q and "nome" in columns:
            where_conditions.append("nome LIKE ?")
            params.append(f"%{q}%")

        # Filtros específicos
        filters = {
            "tipo": tipo,
            "categoria": categoria,
            "fornecedor": fornecedor,
            "dificuldade": dificuldade,
            "ativo": ativo,
            "popular": popular,
            "obrigatorio": obrigatorio
        }

        for field, value in filters.items():
            if value is not None and field in columns:
                where_conditions.append(f"{field} = ?")
                params.append(value)

        # Montar query final
        where_clause = ""
        if where_conditions:
            where_clause = "WHERE " + " AND ".join(where_conditions)

        query = f"SELECT {', '.join(available_fields)} FROM knowledge {where_clause} ORDER BY nome LIMIT ?"
        params.append(limit)

        cursor.execute(query, params)
        rows = cursor.fetchall()

        results = []
        for row in rows:
            item = dict(row)

            # Campos padrão
            defaults = {
                "tipo": "CURSO",
                "categoria": "",
                "dificuldade": "MEDIO",
                "ativo": True,
                "popular": False,
                "obrigatorio": False
            }

            for field, default_value in defaults.items():
                if field not in item:
                    item[field] = default_value

            results.append(item)

        cursor.close()
        db.close()

        return results

    except Exception as e:
        logger.error(f"❌ Erro na busca de conhecimentos: {e}")
        return []


@router.get("/types")
async def get_knowledge_types():
    """Obter tipos de conhecimento disponíveis"""
    try:
        db = get_db()
        cursor = db.cursor()

        columns = safe_get_table_columns(db, "knowledge")

        if "tipo" not in columns:
            return ["CURSO", "CERTIFICACAO", "FORMACAO"]  # Padrão

        cursor.execute("SELECT DISTINCT tipo FROM knowledge WHERE tipo IS NOT NULL ORDER BY tipo")
        rows = cursor.fetchall()

        types = [row[0] for row in rows if row[0]]

        cursor.close()
        db.close()

        # Se não há dados, retorna tipos padrão
        if not types:
            types = ["CURSO", "CERTIFICACAO", "FORMACAO"]

        return types

    except Exception as e:
        logger.error(f"❌ Erro ao obter tipos: {e}")
        return ["CURSO", "CERTIFICACAO", "FORMACAO"]


@router.get("/categories")
async def get_knowledge_categories():
    """Obter categorias de conhecimento disponíveis"""
    try:
        db = get_db()
        cursor = db.cursor()

        columns = safe_get_table_columns(db, "knowledge")

        categories = set()

        # Buscar em categoria (backend)
        if "categoria" in columns:
            cursor.execute("SELECT DISTINCT categoria FROM knowledge WHERE categoria IS NOT NULL AND categoria != ''")
            rows = cursor.fetchall()
            categories.update([row[0] for row in rows if row[0]])

        # Buscar em area (frontend compatibility)
        if "area" in columns:
            cursor.execute("SELECT DISTINCT area FROM knowledge WHERE area IS NOT NULL AND area != ''")
            rows = cursor.fetchall()
            categories.update([row[0] for row in rows if row[0]])

        cursor.close()
        db.close()

        return sorted(list(categories)) if categories else []

    except Exception as e:
        logger.error(f"❌ Erro ao obter categorias: {e}")
        return []


@router.get("/vendors")
async def get_knowledge_vendors():
    """Obter fornecedores de conhecimento disponíveis"""
    try:
        db = get_db()
        cursor = db.cursor()

        columns = safe_get_table_columns(db, "knowledge")

        vendors = set()

        # Buscar em fornecedor (backend)
        if "fornecedor" in columns:
            cursor.execute(
                "SELECT DISTINCT fornecedor FROM knowledge WHERE fornecedor IS NOT NULL AND fornecedor != ''")
            rows = cursor.fetchall()
            vendors.update([row[0] for row in rows if row[0]])

        # Buscar em vendor (frontend compatibility)
        if "vendor" in columns:
            cursor.execute("SELECT DISTINCT vendor FROM knowledge WHERE vendor IS NOT NULL AND vendor != ''")
            rows = cursor.fetchall()
            vendors.update([row[0] for row in rows if row[0]])

        cursor.close()
        db.close()

        return sorted(list(vendors)) if vendors else []

    except Exception as e:
        logger.error(f"❌ Erro ao obter fornecedores: {e}")
        return []


@router.get("/popular")
async def get_popular_knowledge(limit: int = 10):
    """Obter conhecimentos populares"""
    try:
        db = get_db()
        cursor = db.cursor()

        columns = safe_get_table_columns(db, "knowledge")

        # Campos disponíveis
        available_fields = [col for col in columns if col in [
            "id", "nome", "tipo", "categoria", "fornecedor", "dificuldade"
        ]]

        where_clause = ""
        if "popular" in columns:
            where_clause = "WHERE popular = 1"
        elif "ativo" in columns:
            where_clause = "WHERE ativo = 1"

        query = f"SELECT {', '.join(available_fields)} FROM knowledge {where_clause} ORDER BY nome LIMIT ?"
        cursor.execute(query, (limit,))
        rows = cursor.fetchall()

        popular = [dict(row) for row in rows]

        cursor.close()
        db.close()

        return popular

    except Exception as e:
        logger.error(f"❌ Erro ao obter conhecimentos populares: {e}")
        return []


@router.get("/stats/summary")
async def get_knowledge_stats():
    """Obter estatísticas dos conhecimentos"""
    try:
        db = get_db()
        cursor = db.cursor()

        # Verificar se tabela existe
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='knowledge'")
        if not cursor.fetchone():
            return {
                "total": 0,
                "by_type": [],
                "by_category": [],
                "by_vendor": [],
                "by_difficulty": []
            }

        columns = safe_get_table_columns(db, "knowledge")

        stats = {
            "total": 0,
            "by_type": [],
            "by_category": [],
            "by_vendor": [],
            "by_difficulty": []
        }

        # Total
        cursor.execute("SELECT COUNT(*) FROM knowledge")
        stats["total"] = cursor.fetchone()[0]

        # Por tipo
        if "tipo" in columns:
            cursor.execute("""
                           SELECT tipo, COUNT(*) as count
                           FROM knowledge
                           WHERE tipo IS NOT NULL
                           GROUP BY tipo
                           ORDER BY count DESC
                           """)
            stats["by_type"] = [{"tipo": row[0], "count": row[1]} for row in cursor.fetchall()]

        # Por categoria
        if "categoria" in columns:
            cursor.execute("""
                           SELECT categoria, COUNT(*) as count
                           FROM knowledge
                           WHERE categoria IS NOT NULL AND categoria != ''
                           GROUP BY categoria
                           ORDER BY count DESC
                               LIMIT 10
                           """)
            stats["by_category"] = [{"categoria": row[0], "count": row[1]} for row in cursor.fetchall()]

        # Por fornecedor
        if "fornecedor" in columns:
            cursor.execute("""
                           SELECT fornecedor, COUNT(*) as count
                           FROM knowledge
                           WHERE fornecedor IS NOT NULL AND fornecedor != ''
                           GROUP BY fornecedor
                           ORDER BY count DESC
                               LIMIT 10
                           """)
            stats["by_vendor"] = [{"fornecedor": row[0], "count": row[1]} for row in cursor.fetchall()]

        # Por dificuldade
        if "dificuldade" in columns:
            cursor.execute("""
                           SELECT dificuldade, COUNT(*) as count
                           FROM knowledge
                           WHERE dificuldade IS NOT NULL
                           GROUP BY dificuldade
                           ORDER BY count DESC
                           """)
            stats["by_difficulty"] = [{"dificuldade": row[0], "count": row[1]} for row in cursor.fetchall()]

        cursor.close()
        db.close()

        return stats

    except Exception as e:
        logger.error(f"❌ Erro ao obter estatísticas dos conhecimentos: {e}")
        return {
            "total": 0,
            "by_type": [],
            "by_category": [],
            "by_vendor": [],
            "by_difficulty": [],
            "error": str(e)
        }
