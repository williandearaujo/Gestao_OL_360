from sqlalchemy import Column, Integer, String, Boolean, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from passlib.context import CryptContext
import hashlib
from app.database import Base

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class User(Base):
    __tablename__ = "users"

    # ============================================================================
    # 🏷️ CAMPOS PRINCIPAIS
    # ============================================================================
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)

    # ============================================================================
    # 👤 INFORMAÇÕES PESSOAIS
    # ============================================================================
    nome_completo = Column(String(255), nullable=True)
    avatar = Column(String(500), nullable=True)

    # ============================================================================
    # 🔐 CONTROLE DE ACESSO
    # ============================================================================
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    is_superuser = Column(Boolean, default=False)

    # ============================================================================
    # 🔗 RELACIONAMENTOS
    # ============================================================================
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=True)
    manager_id = Column(Integer, ForeignKey("managers.id"), nullable=True)

    # ============================================================================
    # 🛡️ PERMISSÕES E CONFIGURAÇÕES
    # ============================================================================
    permissions = Column(JSON, default=lambda: {
        "employees": {"read": True, "write": False, "delete": False},
        "teams": {"read": True, "write": False, "delete": False},
        "managers": {"read": True, "write": False, "delete": False},
        "knowledge": {"read": True, "write": False, "delete": False},
        "areas": {"read": True, "write": False, "delete": False},
        "admin": {"read": False, "write": False, "delete": False}
    })

    preferences = Column(JSON, default=lambda: {
        "theme": "light",
        "language": "pt-BR",
        "notifications": True,
        "email_notifications": True
    })

    # ============================================================================
    # 📊 CAMPOS DE AUDITORIA
    # ============================================================================
    last_login = Column(DateTime(timezone=True), nullable=True)
    login_count = Column(Integer, default=0)

    # ============================================================================
    # 📅 TIMESTAMPS
    # ============================================================================
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # ============================================================================
    # 🔗 RELACIONAMENTOS SQLALCHEMY
    # ============================================================================
    # employee = relationship("Employee", back_populates="user")
    # manager = relationship("Manager", back_populates="user")

    def verify_password(self, plain_password: str) -> bool:
        """Verificar senha com fallback"""
        try:
            return pwd_context.verify(plain_password, self.hashed_password)
        except:
            # Fallback para desenvolvimento
            simple_hash = hashlib.sha256(plain_password.encode()).hexdigest()
            return self.hashed_password == simple_hash

    @classmethod
    def get_password_hash(cls, password: str) -> str:
        """Gerar hash da senha com fallback"""
        try:
            return pwd_context.hash(password)
        except:
            # Fallback para desenvolvimento
            return hashlib.sha256(password.encode()).hexdigest()

    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}', email='{self.email}')>"

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "nome_completo": self.nome_completo,
            "avatar": self.avatar,
            "is_active": self.is_active,
            "is_admin": self.is_admin,
            "is_superuser": self.is_superuser,
            "employee_id": self.employee_id,
            "manager_id": self.manager_id,
            "permissions": self.permissions or {},
            "preferences": self.preferences or {},
            "last_login": self.last_login.isoformat() if self.last_login else None,
            "login_count": self.login_count,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
