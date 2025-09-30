from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app.models.user import User
from app.models import Base
from passlib.context import CryptContext

# Criar tabelas
Base.metadata.create_all(bind=engine)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def create_admin_user():
    db = SessionLocal()

    try:
        # Verificar se admin já existe
        existing_admin = db.query(User).filter(User.username == "admin").first()
        if existing_admin:
            print("✅ Usuário admin já existe!")
            return

        # Criar usuário admin
        hashed_password = pwd_context.hash("admin123")
        admin_user = User(
            username="admin",
            email="admin@gestao360.com",
            hashed_password=hashed_password,
            role="admin",
            is_active=True
        )

        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)

        print("✅ Usuário admin criado com sucesso!")
        print("Username: admin")
        print("Password: admin123")

    except Exception as e:
        print(f"❌ Erro ao criar admin: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    create_admin_user()
