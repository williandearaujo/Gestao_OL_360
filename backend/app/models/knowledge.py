from sqlalchemy import Column, Integer, String, Float, Text, DateTime
from datetime import datetime
from app.database import Base


class Knowledge(Base):
    __tablename__ = "knowledge"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(255), nullable=False)
    codigo = Column(String(50), nullable=True)  # ✅ ADICIONADO!
    tipo = Column(String(50), nullable=False, default="CERTIFICACAO")

    # Mapeamento duplo frontend/backend para compatibilidade
    categoria = Column(String(100), nullable=False)  # backend
    area = Column(String(100), nullable=True)  # ✅ frontend
    fornecedor = Column(String(100), nullable=True)  # backend
    vendor = Column(String(100), nullable=True)  # ✅ frontend

    # Campos específicos por tipo
    validade_anos = Column(Float, nullable=True)  # backend (convertido)
    validade_meses = Column(Integer, nullable=True)  # ✅ frontend
    nivel_formacao = Column(String(50), nullable=True)  # FORMACAO
    nivel = Column(String(50), nullable=True)  # CURSO
    modalidade = Column(String(50), nullable=True)  # CURSO
    preco = Column(Float, nullable=True)  # CURSO

    # Campos gerais
    descricao = Column(Text, nullable=True)
    link = Column(String(500), nullable=True)  # ✅ ADICIONADO!

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
