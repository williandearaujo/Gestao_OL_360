from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import logging
from datetime import datetime

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('gestao360.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# ============================================================================
# 🏗️ APLICAÇÃO FASTAPI
# ============================================================================

app = FastAPI(
    title="Gestão OL 360 API",
    version="2.0.1",
    description="Sistema de Gestão Empresarial Completo com SQLAlchemy e Fallback",
    docs_url="/docs",
    redoc_url="/redoc"
)

# ============================================================================
# 🌐 CONFIGURAÇÃO CORS
# ============================================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================================
# 🗃️ INICIALIZAÇÃO DO BANCO
# ============================================================================

def initialize_database():
    try:
        from app.database import init_database_sqlalchemy
        logger.info("🔍 Inicializando banco com SQLAlchemy...")
        success = init_database_sqlalchemy()
        if success:
            logger.info("✅ Banco inicializado com sucesso via SQLAlchemy")
            return True
        else:
            logger.warning("⚠️ Falha na inicialização SQLAlchemy, sistema continuará")
            return False
    except Exception as e:
        logger.error(f"❌ Erro na inicialização do banco: {e}")
        return False


db_initialized = initialize_database()


# ============================================================================
# 👤 INICIALIZAÇÃO DO SISTEMA ADMIN
# ============================================================================

def initialize_admin_system():
    try:
        from app.utils.admin_utils import initialize_admin_system
        logger.info("👤 Inicializando sistema administrativo...")
        result = initialize_admin_system()
        if result["status"] == "ready":
            logger.info("✅ Sistema admin inicializado com sucesso")
            if result["admin_created"]:
                logger.info("👤 Usuário admin criado - Login: admin / Senha: admin123")
            return True
        else:
            logger.warning("⚠️ Problemas na inicialização admin")
            return False
    except Exception as e:
        logger.error(f"❌ Erro na inicialização admin: {e}")
        return False


admin_initialized = initialize_admin_system()


# ============================================================================
# 📡 IMPORTAÇÃO DOS ROUTERS
# ============================================================================

def safe_import_router(module_name, router_name="router"):
    try:
        module = __import__(f"app.routers.{module_name}", fromlist=[router_name])
        router = getattr(module, router_name)
        logger.info(f"✅ Router '{module_name}' importado com sucesso")
        return router
    except Exception as e:
        logger.error(f"❌ Erro ao importar router '{module_name}': {e}")
        return None


# ============================================================================
# 🔗 INCLUSÃO DOS ROUTERS (COM AUTH)
# ============================================================================

routers_to_load = [
    "auth",  # ✅ ADICIONADO
    "employees",
    "areas",
    "admin",
    "teams",
    "managers",
    "knowledge",
    "employee_knowledge"
]

loaded_routers = []
failed_routers = []

for router_name in routers_to_load:
    router = safe_import_router(router_name)
    if router:
        try:
            app.include_router(router)
            loaded_routers.append(router_name)
            logger.info(f"✅ Router '{router_name}' incluído na aplicação")
        except Exception as e:
            logger.error(f"❌ Erro ao incluir router '{router_name}': {e}")
            failed_routers.append(router_name)
    else:
        failed_routers.append(router_name)


# ============================================================================
# 🏠 ENDPOINTS DE SISTEMA
# ============================================================================

@app.get("/")
def root():
    return {
        "message": "Gestão OL 360 API - Sistema Empresarial Completo!",
        "version": "2.0.1",
        "status": "enterprise-ready",
        "endpoints": {
            "auth": "/auth" if "auth" in loaded_routers else "❌ Indisponível",  # ✅ ADICIONADO
            "employees": "/employees" if "employees" in loaded_routers else "❌ Indisponível",
            "teams": "/teams" if "teams" in loaded_routers else "❌ Indisponível",
            "managers": "/managers" if "managers" in loaded_routers else "❌ Indisponível",
            "knowledge": "/knowledge" if "knowledge" in loaded_routers else "❌ Indisponível",
            "areas": "/areas" if "areas" in loaded_routers else "❌ Indisponível",
            "admin": "/admin" if "admin" in loaded_routers else "❌ Indisponível",
            "employee-knowledge": "/employee-knowledge" if "employee_knowledge" in loaded_routers else "❌ Indisponível",
        },
        "system_status": {
            "database_initialized": db_initialized,
            "admin_initialized": admin_initialized,  # ✅ ADICIONADO
            "loaded_modules": loaded_routers,
            "failed_modules": failed_routers,
        },
        "timestamp": datetime.now().isoformat()
    }


@app.get("/health")
def health():
    try:
        sqlalchemy_status = False
        table_count = 0

        try:
            from app.database import check_database_health
            health_result = check_database_health()
            sqlalchemy_status = health_result["status"] == "healthy"
            table_count = health_result["table_count"]
        except:
            pass

        sqlite_status = False
        try:
            import sqlite3
            conn = sqlite3.connect("gestao360.db")
            cursor = conn.cursor()
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
            tables = cursor.fetchall()
            cursor.close()
            conn.close()
            sqlite_status = True
            if not sqlalchemy_status:
                table_count = len(tables)
        except:
            pass

        overall_status = "healthy"
        if not sqlalchemy_status and not sqlite_status:
            overall_status = "critical"
        elif not sqlalchemy_status:
            overall_status = "degraded"

        return {
            "status": overall_status,
            "timestamp": datetime.now().isoformat(),
            "version": "2.0.1",
            "database": {
                "sqlalchemy": "healthy" if sqlalchemy_status else "error",
                "sqlite_fallback": "healthy" if sqlite_status else "error",
                "tables_count": table_count,
            },
            "api": {
                "routers_loaded": len(loaded_routers),
                "routers_failed": len(failed_routers),
                "loaded": loaded_routers,
                "failed": failed_routers
            }
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)
