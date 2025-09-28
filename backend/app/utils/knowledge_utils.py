from typing import List, Dict, Any
from datetime import date, timedelta
from ..models.knowledge import Knowledge
from ..models.employee_knowledge import EmployeeKnowledge

def calculate_knowledge_stats(
    knowledge_list: List[Knowledge],
    employee_knowledge_list: List[EmployeeKnowledge]
) -> Dict[str, Any]:
    
    total_catalogo = len(knowledge_list)
    total_obtidas = sum(1 for ek in employee_knowledge_list if ek.status == "OBTIDO")
    total_desejadas = sum(1 for ek in employee_knowledge_list if ek.status == "DESEJADO")
    total_em_andamento = sum(1 for ek in employee_knowledge_list if ek.status == "EM_ANDAMENTO")
    
    # Vencendo em 30 dias
    hoje = date.today()
    trinta_dias = hoje + timedelta(days=30)
    
    vencendo_30_dias = sum(
        1 for ek in employee_knowledge_list 
        if (ek.data_expiracao and 
            hoje <= ek.data_expiracao <= trinta_dias and 
            ek.status == "OBTIDO")
    )
    
    # Vencidas
    vencidas = sum(
        1 for ek in employee_knowledge_list
        if (ek.data_expiracao and 
            ek.data_expiracao < hoje and 
            ek.status == "OBTIDO")
    )
    
    # Por categoria
    por_categoria = {}
    for knowledge in knowledge_list:
        categoria = knowledge.categoria
        por_categoria[categoria] = por_categoria.get(categoria, 0) + 1
    
    # Por fornecedor
    por_fornecedor = {}
    for knowledge in knowledge_list:
        if knowledge.fornecedor:
            fornecedor = knowledge.fornecedor
            por_fornecedor[fornecedor] = por_fornecedor.get(fornecedor, 0) + 1
    
    # Por status
    por_status = {}
    for ek in employee_knowledge_list:
        status = ek.status
        por_status[status] = por_status.get(status, 0) + 1
    
    return {
        "total_catalogo": total_catalogo,
        "total_obtidas": total_obtidas,
        "total_desejadas": total_desejadas,
        "total_em_andamento": total_em_andamento,
        "vencendo_30_dias": vencendo_30_dias,
        "vencidas": vencidas,
        "por_categoria": por_categoria,
        "por_fornecedor": por_fornecedor,
        "por_status": por_status
    }

def get_expiring_certificates(days: int = 30) -> List[EmployeeKnowledge]:
    """Obter certificações que estão vencendo"""
    hoje = date.today()
    data_limite = hoje + timedelta(days=days)
    
    # Esta função seria chamada com dados do banco
    # Por agora retorna estrutura vazia
    return []
