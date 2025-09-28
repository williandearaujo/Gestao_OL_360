from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from .employee import Base

class Knowledge(Base):
    __tablename__ = "knowledge"
    
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(255), nullable=False)
    categoria = Column(String(100), nullable=False)  # Governança, Ethical Hacking, Fundamentos, etc.
    fornecedor = Column(String(100))  # ISC², EC-Council, CompTIA, SANS, etc.
    tipo = Column(String(50), default="CERTIFICACAO")  # CERTIFICACAO, CURSO, FORMACAO
    validade_anos = Column(Integer, default=3)
    descricao = Column(Text)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacionamentos (opcional - pode adicionar depois)
    # employee_list = relationship("EmployeeKnowledge", back_populates="knowledge")
