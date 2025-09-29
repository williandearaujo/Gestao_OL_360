from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app.models.team import Team
from app.models.manager import Manager


def create_initial_data():
    # Criar tabelas
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        # Verificar se já existem dados
        if db.query(Team).first() or db.query(Manager).first():
            print("⚠️  Dados já existem!")
            return

        print("🚀 Criando dados iniciais...")

        # 1. CRIAR EQUIPES
        teams_data = [
            {
                "nome": "Comercial",
                "descricao": "Equipe responsável por vendas e relacionamento com clientes",
                "cor": "#10B981"  # Verde
            },
            {
                "nome": "Tecnologia",
                "descricao": "Equipe de desenvolvimento e infraestrutura",
                "cor": "#3B82F6"  # Azul
            },
            {
                "nome": "Administrativo",
                "descricao": "Equipe de administração e recursos humanos",
                "cor": "#8B5CF6"  # Roxo
            },
            {
                "nome": "Operacional",
                "descricao": "Equipe de operações e logística",
                "cor": "#F59E0B"  # Amarelo
            },
            {
                "nome": "Financeiro",
                "descricao": "Equipe de contabilidade e finanças",
                "cor": "#EF4444"  # Vermelho
            }
        ]

        for team_data in teams_data:
            team = Team(**team_data)
            db.add(team)

        db.commit()
        print("✅ Equipes criadas")

        # 2. CRIAR GERENTES/DIRETORES
        managers_data = [
            {
                "nome": "André Brazioli",
                "email": "andre.brazioli@ol360.com",
                "cargo": "Diretor Executivo",
                "nivel_hierarquico": "DIRETOR",
                "telefone": "(11) 99999-0001"
            },
            {
                "nome": "João Silva",
                "email": "joao.silva@ol360.com",
                "cargo": "Gerente Comercial",
                "nivel_hierarquico": "GERENTE",
                "telefone": "(11) 99999-0002"
            },
            {
                "nome": "Maria Santos",
                "email": "maria.santos@ol360.com",
                "cargo": "Gerente de TI",
                "nivel_hierarquico": "GERENTE",
                "telefone": "(11) 99999-0003"
            },
            {
                "nome": "Pedro Costa",
                "email": "pedro.costa@ol360.com",
                "cargo": "Coordenador Administrativo",
                "nivel_hierarquico": "COORDENADOR",
                "telefone": "(11) 99999-0004"
            },
            {
                "nome": "Ana Oliveira",
                "email": "ana.oliveira@ol360.com",
                "cargo": "Gerente Financeiro",
                "nivel_hierarquico": "GERENTE",
                "telefone": "(11) 99999-0005"
            }
        ]

        for manager_data in managers_data:
            manager = Manager(**manager_data)
            db.add(manager)

        db.commit()
        print("✅ Gerentes criados")

        print("🎉 Dados iniciais criados com sucesso!")
        print()
        print("📊 EQUIPES:")
        for team in db.query(Team).all():
            print(f"  • {team.nome} - {team.descricao}")

        print()
        print("👔 GERENTES:")
        for manager in db.query(Manager).all():
            print(f"  • {manager.nome} ({manager.cargo})")

    except Exception as e:
        print(f"❌ Erro: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    create_initial_data()
