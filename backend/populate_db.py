from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app.models.user import User
from app.models.employee import Employee
from app.models.knowledge import Knowledge
from app.models.employee_knowledge import EmployeeKnowledge
from app.utils.auth import get_password_hash
import sys


def create_initial_data():
    db = SessionLocal()

    try:
        # Verificar se já existe dados
        if db.query(User).first():
            print("⚠️  Dados já existem no banco!")
            return

        print("🚀 Criando dados iniciais...")

        # 1. Criar usuário admin
        admin_user = User(
            username="admin",
            email="admin@ol360.com",
            hashed_password=get_password_hash("admin123"),
            is_active=True,
            role="admin"
        )
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        print("✅ Usuário admin criado")

        # 2. Criar alguns funcionários
        employees_data = [
            {
                "nome": "João Silva",
                "email": "joao@ol360.com",
                "cargo": "Analista de Segurança",
                "area": "Cibersegurança",
                "nivel": "SENIOR",
                "status": "ATIVO",
                "telefone": "(11) 99999-1234",
                "cpf": "123.456.789-01"
            },
            {
                "nome": "Maria Santos",
                "email": "maria@ol360.com",
                "cargo": "Consultora SOC",
                "area": "SOC",
                "nivel": "PLENO",
                "status": "ATIVO",
                "telefone": "(11) 99999-5678",
                "cpf": "987.654.321-02"
            }
        ]

        for emp_data in employees_data:
            employee = Employee(**emp_data, user_id=admin_user.id)
            db.add(employee)

        db.commit()
        print("✅ Funcionários criados")

        # 3. Criar alguns conhecimentos
        knowledge_data = [
            {
                "nome": "CISSP",
                "tipo": "CERTIFICACAO",
                "codigo": "CISSP-001",
                "vendor": "ISC2",
                "area": "Cibersegurança",
                "validade_meses": 36
            },
            {
                "nome": "CEH",
                "tipo": "CERTIFICACAO",
                "codigo": "CEH-001",
                "vendor": "EC-Council",
                "area": "Ethical Hacking",
                "validade_meses": 36
            },
            {
                "nome": "Ciência da Computação",
                "tipo": "FORMACAO",
                "codigo": "CC-001",
                "vendor": "Universidade",
                "area": "Tecnologia",
                "nivel_formacao": "GRADUACAO"
            }
        ]

        for know_data in knowledge_data:
            knowledge = Knowledge(**know_data)
            db.add(knowledge)

        db.commit()
        print("✅ Conhecimentos criados")

        print("🎉 Dados iniciais criados com sucesso!")
        print("👤 Login: admin / Senha: admin123")

    except Exception as e:
        print(f"❌ Erro ao criar dados: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    create_initial_data()
