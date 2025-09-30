from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Area(Base):
    __tablename__ = "areas"

    # ============================================================================
    # 🏷️ CAMPOS PRINCIPAIS
    # ============================================================================
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    sigla = Column(String(10), nullable=False, unique=True)
    descricao = Column(Text, nullable=True)

    # ============================================================================
    # 🎨 CAMPOS DE INTERFACE
    # ============================================================================
    cor = Column(String(7), default="#3B82F6")  # Cor hex
    icone = Column(String(50), nullable=True)  # Nome do ícone

    # ============================================================================
    # 🔗 RELACIONAMENTOS
    # ============================================================================
    diretor_id = Column(Integer, ForeignKey("managers.id"), nullable=True)

    # ============================================================================
    # 📊 CAMPOS DE GESTÃO
    # ============================================================================
    ativa = Column(Boolean, default=True)
    prioridade = Column(Integer, default=1)  # 1=Alta, 2=Média, 3=Baixa

    # ============================================================================
    # 📅 TIMESTAMPS
    # ============================================================================
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # ============================================================================
    # 🔗 RELACIONAMENTOS SQLALCHEMY
    # ============================================================================
    # employees = relationship("Employee", back_populates="area")
    # teams = relationship("Team", back_populates="area")
    # managers = relationship("Manager", back_populates="area")
    # diretor = relationship("Manager", foreign_keys=[diretor_id])

    def __repr__(self):
        return f"<Area(id={self.id}, nome='{self.nome}', sigla='{self.sigla}')>"

    def to_dict(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "sigla": self.sigla,
            "descricao": self.descricao,
            "cor": self.cor,
            "icone": self.icone,
            "diretor_id": self.diretor_id,
            "ativa": self.ativa,
            "prioridade": self.prioridade,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
