from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Team(Base):
    __tablename__ = "teams"

    # ============================================================================
    # 🏷️ CAMPOS PRINCIPAIS
    # ============================================================================
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False, unique=True)
    descricao = Column(Text, nullable=True)

    # ============================================================================
    # 🎨 CAMPOS DE INTERFACE
    # ============================================================================
    cor = Column(String(7), default="#3B82F6")  # Cor hex para UI
    icone = Column(String(50), nullable=True)  # Nome do ícone

    # ============================================================================
    # 🔗 RELACIONAMENTOS
    # ============================================================================
    area_id = Column(Integer, ForeignKey("areas.id"), nullable=True)
    manager_id = Column(Integer, ForeignKey("managers.id"), nullable=True)

    # ============================================================================
    # 📊 CAMPOS DE GESTÃO
    # ============================================================================
    meta_membros = Column(Integer, default=5)  # Meta de membros no time
    ativo = Column(Boolean, default=True)

    # ============================================================================
    # 📅 TIMESTAMPS
    # ============================================================================
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # ============================================================================
    # 🔗 RELACIONAMENTOS SQLALCHEMY
    # ============================================================================
    # employees = relationship("Employee", back_populates="team")
    # area = relationship("Area", back_populates="teams")
    # manager = relationship("Manager", back_populates="teams")

    def __repr__(self):
        return f"<Team(id={self.id}, nome='{self.nome}', ativo={self.ativo})>"

    def to_dict(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "descricao": self.descricao,
            "cor": self.cor,
            "icone": self.icone,
            "area_id": self.area_id,
            "manager_id": self.manager_id,
            "meta_membros": self.meta_membros,
            "ativo": self.ativo,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
