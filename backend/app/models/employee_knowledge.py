from sqlalchemy import Column, Integer, String, Date, ForeignKey, Text, DateTime, Boolean, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class EmployeeKnowledge(Base):
    __tablename__ = "employee_knowledge"

    # ============================================================================
    # 🏷️ CAMPOS PRINCIPAIS
    # ============================================================================
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    learning_item_id = Column(Integer, ForeignKey("knowledge.id"), nullable=False)

    # ============================================================================
    # 📊 STATUS E PRIORIDADE
    # ============================================================================
    status = Column(String(20), default="DESEJADO")  # DESEJADO, EM_PROGRESSO, OBTIDO, EXPIRADO, OBRIGATORIO
    prioridade = Column(String(20), default="MEDIA")  # ALTA, MEDIA, BAIXA
    progresso = Column(Float, default=0.0)  # 0.0 a 100.0 (%)

    # ============================================================================
    # 📅 DATAS IMPORTANTES
    # ============================================================================
    data_obtencao = Column(Date, nullable=True)
    data_expiracao = Column(Date, nullable=True)
    data_alvo = Column(Date, nullable=True)  # Meta para obter
    data_inicio = Column(Date, nullable=True)  # Quando começou o estudo

    # ============================================================================
    # 📄 DOCUMENTAÇÃO E CERTIFICADOS
    # ============================================================================
    anexo_path = Column(Text, nullable=True)  # Path do arquivo ou base64
    anexo_nome = Column(String(255), nullable=True)  # Nome original do arquivo
    anexo_tipo = Column(String(50), nullable=True)  # pdf, jpg, png, etc

    # ============================================================================
    # 💰 INFORMAÇÕES FINANCEIRAS
    # ============================================================================
    valor_investido = Column(Float, nullable=True)  # Quanto custou
    reembolsavel = Column(Boolean, default=False)  # Empresa reembolsa?
    reembolsado = Column(Boolean, default=False)  # Já foi reembolsado?

    # ============================================================================
    # 📝 OBSERVAÇÕES E NOTAS
    # ============================================================================
    observacoes = Column(Text, nullable=True)
    notas_gestor = Column(Text, nullable=True)  # Observações do gestor
    nota_avaliacao = Column(Float, nullable=True)  # Nota do funcionário (1-10)

    # ============================================================================
    # 📅 TIMESTAMPS
    # ============================================================================
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # ============================================================================
    # 🔗 RELACIONAMENTOS SQLALCHEMY
    # ============================================================================
    # employee = relationship("Employee", back_populates="knowledge_links")
    # knowledge = relationship("Knowledge", back_populates="employee_links")

    def __repr__(self):
        return f"<EmployeeKnowledge(id={self.id}, employee_id={self.employee_id}, knowledge_id={self.learning_item_id}, status='{self.status}')>"

    def to_dict(self):
        return {
            "id": self.id,
            "employee_id": self.employee_id,
            "learning_item_id": self.learning_item_id,
            "status": self.status,
            "prioridade": self.prioridade,
            "progresso": self.progresso,
            "data_obtencao": self.data_obtencao.isoformat() if self.data_obtencao else None,
            "data_expiracao": self.data_expiracao.isoformat() if self.data_expiracao else None,
            "data_alvo": self.data_alvo.isoformat() if self.data_alvo else None,
            "data_inicio": self.data_inicio.isoformat() if self.data_inicio else None,
            "anexo_path": self.anexo_path,
            "anexo_nome": self.anexo_nome,
            "anexo_tipo": self.anexo_tipo,
            "valor_investido": self.valor_investido,
            "reembolsavel": self.reembolsavel,
            "reembolsado": self.reembolsado,
            "observacoes": self.observacoes,
            "notas_gestor": self.notas_gestor,
            "nota_avaliacao": self.nota_avaliacao,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
