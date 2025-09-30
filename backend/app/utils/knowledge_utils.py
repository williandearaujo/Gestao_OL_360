from typing import List, Dict, Any, Optional
from datetime import date, timedelta, datetime
import json


# ============================================================================
# 📊 CÁLCULOS DE ESTATÍSTICAS DE CONHECIMENTO
# ============================================================================

def calculate_knowledge_stats(
        knowledge_list: List[Dict],
        employee_knowledge_list: List[Dict]
) -> Dict[str, Any]:
    """Calcular estatísticas completas de conhecimentos"""

    if not knowledge_list:
        knowledge_list = []
    if not employee_knowledge_list:
        employee_knowledge_list = []

    total_catalogo = len(knowledge_list)
    total_obtidas = sum(1 for ek in employee_knowledge_list if ek.get("status") == "OBTIDO")
    total_desejadas = sum(1 for ek in employee_knowledge_list if ek.get("status") == "DESEJADO")
    total_em_andamento = sum(1 for ek in employee_knowledge_list
                             if ek.get("status") in ["EM_PROGRESSO", "EM_ANDAMENTO"])

    # Vencendo em 30 dias
    hoje = date.today()
    trinta_dias = hoje + timedelta(days=30)
    vencendo_30_dias = 0
    vencidas = 0

    for ek in employee_knowledge_list:
        if ek.get("status") == "OBTIDO" and ek.get("data_expiracao"):
            try:
                data_exp = ek["data_expiracao"]
                if isinstance(data_exp, str):
                    data_exp = datetime.strptime(data_exp, "%Y-%m-%d").date()

                if data_exp < hoje:
                    vencidas += 1
                elif hoje <= data_exp <= trinta_dias:
                    vencendo_30_dias += 1
            except:
                pass

    # Por categoria
    por_categoria = {}
    for knowledge in knowledge_list:
        categoria = knowledge.get("categoria", "Sem Categoria")
        # Compatibilidade com frontend
        if not categoria and knowledge.get("area"):
            categoria = knowledge["area"]
        por_categoria[categoria] = por_categoria.get(categoria, 0) + 1

    # Por fornecedor
    por_fornecedor = {}
    for knowledge in knowledge_list:
        fornecedor = knowledge.get("fornecedor") or knowledge.get("vendor", "Sem Fornecedor")
        if fornecedor and fornecedor != "Sem Fornecedor":
            por_fornecedor[fornecedor] = por_fornecedor.get(fornecedor, 0) + 1

    # Por status
    por_status = {}
    for ek in employee_knowledge_list:
        status = ek.get("status", "DESCONHECIDO")
        por_status[status] = por_status.get(status, 0) + 1

    # Por tipo
    por_tipo = {}
    for knowledge in knowledge_list:
        tipo = knowledge.get("tipo", "CURSO")
        por_tipo[tipo] = por_tipo.get(tipo, 0) + 1

    # Por prioridade
    por_prioridade = {}
    for ek in employee_knowledge_list:
        prioridade = ek.get("prioridade", "MEDIA")
        por_prioridade[prioridade] = por_prioridade.get(prioridade, 0) + 1

    return {
        "total_catalogo": total_catalogo,
        "total_obtidas": total_obtidas,
        "total_desejadas": total_desejadas,
        "total_em_andamento": total_em_andamento,
        "vencendo_30_dias": vencendo_30_dias,
        "vencidas": vencidas,
        "por_categoria": por_categoria,
        "por_fornecedor": por_fornecedor,
        "por_status": por_status,
        "por_tipo": por_tipo,
        "por_prioridade": por_prioridade
    }


# ============================================================================
# ⏰ GESTÃO DE CERTIFICAÇÕES EXPIRANDO
# ============================================================================

