from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Manager(Base):
    __tablename__ = "managers"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False, unique=True)
    cargo = Column(String(100), nullable=False)  # "Diretor", "Gerente", etc.
    nivel_hierarquico = Column(String(20), default="GERENTE")  # DIRETOR, GERENTE, COORDENADOR
    telefone = Column(String(20), nullable=True)
    ativo = Column(Boolean, default=True)

    # Relacionamento com user (futuro)
    user_id = Column(Integer, nullable=True)  # Para quando tiver tabela users

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
