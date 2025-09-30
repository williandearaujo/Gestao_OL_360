from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import JWTError, jwt
from typing import Optional, Dict, Any
from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
import hashlib
import secrets
import logging

# Configurar logging
logger = logging.getLogger(__name__)

# ============================================================================
# 🔐 CONFIGURAÇÕES DE SEGURANÇA
# ============================================================================

# Configuração do password context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Configurações JWT
SECRET_KEY = "gestao360-sua-chave-secreta-aqui-mude-em-producao-2024"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 480  # 8 horas
REFRESH_TOKEN_EXPIRE_DAYS = 7

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="auth/token",
    auto_error=False  # Permite autenticação opcional
)


# ============================================================================
# 🔒 FUNÇÕES DE HASH E VERIFICAÇÃO
# ============================================================================

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verificar se a senha plain confere com a hash"""
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception as e:
        logger.warning(f"Erro na verificação de senha: {e}")
        # Fallback para desenvolvimento
        try:
            simple_hash = hashlib.sha256(plain_password.encode()).hexdigest()
            return hashed_password == simple_hash
        except:
            return False


def get_password_hash(password: str) -> str:
    """Gerar hash da senha"""
    try:
        return pwd_context.hash(password)
    except Exception as e:
        logger.warning(f"Erro ao gerar hash: {e}")
        # Fallback para desenvolvimento
        return hashlib.sha256(password.encode()).hexdigest()


def generate_secure_token() -> str:
    """Gerar token seguro"""
    return secrets.token_urlsafe(32)


# ============================================================================
# 🎫 FUNÇÕES DE JWT TOKEN
# ============================================================================

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Criar JWT access token"""
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({
        "exp": expire,
        "type": "access",
        "iat": datetime.utcnow()
    })

    try:
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
    except Exception as e:
        logger.error(f"Erro ao criar access token: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro interno ao gerar token"
        )


def create_refresh_token(data: dict) -> str:
    """Criar JWT refresh token"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)

    to_encode.update({
        "exp": expire,
        "type": "refresh",
        "iat": datetime.utcnow()
    })

    try:
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
    except Exception as e:
        logger.error(f"Erro ao criar refresh token: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro interno ao gerar token"
        )


def verify_token(token: str, token_type: str = "access") -> Optional[Dict[str, Any]]:
    """Verificar JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        # Verificar tipo do token
        if payload.get("type") != token_type:
            return None

        # Verificar expiração
        exp = payload.get("exp")
        if exp and datetime.utcnow() > datetime.fromtimestamp(exp):
            return None

        return payload

    except JWTError as e:
        logger.warning(f"Erro na verificação do token: {e}")
        return None
    except Exception as e:
        logger.error(f"Erro inesperado na verificação do token: {e}")
        return None


def decode_token(token: str) -> Optional[str]:
    """Decodificar token e retornar username"""
    payload = verify_token(token)
    if payload:
        return payload.get("sub")
    return None


# ============================================================================
# 👤 FUNÇÕES DE AUTENTICAÇÃO (COM FALLBACK SQLITE)
# ============================================================================

def authenticate_user_sqlite(username: str, password: str) -> Optional[Dict[str, Any]]:
    """Autenticar usuário usando SQLite direto (fallback)"""
    import sqlite3

    try:
        conn = sqlite3.connect("gestao360.db")
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        # Verificar se tabela users existe
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='users'")
        if not cursor.fetchone():
            logger.warning("Tabela users não existe")
            return None

        # Buscar usuário
        cursor.execute("""
                       SELECT id,
                              username,
                              email,
                              hashed_password,
                              is_active,
                              is_admin,
                              permissions,
                              preferences,
                              last_login,
                              login_count
                       FROM users
                       WHERE username = ?
                          OR email = ?
                       """, (username, username))

        user_row = cursor.fetchone()
        cursor.close()
        conn.close()

        if not user_row:
            return None

        user = dict(user_row)

        # Verificar senha
        if not verify_password(password, user["hashed_password"]):
            return None

        # Verificar se usuário está ativo
        if not user.get("is_active", True):
            return None

        # Atualizar último login
        try:
            conn = sqlite3.connect("gestao360.db")
            cursor = conn.cursor()
            cursor.execute("""
                           UPDATE users
                           SET last_login  = ?,
                               login_count = login_count + 1
                           WHERE id = ?
                           """, (datetime.now().isoformat(), user["id"]))
            conn.commit()
            cursor.close()
            conn.close()
        except Exception as e:
            logger.warning(f"Erro ao atualizar último login: {e}")

        return user

    except Exception as e:
        logger.error(f"Erro na autenticação SQLite: {e}")
        return None


def authenticate_user_sqlalchemy(db, username: str, password: str) -> Optional[Any]:
    """Autenticar usuário usando SQLAlchemy"""
    try:
        from app.models.user import User

        user = db.query(User).filter(
            (User.username == username) | (User.email == username)
        ).first()

        if not user:
            return None

        if not verify_password(password, user.hashed_password):
            return None

        if not user.is_active:
            return None

        # Atualizar último login
        user.last_login = datetime.utcnow()
        user.login_count = (user.login_count or 0) + 1
        db.commit()

        return user

    except Exception as e:
        logger.error(f"Erro na autenticação SQLAlchemy: {e}")
        return None


def authenticate_user(username: str, password: str, db=None) -> Optional[Dict[str, Any]]:
    """Autenticar usuário com fallback"""

    # Tentar SQLAlchemy primeiro se db session fornecida
    if db:
        user = authenticate_user_sqlalchemy(db, username, password)
        if user:
            return {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "is_admin": user.is_admin,
                "is_active": user.is_active,
                "permissions": user.permissions or {},
                "preferences": user.preferences or {}
            }

    # Fallback para SQLite direto
    return authenticate_user_sqlite(username, password)