def get_expiring_certificates(
        employee_knowledge_list: List[Dict],
        days: int = 30
) -> List[Dict]:
    """Obter certificações que estão vencendo"""

    hoje = date.today()
    data_limite = hoje + timedelta(days=days)
    expiring = []

    for ek in employee_knowledge_list:
        if ek.get("status") == "OBTIDO" and ek.get("data_expiracao"):
            try:
                data_exp = ek["data_expiracao"]
                if isinstance(data_exp, str):
                    data_exp = datetime.strptime(data_exp, "%Y-%m-%d").date()

                if hoje <= data_exp <= data_limite:
                    dias_para_expirar = (data_exp - hoje).days
                    expiring.append({
                        "id": ek.get("id"),
                        "employee_id": ek.get("employee_id"),
                        "employee_nome": ek.get("employee_nome", "N/A"),
                        "learning_item_id": ek.get("learning_item_id"),
                        "knowledge_nome": ek.get("knowledge_nome", "N/A"),
                        "data_expiracao": data_exp,
                        "dias_para_expirar": dias_para_expirar,
                        "prioridade": ek.get("prioridade", "MEDIA")
                    })
            except:
                pass

    # Ordenar por dias para expirar (mais urgente primeiro)
    expiring.sort(key=lambda x: x["dias_para_expirar"])
    return expiring


def get_expired_certificates(employee_knowledge_list: List[Dict]) -> List[Dict]:
    """Obter certificações já vencidas"""

    hoje = date.today()
    expired = []

    for ek in employee_knowledge_list:
        if ek.get("status") == "OBTIDO" and ek.get("data_expiracao"):
            try:
                data_exp = ek["data_expiracao"]
                if isinstance(data_exp, str):
                    data_exp = datetime.strptime(data_exp, "%Y-%m-%d").date()

                if data_exp < hoje:
                    dias_vencidos = (hoje - data_exp).days
                    expired.append({
                        "id": ek.get("id"),
                        "employee_id": ek.get("employee_id"),
                        "employee_nome": ek.get("employee_nome", "N/A"),
                        "learning_item_id": ek.get("learning_item_id"),
                        "knowledge_nome": ek.get("knowledge_nome", "N/A"),
                        "data_expiracao": data_exp,
                        "dias_vencidos": dias_vencidos,
                        "prioridade": ek.get("prioridade", "MEDIA")
                    })
            except:
                pass

    # Ordenar por dias vencidos (mais vencido primeiro)
    expired.sort(key=lambda x: x["dias_vencidos"], reverse=True)
    return expired


# ============================================================================
# 🎯 RECOMENDAÇÕES DE CONHECIMENTO
# ============================================================================

def recommend_knowledge_for_employee(
        employee: Dict[str, Any],
        knowledge_list: List[Dict],
        employee_knowledge_list: List[Dict]
) -> List[Dict]:
    """Recomendar conhecimentos para um funcionário baseado no cargo e competências"""

    cargo = employee.get("cargo", "").lower()
    competencias = employee.get("competencias", [])
    if isinstance(competencias, str):
        try:
            competencias = json.loads(competencias)
        except:
            competencias = []

    # Conhecimentos já possuídos pelo funcionário
    employee_id = employee.get("id")
    possessed_knowledge = set()
    for ek in employee_knowledge_list:
        if ek.get("employee_id") == employee_id:
            possessed_knowledge.add(ek.get("learning_item_id"))

    recommendations = []

    for knowledge in knowledge_list:
        # Pular se já possui
        if knowledge.get("id") in possessed_knowledge:
            continue

        score = 0
        reasons = []

        # Conhecimentos obrigatórios têm prioridade máxima
        if knowledge.get("obrigatorio"):
            score += 100
            reasons.append("Obrigatório")

        # Conhecimentos populares
        if knowledge.get("popular"):
            score += 30
            reasons.append("Popular")

        # Match com cargo
        knowledge_tags = knowledge.get("tags", "").lower()
        knowledge_desc = knowledge.get("descricao", "").lower()
        knowledge_name = knowledge.get("nome", "").lower()

        cargo_words = cargo.split()
        for word in cargo_words:
            if (word in knowledge_tags or
                    word in knowledge_desc or
                    word in knowledge_name):
                score += 20
                reasons.append("Relacionado ao cargo")
                break

        # Match com competências
        for comp in competencias:
            comp_lower = comp.lower()
            if (comp_lower in knowledge_tags or
                    comp_lower in knowledge_desc or
                    comp_lower in knowledge_name):
                score += 15
                reasons.append("Match com competências")
                break

        # Conhecimentos da área/categoria relevante
        area_relevante = ["tecnologia", "gestao", "lideranca", "comunicacao"]
        categoria = knowledge.get("categoria", "").lower()
        area = knowledge.get("area", "").lower()

        for area_rel in area_relevante:
            if area_rel in categoria or area_rel in area:
                score += 10
                reasons.append("Área relevante")
                break

        if score > 0:
            recommendations.append({
                "knowledge": knowledge,
                "score": score,
                "reasons": reasons
            })

    # Ordenar por score (maior primeiro) e limitar a 10
    recommendations.sort(key=lambda x: x["score"], reverse=True)
    return recommendations[:10]


