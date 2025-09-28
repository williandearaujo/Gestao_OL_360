from typing import List, Dict, Any
from datetime import date, timedelta
from ..models.employee import Employee

def calculate_employee_stats(employees: List[Employee]) -> Dict[str, Any]:
    """Calcular estatísticas completas dos colaboradores"""
    total = len(employees)
    ativos = sum(1 for emp in employees if emp.status == "ATIVO")
    inativos = sum(1 for emp in employees if emp.status == "INATIVO")
    ferias = sum(1 for emp in employees if emp.status == "FERIAS")
    licenca = sum(1 for emp in employees if emp.status == "LICENCA")
    
    # Por equipe
    por_equipe = {}
    for emp in employees:
        equipe = emp.equipe
        por_equipe[equipe] = por_equipe.get(equipe, 0) + 1
    
    # Aniversários do mês
    mes_atual = date.today().month
    aniversarios = sum(1 for emp in employees if emp.data_nascimento.month == mes_atual)
    
    # Análises avançadas
    hoje = date.today()
    pdi_atrasados = 0
    reunioes_atrasadas = 0
    ferias_obrigatorias = 0
    
    for emp in employees:
        # PDI atrasados
        if emp.pdi and emp.pdi.get("data_proximo"):
            try:
                data_proximo = emp.pdi["data_proximo"]
                if isinstance(data_proximo, str):
                    from datetime import datetime
                    data_proximo = datetime.strptime(data_proximo, "%Y-%m-%d").date()
                if data_proximo < hoje:
                    pdi_atrasados += 1
            except:
                pass
        
        # Reuniões 1x1 atrasadas
        if emp.reunioes_1x1 and emp.reunioes_1x1.get("data_proximo"):
            try:
                data_proximo = emp.reunioes_1x1["data_proximo"]
                if isinstance(data_proximo, str):
                    from datetime import datetime
                    data_proximo = datetime.strptime(data_proximo, "%Y-%m-%d").date()
                if data_proximo < hoje:
                    reunioes_atrasadas += 1
            except:
                pass
        
        # Férias obrigatórias
        if emp.ferias and emp.ferias.get("ferias_vencidas", 0) > 0:
            ferias_obrigatorias += 1
    
    return {
        "total": total,
        "ativos": ativos,
        "inativos": inativos,
        "ferias": ferias,
        "licenca": licenca,
        "por_equipe": por_equipe,
        "certificacoes_obtidas": 0,
        "certificacoes_desejadas": 0,
        "vencendo_certificacoes": 0,
        "pdi_atrasados": pdi_atrasados,
        "reunioes_atrasadas": reunioes_atrasadas,
        "aniversarios": aniversarios,
        "ferias_obrigatorias": ferias_obrigatorias
    }

def calculate_vacation_entitlement(admission_date: date) -> Dict[str, Any]:
    """Calcular direito a férias baseado na CLT"""
    hoje = date.today()
    years_worked = (hoje - admission_date).days / 365.25
    
    if years_worked < 1:
        return {
            "dias_disponivel": 0,
            "status": "SEM_DIREITO",
            "pode_vender": 0
        }
    
    dias_base = 30
    dias_disponivel = int(dias_base)
    pode_vender = min(10, dias_disponivel // 3)
    
    return {
        "dias_disponivel": dias_disponivel,
        "status": "DISPONIVEL",
        "pode_vender": pode_vender
    }

def check_dayoff_eligibility(birth_date: date) -> Dict[str, Any]:
    """Verificar elegibilidade para day off"""
    hoje = date.today()
    mes_aniversario = birth_date.month
    
    return {
        "mes_aniversario": mes_aniversario,
        "usado_ano_atual": False,
        "data_proximo": date(hoje.year, mes_aniversario, birth_date.day),
        "status": "DISPONIVEL" if hoje.month == mes_aniversario else "FORA_DO_PERIODO"
    }
