from typing import List, Dict, Any, Optional
from datetime import date, timedelta, datetime
import json


# ============================================================================
# 📊 CÁLCULOS DE ESTATÍSTICAS
# ============================================================================

def calculate_employee_stats(employees: List[Dict]) -> Dict[str, Any]:
    """Calcular estatísticas completas dos colaboradores"""
    if not employees:
        return {
            "total": 0,
            "ativos": 0,
            "inativos": 0,
            "ferias": 0,
            "licenca": 0,
            "por_equipe": {},
            "certificacoes_obtidas": 0,
            "certificacoes_desejadas": 0,
            "vencendo_certificacoes": 0,
            "pdi_atrasados": 0,
            "reunioes_atrasadas": 0,
            "aniversarios": 0,
            "ferias_obrigatorias": 0
        }

    total = len(employees)
    ativos = sum(1 for emp in employees if emp.get("status") == "ATIVO")
    inativos = sum(1 for emp in employees if emp.get("status") == "INATIVO")
    ferias = sum(1 for emp in employees if emp.get("status") == "FERIAS")
    licenca = sum(1 for emp in employees if emp.get("status") == "LICENCA")

    # Por equipe
    por_equipe = {}
    for emp in employees:
        equipe = emp.get("equipe", "Sem Equipe")
        por_equipe[equipe] = por_equipe.get(equipe, 0) + 1

    # Aniversários do mês atual
    mes_atual = date.today().month
    aniversarios = 0

    for emp in employees:
        data_nasc = emp.get("data_nascimento")
        if data_nasc:
            try:
                if isinstance(data_nasc, str):
                    data_nasc = datetime.strptime(data_nasc, "%Y-%m-%d").date()
                if data_nasc.month == mes_atual:
                    aniversarios += 1
            except:
                pass

    # Análises avançadas
    hoje = date.today()
    pdi_atrasados = 0
    reunioes_atrasadas = 0
    ferias_obrigatorias = 0

    for emp in employees:
        # PDI atrasados
        pdi = emp.get("pdi")
        if pdi and isinstance(pdi, (dict, str)):
            if isinstance(pdi, str):
                try:
                    pdi = json.loads(pdi)
                except:
                    pdi = {}

            data_proximo = pdi.get("data_proximo")
            if data_proximo:
                try:
                    if isinstance(data_proximo, str):
                        data_proximo = datetime.strptime(data_proximo, "%Y-%m-%d").date()
                    if data_proximo < hoje:
                        pdi_atrasados += 1
                except:
                    pass

        # Reuniões 1x1 atrasadas
        reunioes = emp.get("reunioes_1x1")
        if reunioes and isinstance(reunioes, (dict, str)):
            if isinstance(reunioes, str):
                try:
                    reunioes = json.loads(reunioes)
                except:
                    reunioes = {}

            data_proximo = reunioes.get("data_proximo")
            if data_proximo:
                try:
                    if isinstance(data_proximo, str):
                        data_proximo = datetime.strptime(data_proximo, "%Y-%m-%d").date()
                    if data_proximo < hoje:
                        reunioes_atrasadas += 1
                except:
                    pass

        # Férias obrigatórias
        ferias_data = emp.get("ferias")
        if ferias_data and isinstance(ferias_data, (dict, str)):
            if isinstance(ferias_data, str):
                try:
                    ferias_data = json.loads(ferias_data)
                except:
                    ferias_data = {}

            if ferias_data.get("ferias_vencidas", 0) > 0:
                ferias_obrigatorias += 1

    return {
        "total": total,
        "ativos": ativos,
        "inativos": inativos,
        "ferias": ferias,
        "licenca": licenca,
        "por_equipe": por_equipe,
        "certificacoes_obtidas": 0,  # Será calculado com dados de knowledge
        "certificacoes_desejadas": 0,
        "vencendo_certificacoes": 0,
        "pdi_atrasados": pdi_atrasados,
        "reunioes_atrasadas": reunioes_atrasadas,
        "aniversarios": aniversarios,
        "ferias_obrigatorias": ferias_obrigatorias
    }


# ============================================================================
# 🏖️ CÁLCULOS DE FÉRIAS (CLT)
# ============================================================================

