from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Manager(Base):
    __tablename__ = "managers"

    # ============================================================================
    # 🏷️ CAMPOS PRINCIPAIS
    # ============================================================================
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False, unique=True)
    telefone = Column(String(20), nullable=True)

    # ============================================================================
    # 💼 CAMPOS EMPRESARIAIS
    # ============================================================================
    cargo = Column(String(100), nullable=False)  # "Diretor", "Gerente", etc.
    nivel_hierarquico = Column(String(20), default="GERENTE")  # DIRETOR, GERENTE, COORDENADOR
    departamento = Column(String(100), nullable=True)

    # ============================================================================
    # 🔗 RELACIONAMENTOS
    # ============================================================================
    area_id = Column(Integer, ForeignKey("areas.id"), nullable=True)
    user_id = Column(Integer, nullable=True)  # Para quando tiver tabela users

    # ============================================================================
    # 📝 CAMPOS AUXILIARES
    # ============================================================================
    ativo = Column(Boolean, default=True)
    observacoes = Column(Text, nullable=True)

    # ============================================================================
    # 📅 TIMESTAMPS
    # ============================================================================
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # ============================================================================
    # 🔗 RELACIONAMENTOS SQLALCHEMY
    # ============================================================================
    # employees = relationship("Employee", back_populates="manager")
    # area = relationship("Area", back_populates="managers")

    def __repr__(self):
        return f"<Manager(id={self.id}, nome='{self.nome}', cargo='{self.cargo}')>"

    def to_dict(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "email": self.email,
            "telefone": self.telefone,
            "cargo": self.cargo,
            "nivel_hierarquico": self.nivel_hierarquico,
            "departamento": self.departamento,
            "area_id": self.area_id,
            "user_id": self.user_id,
            "ativo": self.ativo,
            "observacoes": self.observacoes,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
