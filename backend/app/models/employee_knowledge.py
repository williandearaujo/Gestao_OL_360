from sqlalchemy import Column, Integer, String, Date, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from .employee import Base

class EmployeeKnowledge(Base):
    __tablename__ = "employee_knowledge"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    knowledge_id = Column(Integer, ForeignKey("knowledge.id"), nullable=False)
    
    # Status do conhecimento
    status = Column(String(20), default="DESEJADO")  # DESEJADO, EM_ANDAMENTO, OBTIDO, EXPIRADO
    
    # Datas
    data_obtencao = Column(Date)
    data_expiracao = Column(Date)
    data_alvo = Column(Date)  # Meta para obter
    
    # Arquivo do certificado (base64 ou path)
    certificado_arquivo = Column(Text)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacionamentos (opcional - pode adicionar depois)
    # employee = relationship("Employee", back_populates="knowledge_list")
    # knowledge = relationship("Knowledge", back_populates="employee_list")
