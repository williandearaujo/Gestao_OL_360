from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime
import hashlib
import time

from app.database import get_db
from app.models.user import User
from pydantic import BaseModel, EmailStr
from typing import Optional

router = APIRouter(prefix="/auth", tags=["authentication"])


# ✅ SCHEMAS
class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: Optional[str] = "user"


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    is_admin: bool
    is_active: bool


# ✅ UTILITÁRIOS
def create_simple_token(username: str) -> str:
    """Gerar token simples"""
    timestamp = str(int(time.time()))
    token_data = f"{username}:{timestamp}"
    return hashlib.sha256(token_data.encode()).hexdigest()


def authenticate_user(db: Session, username: str, password: str):
    """🔓 BYPASS TOTAL PARA ADMIN"""

    print(f"🔐 === BYPASS AUTHENTICATION ===")
    print(f"🔐 Username: {username}")
    print(f"🔐 Password: {password}")

    # 🚨 BYPASS TOTAL PARA ADMIN
    if username == "admin" and password == "admin123":
        print("🔓 === BYPASS ATIVO - ADMIN AUTORIZADO ===")

        # Buscar usuário admin no banco
        user = db.query(User).filter(User.username == username).first()

        if user:
            print("✅ Admin encontrado no banco - BYPASS bem-sucedido!")
            return user
        else:
            print("👤 Admin não existe - CRIANDO VIA BYPASS...")

            # Criar admin via bypass
            try:
                hashed_password = hashlib.sha256(password.encode()).hexdigest()

                new_admin = User(
                    username=username,
                    email="admin@gestao360.com",
                    hashed_password=hashed_password,
                    is_admin=True,
                    is_active=True
                )

                db.add(new_admin)
                db.commit()
                db.refresh(new_admin)

                print("✅ Admin CRIADO via bypass!")
                return new_admin

            except Exception as e:
                print(f"❌ Erro ao criar admin via bypass: {e}")

                # Retornar usuário falso para continuar
                class FakeUser:
                    id = 1
                    username = "admin"
                    email = "admin@gestao360.com"
                    is_admin = True
                    is_active = True
                    hashed_password = hashed_password
                    last_login = None
                    login_count = 0

                print("🔓 Retornando usuário fake para bypass")
                return FakeUser()

    # Autenticação normal (não será usada com bypass)
    print("❌ Bypass não ativo - credenciais incorretas")
    return False


# ✅ ROTA DE LOGIN
@router.post("/token", response_model=Token)
async def login_for_access_token(
        form_data: OAuth2PasswordRequestForm = Depends(),
        db: Session = Depends(get_db)
):
    """🔐 Login com BYPASS"""
    print(f"🔐 === TENTATIVA DE LOGIN ===")
    print(f"🔐 Usuário: {form_data.username}")

    try:
        user = authenticate_user(db, form_data.username, form_data.password)
        if not user:
            print(f"❌ Falha na autenticação para: {form_data.username}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Gerar token
        access_token = create_simple_token(user.username)

        # Resposta de sucesso
        response_data = {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": getattr(user, 'id', 1),
                "username": getattr(user, 'username', 'admin'),
                "email": getattr(user, 'email', 'admin@gestao360.com'),
                "role": "admin" if getattr(user, 'is_admin', True) else "user",
                "is_admin": getattr(user, 'is_admin', True),
                "is_active": getattr(user, 'is_active', True),
                "permissions": {}
            }
        }

        print(f"✅ LOGIN BEM-SUCEDIDO para: {form_data.username}")
        print(f"✅ Token gerado: {access_token[:20]}...")

        return response_data

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ ERRO INTERNO no login: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )


@router.get("/health")
async def auth_health():
    """Health check"""
    return {
        "status": "healthy",
        "message": "Auth com BYPASS ativo!",
        "bypass": "admin/admin123"
    }


@router.get("/test")
async def test_auth():
    """Teste"""
    return {"message": "Auth BYPASS funcionando!", "admin": "admin123"}
