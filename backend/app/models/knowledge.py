from sqlalchemy import Column, Integer, String, Float, Text, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Knowledge(Base):
    __tablename__ = "knowledge"

    # ============================================================================
    # 🏷️ CAMPOS PRINCIPAIS
    # ============================================================================
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(255), nullable=False)
    codigo = Column(String(50), nullable=True, unique=True)  # Código único
    tipo = Column(String(50), nullable=False, default="CERTIFICACAO")  # CERTIFICACAO, FORMACAO, CURSO

    # ============================================================================
    # 🏢 MAPEAMENTO DUPLO (FRONTEND/BACKEND COMPATIBILIDADE)
    # ============================================================================
    categoria = Column(String(100), nullable=False)  # backend
    area = Column(String(100), nullable=True)  # frontend

    fornecedor = Column(String(100), nullable=True)  # backend
    vendor = Column(String(100), nullable=True)  # frontend

    # ============================================================================
    # ⏰ CAMPOS DE VALIDADE
    # ============================================================================
    validade_anos = Column(Float, nullable=True)  # backend (convertido)
    validade_meses = Column(Integer, nullable=True)  # frontend

    # ============================================================================
    # 🎓 CAMPOS ESPECÍFICOS POR TIPO
    # ============================================================================
    # Para FORMACAO
    nivel_formacao = Column(String(50), nullable=True)  # TECNICO, SUPERIOR, POS_GRADUACAO, MESTRADO, DOUTORADO

    # Para CURSO
    nivel = Column(String(50), nullable=True)  # BASICO, INTERMEDIARIO, AVANCADO
    modalidade = Column(String(50), nullable=True)  # PRESENCIAL, EAD, HIBRIDO
    preco = Column(Float, nullable=True)
    carga_horaria = Column(Integer, nullable=True)  # Em horas

    # ============================================================================
    # 📝 CAMPOS GERAIS
    # ============================================================================
    descricao = Column(Text, nullable=True)
    link = Column(String(500), nullable=True)  # URL do curso/certificação
    pre_requisitos = Column(Text, nullable=True)

    # ============================================================================
    # 🏷️ TAGS E CATEGORIZAÇÃO
    # ============================================================================
    tags = Column(String(500), nullable=True)  # "python,flask,api,backend"
    dificuldade = Column(String(20), default="MEDIO")  # FACIL, MEDIO, DIFICIL

    # ============================================================================
    # 📊 CAMPOS DE GESTÃO
    # ============================================================================
    ativo = Column(Boolean, default=True)
    popular = Column(Boolean, default=False)  # Destacar na interface
    obrigatorio = Column(Boolean, default=False)  # Obrigatório para certas funções

    # ============================================================================
    # 📅 TIMESTAMPS
    # ============================================================================
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # ============================================================================
    # 🔗 RELACIONAMENTOS SQLALCHEMY
    # ============================================================================
    # employee_links = relationship("EmployeeKnowledge", back_populates="knowledge")

    def __repr__(self):
        return f"<Knowledge(id={self.id}, nome='{self.nome}', tipo='{self.tipo}')>"

    def to_dict(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "codigo": self.codigo,
            "tipo": self.tipo,
            "categoria": self.categoria,
            "area": self.area,
            "fornecedor": self.fornecedor,
            "vendor": self.vendor,
            "validade_anos": self.validade_anos,
            "validade_meses": self.validade_meses,
            "nivel_formacao": self.nivel_formacao,
            "nivel": self.nivel,
            "modalidade": self.modalidade,
            "preco": self.preco,
            "carga_horaria": self.carga_horaria,
            "descricao": self.descricao,
            "link": self.link,
            "pre_requisitos": self.pre_requisitos,
            "tags": self.tags,
            "dificuldade": self.dificuldade,
            "ativo": self.ativo,
            "popular": self.popular,
            "obrigatorio": self.obrigatorio,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
