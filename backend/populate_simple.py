from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app.models.user import User
from app.models.employee import Employee
from app.models.knowledge import Knowledge
from app.utils.auth import get_password_hash
from datetime import date


def create_simple_data():
    # Criar todas as tabelas primeiro
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        # Verificar se já existe dados
        if db.query(User).first():
            print("⚠️  Dados já existem!")
            return

        print("🚀 Criando dados simples...")

        # 1. Usuário admin
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

        # 2. Funcionários
        employees_data = [
            {
                "nome": "João Silva",
                "email": "joao@ol360.com",
                "cargo": "Analista de Segurança",
                "area": "Cibersegurança",
                "nivel": "SENIOR",
                "status": "ATIVO",
                "telefone": "(11) 99999-1234",
                "cpf": "123.456.789-01",
                "data_admissao": date(2023, 1, 15),
                "user_id": admin_user.id
            },
            {
                "nome": "Maria Santos",
                "email": "maria@ol360.com",
                "cargo": "Consultora SOC",
                "area": "SOC",
                "nivel": "PLENO",
                "status": "ATIVO",
                "telefone": "(11) 99999-5678",
                "cpf": "987.654.321-02",
                "data_admissao": date(2023, 3, 10),
                "user_id": admin_user.id
            },
            {
                "nome": "Pedro Costa",
                "email": "pedro@ol360.com",
                "cargo": "Especialista Red Team",
                "area": "Penetration Testing",
                "nivel": "SENIOR",
                "status": "ATIVO",
                "telefone": "(11) 99999-9012",
                "cpf": "456.789.123-03",
                "data_admissao": date(2022, 8, 20),
                "user_id": admin_user.id
            }
        ]

        for emp_data in employees_data:
            employee = Employee(**emp_data)
            db.add(employee)

        db.commit()
        print("✅ Funcionários criados")

        # 3. Conhecimentos
        knowledge_data = [
            {
                "nome": "CISSP - Certified Information Systems Security Professional",
                "tipo": "CERTIFICACAO",
                "codigo": "CISSP-001",
                "vendor": "ISC2",
                "area": "Cibersegurança",
                "validade_meses": 36,
                "link": "https://www.isc2.org/Certifications/CISSP"
            },
            {
                "nome": "CEH - Certified Ethical Hacker",
                "tipo": "CERTIFICACAO",
                "codigo": "CEH-001",
                "vendor": "EC-Council",
                "area": "Ethical Hacking",
                "validade_meses": 36,
                "link": "https://www.eccouncil.org/programs/certified-ethical-hacker-ceh/"
            },
            {
                "nome": "OSCP - Offensive Security Certified Professional",
                "tipo": "CERTIFICACAO",
                "codigo": "OSCP-001",
                "vendor": "Offensive Security",
                "area": "Penetration Testing",
                "validade_meses": None,
                "link": "https://www.offensive-security.com/pwk-oscp/"
            },
            {
                "nome": "Ciência da Computação",
                "tipo": "FORMACAO",
                "codigo": "CC-001",
                "vendor": "Universidade",
                "area": "Tecnologia",
                "nivel_formacao": "GRADUACAO"
            },
            {
                "nome": "Cybersecurity Fundamentals",
                "tipo": "CURSO",
                "codigo": "CS-FUN-001",
                "vendor": "Cisco",
                "area": "Cibersegurança"
            }
        ]

        for know_data in knowledge_data:
            knowledge = Knowledge(**know_data)
            db.add(knowledge)

        db.commit()
        print("✅ Conhecimentos criados")

        print("🎉 Dados criados com sucesso!")
        print("👤 Login: admin / Senha: admin123")
        print("🌐 API rodando em: http://localhost:8000")
        print("📚 Docs da API: http://localhost:8000/docs")

    except Exception as e:
        print(f"❌ Erro: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    create_simple_data()
