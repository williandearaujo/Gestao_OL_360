from sqlalchemy import Column, Integer, String, Boolean, DateTime, JSON
from passlib.context import CryptContext
import hashlib
from datetime import datetime
from .employee import Base

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    
    permissions = Column(JSON)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def verify_password(self, plain_password: str) -> bool:
        try:
            return pwd_context.verify(plain_password, self.hashed_password)
        except:
            # Fallback para desenvolvimento
            simple_hash = hashlib.sha256(plain_password.encode()).hexdigest()
            return self.hashed_password == simple_hash
    
    @classmethod
    def get_password_hash(cls, password: str) -> str:
        try:
            return pwd_context.hash(password)
        except:
            # Fallback para desenvolvimento
            return hashlib.sha256(password.encode()).hexdigest()
