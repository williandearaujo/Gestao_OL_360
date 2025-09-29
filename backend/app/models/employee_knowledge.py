from sqlalchemy import Column, Integer, String, Date, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class EmployeeKnowledge(Base):
    __tablename__ = "employee_knowledge"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    learning_item_id = Column(Integer, ForeignKey("knowledge.id"), nullable=False)  # ✅ CORRIGIDO

    # Status do conhecimento
    status = Column(String(20), default="DESEJADO")  # DESEJADO, OBTIDO, OBRIGATÓRIO
    prioridade = Column(String(20), default="MEDIA")  # ALTA, MEDIA, BAIXA

    # Datas
    data_obtencao = Column(Date, nullable=True)
    data_expiracao = Column(Date, nullable=True)
    data_alvo = Column(Date, nullable=True)  # Meta para obter

    # Arquivo do certificado
    anexo_path = Column(Text, nullable=True)  # Path ou base64
    observacoes = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relacionamentos (opcional)
    # employee = relationship("Employee", back_populates="knowledge_links")
    # knowledge = relationship("Knowledge", back_populates="employee_links")