def calculate_vacation_entitlement(admission_date: date) -> Dict[str, Any]:
    """Calcular direito a férias baseado na CLT"""
    hoje = date.today()
    years_worked = (hoje - admission_date).days / 365.25

    if years_worked < 1:
        return {
            "dias_disponivel": 0,
            "status": "SEM_DIREITO",
            "pode_vender": 0,
            "periodo_aquisitivo": "Em andamento",
            "proximo_direito": admission_date.replace(year=admission_date.year + 1)
        }

    # Direito base: 30 dias após 1 ano
    dias_base = 30

    # Redução por faltas (simplificado)
    if years_worked >= 1:
        dias_disponivel = dias_base
        # Pode vender até 1/3 das férias (10 dias)
        pode_vender = min(10, dias_disponivel // 3)

        return {
            "dias_disponivel": dias_disponivel,
            "status": "DISPONIVEL",
            "pode_vender": pode_vender,
            "periodo_aquisitivo": f"{int(years_worked)} ano(s) trabalhado(s)",
            "proximo_direito": None
        }

    return {
        "dias_disponivel": 0,
        "status": "SEM_DIREITO",
        "pode_vender": 0
    }


# ============================================================================
# 🎂 CÁLCULOS DE DAY OFF
# ============================================================================

def check_dayoff_eligibility(birth_date: date) -> Dict[str, Any]:
    """Verificar elegibilidade para day off no mês de aniversário"""
    hoje = date.today()
    mes_aniversario = birth_date.month

    # Data do próximo aniversário
    try:
        proximo_aniversario = date(hoje.year, mes_aniversario, birth_date.day)
        if proximo_aniversario < hoje:
            proximo_aniversario = date(hoje.year + 1, mes_aniversario, birth_date.day)
    except ValueError:
        # Caso de 29 de fevereiro em ano não bissexto
        proximo_aniversario = date(hoje.year, mes_aniversario, 28)
        if proximo_aniversario < hoje:
            proximo_aniversario = date(hoje.year + 1, mes_aniversario, 28)

    # Verificar se está no mês do aniversário
    no_mes_aniversario = hoje.month == mes_aniversario

    status = "DISPONIVEL" if no_mes_aniversario else "FORA_DO_PERIODO"

    return {
        "mes_aniversario": mes_aniversario,
        "usado_ano_atual": False,  # Seria verificado no banco
        "data_proximo": proximo_aniversario,
        "status": status,
        "dias_restantes": (proximo_aniversario - hoje).days if not no_mes_aniversario else 0
    }


# ============================================================================
# 📈 CÁLCULOS DE PDI
# ============================================================================

def calculate_pdi_status(pdi_data: Dict[str, Any]) -> Dict[str, Any]:
    """Calcular status do PDI"""
    if not pdi_data:
        return {
            "status": "NUNCA_AGENDADO",
            "dias_atraso": 0,
            "proximo_vencimento": None
        }

    hoje = date.today()
    data_proximo = pdi_data.get("data_proximo")

    if not data_proximo:
        return {
            "status": "NUNCA_AGENDADO",
            "dias_atraso": 0,
            "proximo_vencimento": None
        }

    try:
        if isinstance(data_proximo, str):
            data_proximo = datetime.strptime(data_proximo, "%Y-%m-%d").date()

        dias_diferenca = (data_proximo - hoje).days

        if dias_diferenca < 0:
            return {
                "status": "ATRASADO",
                "dias_atraso": abs(dias_diferenca),
                "proximo_vencimento": data_proximo
            }
        elif dias_diferenca <= 7:
            return {
                "status": "VENCENDO",
                "dias_atraso": 0,
                "proximo_vencimento": data_proximo
            }
        else:
            return {
                "status": "EM_DIA",
                "dias_atraso": 0,
                "proximo_vencimento": data_proximo
            }

    except:
        return {
            "status": "ERRO_DATA",
            "dias_atraso": 0,
            "proximo_vencimento": None
        }


# ============================================================================
# 🤝 CÁLCULOS DE REUNIÃO 1X1
# ============================================================================

def calculate_reuniao_status(reuniao_data: Dict[str, Any]) -> Dict[str, Any]:
    """Calcular status da reunião 1x1"""
    if not reuniao_data:
        return {
            "status": "NUNCA_AGENDADO",
            "dias_atraso": 0,
            "frequencia": "MENSAL"
        }

    hoje = date.today()
    data_proximo = reuniao_data.get("data_proximo")
    frequencia = reuniao_data.get("frequencia", "MENSAL")

    if not data_proximo:
        return {
            "status": "NUNCA_AGENDADO",
            "dias_atraso": 0,
            "frequencia": frequencia
        }

    try:
        if isinstance(data_proximo, str):
            data_proximo = datetime.strptime(data_proximo, "%Y-%m-%d").date()

        dias_diferenca = (data_proximo - hoje).days

        if dias_diferenca < 0:
            return {
                "status": "ATRASADO",
                "dias_atraso": abs(dias_diferenca),
                "frequencia": frequencia
            }
        elif dias_diferenca <= 3:
            return {
                "status": "VENCENDO",
                "dias_atraso": 0,
                "frequencia": frequencia
            }
        else:
            return {
                "status": "EM_DIA",
                "dias_atraso": 0,
                "frequencia": frequencia
            }

    except:
        return {
            "status": "ERRO_DATA",
            "dias_atraso": 0,
            "frequencia": frequencia
        }


# ============================================================================
# 🎯 FUNÇÕES DE INICIALIZAÇÃO
# ============================================================================

def init_management_fields_for_employee(employee_data: Dict[str, Any]) -> Dict[str, Any]:
    """Inicializar campos de gestão para um funcionário"""

    # Calcular mês do aniversário
    mes_aniversario = 1
    data_nascimento = employee_data.get('data_nascimento')
    if data_nascimento:
        try:
            if isinstance(data_nascimento, str):
                mes_aniversario = datetime.strptime(data_nascimento, '%Y-%m-%d').month
            else:
                mes_aniversario = data_nascimento.month
        except:
            mes_aniversario = 1

    # Definir campos padrão se não existirem
    defaults = {
        'ferias': {
            "dias_disponivel": 30,
            "dias_utilizados": 0,
            "pode_vender": 10,
            "status": "SEM_DIREITO",
            "ultimo_periodo": None,
            "proximo_periodo": None,
            "historico": [],
            "ferias_vencidas": 0
        },
        'dayoff': {
            "mes_aniversario": mes_aniversario,
            "usado_ano_atual": False,
            "data_usado": None,
            "data_proximo": None,  # Será calculado
            "status": "DISPONIVEL",
            "historico": []
        },
        'pdi': {
            "data_ultimo": None,
            "data_atual": None,
            "data_proximo": None,
            "status": "NUNCA_AGENDADO",
            "objetivos": [],
            "progresso": 0,
            "observacoes": "",
            "checks": [],
            "historico": []
        },
        'reunioes_1x1': {
            "data_ultimo": None,
            "data_atual": None,
            "data_proximo": None,
            "status": "NUNCA_AGENDADO",
            "frequencia": "MENSAL",
            "historico": []
        }
    }

    # Aplicar defaults apenas se não existirem
    for field, default_value in defaults.items():
        if field not in employee_data or not employee_data[field]:
            employee_data[field] = default_value

    return employee_data


# ============================================================================
# 🔍 FUNÇÕES DE BUSCA E FILTROS
# ============================================================================

def filter_employees_by_criteria(
        employees: List[Dict],
        status: Optional[str] = None,
        equipe: Optional[str] = None,
        nivel: Optional[str] = None,
        search: Optional[str] = None
) -> List[Dict]:
    """Filtrar funcionários por critérios"""

    filtered = employees

    if status:
        filtered = [emp for emp in filtered if emp.get("status") == status]

    if equipe:
        filtered = [emp for emp in filtered if emp.get("equipe") == equipe]

    if nivel:
        filtered = [emp for emp in filtered if emp.get("nivel") == nivel]

    if search:
        search_lower = search.lower()
        filtered = [
            emp for emp in filtered
            if (search_lower in emp.get("nome", "").lower() or
                search_lower in emp.get("email", "").lower() or
                search_lower in emp.get("cargo", "").lower())
        ]

    return filtered


def get_employees_needing_attention(employees: List[Dict]) -> Dict[str, List[Dict]]:
    """Obter funcionários que precisam de atenção"""
    hoje = date.today()

    result = {
        "pdi_atrasado": [],
        "reuniao_atrasada": [],
        "ferias_vencidas": [],
        "aniversariantes": []
    }

    for emp in employees:
        # PDI atrasado
        pdi_status = calculate_pdi_status(emp.get("pdi", {}))
        if pdi_status["status"] == "ATRASADO":
            result["pdi_atrasado"].append({
                "id": emp.get("id"),
                "nome": emp.get("nome"),
                "dias_atraso": pdi_status["dias_atraso"]
            })

        # Reunião atrasada
        reuniao_status = calculate_reuniao_status(emp.get("reunioes_1x1", {}))
        if reuniao_status["status"] == "ATRASADO":
            result["reuniao_atrasada"].append({
                "id": emp.get("id"),
                "nome": emp.get("nome"),
                "dias_atraso": reuniao_status["dias_atraso"]
            })

        # Férias vencidas
        ferias = emp.get("ferias", {})
        if isinstance(ferias, str):
            try:
                ferias = json.loads(ferias)
            except:
                ferias = {}

        if ferias.get("ferias_vencidas", 0) > 0:
            result["ferias_vencidas"].append({
                "id": emp.get("id"),
                "nome": emp.get("nome"),
                "dias_vencidos": ferias["ferias_vencidas"]
            })

        # Aniversariantes do mês
        data_nasc = emp.get("data_nascimento")
        if data_nasc:
            try:
                if isinstance(data_nasc, str):
                    data_nasc = datetime.strptime(data_nasc, "%Y-%m-%d").date()
                if data_nasc.month == hoje.month:
                    result["aniversariantes"].append({
                        "id": emp.get("id"),
                        "nome": emp.get("nome"),
                        "dia": data_nasc.day
                    })
            except:
                pass

    return result
