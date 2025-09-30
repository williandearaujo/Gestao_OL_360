from sqlalchemy import Column, Integer, String, Float, Date, DateTime, Text, ForeignKey, JSON, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Employee(Base):
    __tablename__ = "employees"

    # ============================================================================
    # 🏷️ CAMPOS PRINCIPAIS
    # ============================================================================
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(255), nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    telefone = Column(String(20), nullable=True)
    cpf = Column(String(14), unique=True, nullable=True)
    rg = Column(String(20), nullable=True)
    data_nascimento = Column(Date, nullable=True)
    estado_civil = Column(String(20), default="SOLTEIRO")
    cargo = Column(String(100), nullable=False)
    equipe = Column(String(100), nullable=True)
    nivel = Column(String(20), default="JUNIOR")  # ESTAGIARIO, JUNIOR, PLENO, SENIOR, DIRETOR
    status = Column(String(20), default="ATIVO")  # ATIVO, INATIVO, FERIAS, AFASTADO, DEMITIDO

    # ============================================================================
    # 💼 CAMPOS EMPRESARIAIS
    # ============================================================================
    data_admissao = Column(Date, nullable=True)
    salario = Column(Float, nullable=True)
    access_level = Column(String(20), default="COLABORADOR")  # COLABORADOR, COORDENADOR, GERENTE, DIRETOR, ADMIN

    # ============================================================================
    # 🔗 RELACIONAMENTOS (FOREIGN KEYS)
    # ============================================================================
    manager_id = Column(Integer, ForeignKey("managers.id"), nullable=True)
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=True)
    area_id = Column(Integer, ForeignKey("areas.id"), nullable=True)

    # ============================================================================
    # 📋 CAMPOS JSON ESTRUTURADOS
    # ============================================================================
    endereco = Column(JSON, default=lambda: {
        "cep": "",
        "rua": "",
        "numero": "",
        "complemento": "",
        "bairro": "",
        "cidade": "",
        "estado": "",
        "pais": "Brasil"
    })

    competencias = Column(JSON, default=lambda: [])

    # ============================================================================
    # 🎯 CAMPOS DE GESTÃO EMPRESARIAL (JSON)
    # ============================================================================
    ferias = Column(JSON, default=lambda: {
        "dias_disponivel": 30,
        "dias_utilizados": 0,
        "dias_vencidos": 0,
        "pode_vender": 10,
        "status": "EM_DIA",
        "proximo_periodo": {
            "inicio": None,
            "fim": None,
            "dias": 0,
            "aprovado": False
        },
        "historico": []
    })

    dayoff = Column(JSON, default=lambda: {
        "mes_aniversario": 1,
        "usado_ano_atual": False,
        "data_ultimo": None,
        "data_atual": None,
        "data_proximo": None,
        "status": "DISPONIVEL",
        "historico": []
    })

    pdi = Column(JSON, default=lambda: {
        "status": "PENDENTE",
        "data_ultimo": None,
        "data_atual": None,
        "data_proximo": None,
        "objetivos": [],
        "progresso": 0,
        "observacoes": ""
    })

    reunioes_1x1 = Column(JSON, default=lambda: {
        "status": "PENDENTE",
        "data_ultimo": None,
        "data_atual": None,
        "data_proximo": None,
        "frequencia": "MENSAL",
        "historico": []
    })

    # ============================================================================
    # 📝 CAMPOS DE TEXTO E OBSERVAÇÕES
    # ============================================================================
    avatar = Column(String(500), nullable=True)  # URL ou path da foto
    observacoes = Column(Text, default="")
    notas_admin = Column(Text, default="")

    # ============================================================================
    # 📅 TIMESTAMPS
    # ============================================================================
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # ============================================================================
    # 🔗 RELACIONAMENTOS SQLALCHEMY (OPCIONAL)
    # ============================================================================
    # manager = relationship("Manager", back_populates="employees")
    # team = relationship("Team", back_populates="employees")
    # area = relationship("Area", back_populates="employees")
    # knowledge_links = relationship("EmployeeKnowledge", back_populates="employee")

    def __repr__(self):
        return f"<Employee(id={self.id}, nome='{self.nome}', email='{self.email}', status='{self.status}')>"

    def to_dict(self):
        """Converter para dict para JSON"""
        return {
            "id": self.id,
            "nome": self.nome,
            "email": self.email,
            "telefone": self.telefone,
            "cpf": self.cpf,
            "rg": self.rg,
            "data_nascimento": self.data_nascimento.isoformat() if self.data_nascimento else None,
            "estado_civil": self.estado_civil,
            "cargo": self.cargo,
            "equipe": self.equipe,
            "nivel": self.nivel,
            "status": self.status,
            "data_admissao": self.data_admissao.isoformat() if self.data_admissao else None,
            "salario": self.salario,
            "access_level": self.access_level,
            "manager_id": self.manager_id,
            "team_id": self.team_id,
            "area_id": self.area_id,
            "endereco": self.endereco or {},
            "competencias": self.competencias or [],
            "ferias": self.ferias or {},
            "dayoff": self.dayoff or {},
            "pdi": self.pdi or {},
            "reunioes_1x1": self.reunioes_1x1 or {},
            "avatar": self.avatar,
            "observacoes": self.observacoes,
            "notas_admin": self.notas_admin,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
