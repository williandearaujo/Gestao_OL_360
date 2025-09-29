from sqlalchemy import Column, Integer, String, Float, Date, DateTime, Boolean, Text, JSON, ForeignKey
from datetime import datetime
from app.database import Base

class Employee(Base):
    __tablename__ = "employees"
    
    # Dados básicos
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    telefone = Column(String(20))
    cpf = Column(String(14), unique=True, nullable=False)
    rg = Column(String(12))
    data_nascimento = Column(Date, nullable=False)
    estado_civil = Column(String(20), default="SOLTEIRO")

    # Dados profissionais
    cargo = Column(String(100), nullable=False)
    equipe = Column(String(100), nullable=False)
    nivel = Column(String(20), default="JUNIOR")
    status = Column(String(20), default="ATIVO")
    data_admissao = Column(Date, nullable=False)
    salario = Column(Float, nullable=False)
    team_id = Column(Integer, nullable=True)
    manager_id = Column(Integer, nullable=True)
    
    # Campos JSON estruturados
    endereco = Column(JSON)
    competencias = Column(JSON)
    avatar = Column(Text)
    pdi = Column(JSON)
    reunioes_1x1 = Column(JSON)
    ferias = Column(JSON)
    dayoff = Column(JSON)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


# Relacionamentos (adicione no final da classe)
# team = relationship("Team")
# manager = relationship("Manager")