from sqlalchemy import create_engine, inspect, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
import logging
import sqlite3

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# URL do banco (SQLite por padrão)
DATABASE_URL = "sqlite:///./gestao360.db"

# Criar engine do SQLAlchemy
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
    echo=False  # True para debug SQL
)

# Session maker
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para os models
Base = declarative_base()


def get_db():
    """Dependency para obter sessão do banco de dados"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ============================================================================
# 🏗️ FUNÇÕES DE INICIALIZAÇÃO E SAÚDE
# ============================================================================

def create_tables():
    """Criar todas as tabelas do banco"""
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("✅ Todas as tabelas criadas com sucesso!")
        return True
    except Exception as e:
        logger.error(f"❌ Erro ao criar tabelas: {e}")
        return False


def drop_all_tables():
    """Dropar todas as tabelas (cuidado!)"""
    try:
        Base.metadata.drop_all(bind=engine)
        logger.info("⚠️ Todas as tabelas foram removidas!")
        return True
    except Exception as e:
        logger.error(f"❌ Erro ao remover tabelas: {e}")
        return False


def get_table_info():
    """Obter informações sobre as tabelas"""
    try:
        inspector = inspect(engine)
        tables = inspector.get_table_names()

        table_info = {}
        for table in tables:
            columns = inspector.get_columns(table)
            table_info[table] = {
                "columns": [col['name'] for col in columns],
                "column_count": len(columns)
            }

        return table_info
    except Exception as e:
        logger.error(f"❌ Erro ao obter info das tabelas: {e}")
        return {}


def check_database_health():
    """Verificar saúde do banco de dados"""
    try:
        # Tentar conectar
        connection = engine.connect()

        # ✅ CORREÇÃO: Executar query simples com text()
        result = connection.execute(text("SELECT 1"))
        result.fetchone()  # Consumir o resultado
        connection.close()

        # Obter informações das tabelas
        table_info = get_table_info()

        return {
            "status": "healthy",
            "tables": list(table_info.keys()),
            "table_count": len(table_info),
            "details": table_info
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e),
            "tables": [],
            "table_count": 0
        }


def init_database_sqlalchemy():
    """Inicialização completa com SQLAlchemy"""
    try:
        logger.info("🔍 Inicializando banco com SQLAlchemy...")

        # Criar todas as tabelas
        Base.metadata.create_all(bind=engine)

        # Verificar saúde
        health = check_database_health()

        if health["status"] == "healthy":
            logger.info(f"✅ Banco inicializado: {health['table_count']} tabelas")
            logger.info(f"📋 Tabelas: {health['tables']}")
            return True
        else:
            logger.error(f"❌ Problema no banco: {health.get('error', 'Erro desconhecido')}")
            return False

    except Exception as e:
        logger.error(f"❌ Erro na inicialização SQLAlchemy: {e}")
        return False


# Função para teste de conectividade
def test_connection():
    """Testar conexão com banco"""
    try:
        db = SessionLocal()
        # ✅ CORREÇÃO: Usar text() para query SQL raw
        db.execute(text("SELECT 1"))
        db.close()
        return True
    except Exception as e:
        logger.error(f"❌ Erro na conexão: {e}")
        return False


# ============================================================================
# 🔧 FUNÇÕES AUXILIARES PARA COMPATIBILIDADE
# ============================================================================

def get_direct_connection():
    """Obter conexão direta SQLite para operações especiais"""
    try:
        return sqlite3.connect("./gestao360.db")
    except Exception as e:
        logger.error(f"❌ Erro na conexão direta: {e}")
        return None


def execute_raw_sql(query, params=None):
    """Executar SQL raw de forma segura"""
    try:
        with engine.connect() as connection:
            if params:
                result = connection.execute(text(query), params)
            else:
                result = connection.execute(text(query))

            # Se for SELECT, retornar resultados
            if query.strip().upper().startswith('SELECT'):
                return result.fetchall()
            else:
                connection.commit()
                return True

    except Exception as e:
        logger.error(f"❌ Erro ao executar SQL raw: {e}")
        return None


# ============================================================================
# 🗃️ FUNÇÕES DE BACKUP E MANUTENÇÃO
# ============================================================================

def backup_database(backup_path=None):
    """Fazer backup do banco de dados"""
    try:
        import shutil
        from datetime import datetime

        if not backup_path:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            backup_path = f"./gestao360_backup_{timestamp}.db"

        # Copiar arquivo de banco
        shutil.copy2("./gestao360.db", backup_path)

        logger.info(f"✅ Backup criado: {backup_path}")
        return backup_path

    except Exception as e:
        logger.error(f"❌ Erro no backup: {e}")
        return None


def get_database_size():
    """Obter tamanho do banco em bytes"""
    try:
        import os
        return os.path.getsize("./gestao360.db")
    except Exception as e:
        logger.error(f"❌ Erro ao obter tamanho: {e}")
        return 0


def vacuum_database():
    """Otimizar banco de dados (VACUUM)"""
    try:
        conn = get_direct_connection()
        if conn:
            conn.execute("VACUUM")
            conn.close()
            logger.info("✅ Database VACUUM executado")
            return True
    except Exception as e:
        logger.error(f"❌ Erro no VACUUM: {e}")
        return False


# ============================================================================
# 🎯 FUNÇÃO PRINCIPAL DE INICIALIZAÇÃO (para main.py)
# ============================================================================

def initialize_database():
    """Função principal de inicialização do banco"""
    try:
        logger.info("🔄 Inicializando sistema de banco de dados...")

        # Tentar inicialização SQLAlchemy
        success = init_database_sqlalchemy()

        if success:
            logger.info("✅ Banco inicializado com SQLAlchemy")

            # Informações adicionais
            size = get_database_size()
            logger.info(f"📊 Tamanho do banco: {size / 1024:.1f} KB")

            return True
        else:
            logger.warning("⚠️ Falha na inicialização SQLAlchemy")
            return False

    except Exception as e:
        logger.error(f"❌ Erro crítico na inicialização: {e}")
        return False