# ============================================================================
# 📈 ANÁLISE DE PROGRESSO
# ============================================================================

def analyze_learning_progress(employee_knowledge_list: List[Dict]) -> Dict[str, Any]:
    """Analisar progresso de aprendizado"""

    if not employee_knowledge_list:
        return {
            "taxa_conclusao": 0,
            "conhecimentos_em_progresso": 0,
            "tempo_medio_conclusao": 0,
            "areas_foco": [],
            "tendencias": {}
        }

    total = len(employee_knowledge_list)
    obtidas = sum(1 for ek in employee_knowledge_list if ek.get("status") == "OBTIDO")
    em_progresso = sum(1 for ek in employee_knowledge_list
                       if ek.get("status") in ["EM_PROGRESSO", "EM_ANDAMENTO"])

    taxa_conclusao = (obtidas / total * 100) if total > 0 else 0

    # Áreas de foco (categorias mais buscadas)
    areas_contador = {}
    for ek in employee_knowledge_list:
        # Tentar obter categoria do knowledge vinculado
        categoria = "Outras"  # Default
        areas_contador[categoria] = areas_contador.get(categoria, 0) + 1

    areas_foco = sorted(areas_contador.items(), key=lambda x: x[1], reverse=True)[:5]

    # Tendências por mês (simplificado)
    tendencias = {
        "crescimento_mensal": 0,  # Seria calculado com dados históricos
        "categorias_populares": [area[0] for area in areas_foco[:3]]
    }

    return {
        "taxa_conclusao": round(taxa_conclusao, 2),
        "conhecimentos_em_progresso": em_progresso,
        "tempo_medio_conclusao": 0,  # Seria calculado com dados históricos
        "areas_foco": areas_foco,
        "tendencias": tendencias
    }


# ============================================================================
# 🔍 FUNÇÕES DE BUSCA E FILTROS
# ============================================================================

def filter_knowledge_by_criteria(
        knowledge_list: List[Dict],
        tipo: Optional[str] = None,
        categoria: Optional[str] = None,
        fornecedor: Optional[str] = None,
        dificuldade: Optional[str] = None,
        ativo: Optional[bool] = None,
        search: Optional[str] = None
) -> List[Dict]:
    """Filtrar conhecimentos por critérios"""

    filtered = knowledge_list

    if tipo:
        filtered = [k for k in filtered if k.get("tipo") == tipo]

    if categoria:
        filtered = [k for k in filtered
                    if (k.get("categoria") == categoria or k.get("area") == categoria)]

    if fornecedor:
        filtered = [k for k in filtered
                    if (k.get("fornecedor") == fornecedor or k.get("vendor") == fornecedor)]

    if dificuldade:
        filtered = [k for k in filtered if k.get("dificuldade") == dificuldade]

    if ativo is not None:
        filtered = [k for k in filtered if k.get("ativo", True) == ativo]

    if search:
        search_lower = search.lower()
        filtered = [
            k for k in filtered
            if (search_lower in k.get("nome", "").lower() or
                search_lower in k.get("descricao", "").lower() or
                search_lower in k.get("tags", "").lower())
        ]

    return filtered


def get_knowledge_requiring_attention(
        employee_knowledge_list: List[Dict]
) -> Dict[str, List[Dict]]:
    """Obter conhecimentos que requerem atenção"""

    return {
        "vencendo": get_expiring_certificates(employee_knowledge_list, 30),
        "vencidas": get_expired_certificates(employee_knowledge_list),
        "alta_prioridade": [
            ek for ek in employee_knowledge_list
            if ek.get("prioridade") == "ALTA" and ek.get("status") != "OBTIDO"
        ],
        "obrigatorias_pendentes": [
            ek for ek in employee_knowledge_list
            if ek.get("status") == "OBRIGATORIO" and ek.get("status") != "OBTIDO"
        ]
    }