# ============================================================================
# 🛡️ DEPENDENCIES DE AUTENTICAÇÃO
# ============================================================================

def get_current_user_payload(token: Optional[str] = Depends(oauth2_scheme)) -> Optional[Dict[str, Any]]:
    """Obter payload do usuário atual (opcional)"""
    if not token:
        return None

    payload = verify_token(token)
    return payload


def get_current_user_required(token: str = Depends(oauth2_scheme)) -> Dict[str, Any]:
    """Obter usuário atual (obrigatório)"""
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token de acesso necessário",
            headers={"WWW-Authenticate": "Bearer"},
        )

    payload = verify_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido ou expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return payload


def require_admin(current_user: Dict[str, Any] = Depends(get_current_user_required)) -> Dict[str, Any]:
    """Exigir que o usuário seja admin"""
    if not current_user.get("is_admin", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permissões administrativas necessárias"
        )

    return current_user


def require_permission(permission: str):
    """Factory para exigir permissão específica"""

    def check_permission(current_user: Dict[str, Any] = Depends(get_current_user_required)) -> Dict[str, Any]:
        permissions = current_user.get("permissions", {})

        if not permissions.get(permission, {}).get("read", False):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Permissão '{permission}' necessária"
            )

        return current_user

    return check_permission


def optional_auth(token: Optional[str] = Depends(oauth2_scheme)) -> Optional[Dict[str, Any]]:
    """Autenticação opcional - pode ou não ter token"""
    if not token:
        return None

    return verify_token(token)


# ============================================================================
# 🔑 FUNÇÕES DE GESTÃO DE USUÁRIOS
# ============================================================================

def create_user_sqlite(user_data: Dict[str, Any]) -> Optional[int]:
    """Criar usuário no SQLite"""
    try:
        import sqlite3

        conn = sqlite3.connect("gestao360.db")
        cursor = conn.cursor()

        # Verificar se tabela existe
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='users'")
        if not cursor.fetchone():
            # Criar tabela users básica
            cursor.execute("""
                           CREATE TABLE users
                           (
                               id              INTEGER PRIMARY KEY AUTOINCREMENT,
                               username        TEXT UNIQUE NOT NULL,
                               email           TEXT UNIQUE NOT NULL,
                               hashed_password TEXT        NOT NULL,
                               is_active       BOOLEAN DEFAULT 1,
                               is_admin        BOOLEAN DEFAULT 0,
                               permissions     TEXT    DEFAULT '{}',
                               preferences     TEXT    DEFAULT '{}',
                               last_login      TEXT,
                               login_count     INTEGER DEFAULT 0,
                               created_at      TEXT    DEFAULT CURRENT_TIMESTAMP,
                               updated_at      TEXT    DEFAULT CURRENT_TIMESTAMP
                           )
                           """)

        # Inserir usuário
        cursor.execute("""
                       INSERT INTO users (username, email, hashed_password, is_active, is_admin, permissions,
                                          preferences)
                       VALUES (?, ?, ?, ?, ?, ?, ?)
                       """, (
                           user_data["username"],
                           user_data["email"],
                           get_password_hash(user_data["password"]),
                           user_data.get("is_active", True),
                           user_data.get("is_admin", False),
                           json.dumps(user_data.get("permissions", {})),
                           json.dumps(user_data.get("preferences", {}))
                       ))

        user_id = cursor.lastrowid
        conn.commit()
        cursor.close()
        conn.close()

        return user_id

    except Exception as e:
        logger.error(f"Erro ao criar usuário SQLite: {e}")
        return None


def validate_password_strength(password: str) -> Dict[str, Any]:
    """Validar força da senha"""
    errors = []
    score = 0

    if len(password) < 8:
        errors.append("Senha deve ter pelo menos 8 caracteres")
    else:
        score += 1

    if not any(c.isupper() for c in password):
        errors.append("Senha deve ter pelo menos uma letra maiúscula")
    else:
        score += 1

    if not any(c.islower() for c in password):
        errors.append("Senha deve ter pelo menos uma letra minúscula")
    else:
        score += 1

    if not any(c.isdigit() for c in password):
        errors.append("Senha deve ter pelo menos um número")
    else:
        score += 1

    if not any(c in "!@#$%^&*()_+-=[]{}|;:,.<>?" for c in password):
        errors.append("Senha deve ter pelo menos um caractere especial")
    else:
        score += 1

    strength_levels = ["Muito Fraca", "Fraca", "Regular", "Boa", "Forte", "Muito Forte"]
    strength = strength_levels[min(score, 5)]

    return {
        "valid": len(errors) == 0,
        "errors": errors,
        "strength": strength,
        "score": score
    }


# ============================================================================
# 🎯 UTILITÁRIOS DE SESSÃO
# ============================================================================

def create_session_data(user: Dict[str, Any]) -> Dict[str, Any]:
    """Criar dados de sessão"""
    return {
        "sub": user["username"],
        "user_id": user["id"],
        "email": user["email"],
        "is_admin": user.get("is_admin", False),
        "permissions": user.get("permissions", {}),
        "session_id": generate_secure_token()
    }


def refresh_access_token(refresh_token: str) -> Optional[str]:
    """Renovar access token usando refresh token"""
    payload = verify_token(refresh_token, "refresh")
    if not payload:
        return None

    # Criar novo access token
    new_payload = {
        "sub": payload["sub"],
        "user_id": payload["user_id"],
        "email": payload["email"],
        "is_admin": payload.get("is_admin", False)
    }

    return create_access_token(new_payload)
