import sqlite3
import json
import logging
from datetime import datetime, date
from typing import Dict, List, Any, Optional
from pathlib import Path

logger = logging.getLogger(__name__)


# ============================================================================
# 👤 GESTÃO DE USUÁRIO ADMIN PADRÃO
# ============================================================================

def create_default_admin():
    """Criar usuário admin padrão se não existir"""
    try:
        conn = sqlite3.connect("gestao360.db")
        cursor = conn.cursor()

        # Verificar se tabela users existe
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='users'")
        if not cursor.fetchone():
            # Criar tabela users
            cursor.execute("""
                           CREATE TABLE users
                           (
                               id              INTEGER PRIMARY KEY AUTOINCREMENT,
                               username        TEXT UNIQUE NOT NULL,
                               email           TEXT UNIQUE NOT NULL,
                               hashed_password TEXT        NOT NULL,
                               is_active       BOOLEAN DEFAULT 1,
                               is_admin        BOOLEAN DEFAULT 0,
                               is_superuser    BOOLEAN DEFAULT 0,
                               permissions     TEXT    DEFAULT '{}',
                               preferences     TEXT    DEFAULT '{}',
                               last_login      TEXT,
                               login_count     INTEGER DEFAULT 0,
                               created_at      TEXT    DEFAULT CURRENT_TIMESTAMP,
                               updated_at      TEXT    DEFAULT CURRENT_TIMESTAMP
                           )
                           """)
            logger.info("✅ Tabela users criada")

        # Verificar se admin já existe
        cursor.execute("SELECT id FROM users WHERE username = 'admin' OR is_admin = 1")
        if cursor.fetchone():
            logger.info("👤 Usuário admin já existe")
            cursor.close()
            conn.close()
            return True

        # Criar admin padrão
        from app.utils.auth import get_password_hash

        admin_permissions = {
            "employees": {"read": True, "write": True, "delete": True},
            "teams": {"read": True, "write": True, "delete": True},
            "managers": {"read": True, "write": True, "delete": True},
            "knowledge": {"read": True, "write": True, "delete": True},
            "areas": {"read": True, "write": True, "delete": True},
            "admin": {"read": True, "write": True, "delete": True},
            "users": {"read": True, "write": True, "delete": True},
            "system": {"read": True, "write": True, "delete": True}
        }

        admin_preferences = {
            "theme": "dark",
            "language": "pt-BR",
            "notifications": True,
            "email_notifications": True,
            "dashboard_layout": "advanced"
        }

        # Senha padrão: admin123 (MUDAR EM PRODUÇÃO!)
        hashed_password = get_password_hash("admin123")

        cursor.execute("""
                       INSERT INTO users (username, email, hashed_password, is_active, is_admin, is_superuser,
                                          permissions, preferences, created_at)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                       """, (
                           "admin",
                           "admin@gestao360.com",
                           hashed_password,
                           True,
                           True,
                           True,
                           json.dumps(admin_permissions),
                           json.dumps(admin_preferences),
                           datetime.now().isoformat()
                       ))

        conn.commit()
        cursor.close()
        conn.close()

        logger.info("✅ Usuário admin criado - Username: admin, Password: admin123")
        logger.warning("⚠️ ALTERE A SENHA PADRÃO EM PRODUÇÃO!")

        return True

    except Exception as e:
        logger.error(f"❌ Erro ao criar admin padrão: {e}")
        return False


# ============================================================================
# 📊 SISTEMA DE LOGS AVANÇADO
# ============================================================================

def get_system_logs(limit: int = 100, level: str = None) -> List[Dict[str, Any]]:
    """Obter logs do sistema do arquivo"""
    try:
        log_file = Path("gestao360.log")
        if not log_file.exists():
            return []

        logs = []
        with open(log_file, 'r', encoding='utf-8') as f:
            lines = f.readlines()

        # Pegar as últimas linhas
        recent_lines = lines[-limit:] if len(lines) > limit else lines

        for line in recent_lines:
            try:
                # Parse básico do log
                if " - " in line:
                    parts = line.strip().split(" - ")
                    if len(parts) >= 4:
                        timestamp = parts[0]
                        module = parts[1]
                        log_level = parts[2]
                        message = " - ".join(parts[3:])

                        # Filtrar por nível se especificado
                        if level and log_level.upper() != level.upper():
                            continue

                        logs.append({
                            "timestamp": timestamp,
                            "module": module,
                            "level": log_level,
                            "message": message,
                            "raw": line.strip()
                        })
            except Exception:
                # Se não conseguir parsear, adiciona como raw
                logs.append({
                    "timestamp": datetime.now().isoformat(),
                    "module": "system",
                    "level": "INFO",
                    "message": line.strip(),
                    "raw": line.strip()
                })

        return logs

    except Exception as e:
        logger.error(f"❌ Erro ao ler logs: {e}")
        return []


def get_log_stats() -> Dict[str, Any]:
    """Obter estatísticas dos logs"""
    try:
        log_file = Path("gestao360.log")
        if not log_file.exists():
            return {"total": 0, "size": 0, "levels": {}}

        size = log_file.stat().st_size

        levels = {"INFO": 0, "WARNING": 0, "ERROR": 0, "CRITICAL": 0, "DEBUG": 0}
        total = 0

        with open(log_file, 'r', encoding='utf-8') as f:
            for line in f:
                total += 1
                for level in levels.keys():
                    if f" - {level} - " in line:
                        levels[level] += 1
                        break

        return {
            "total": total,
            "size": size,
            "size_mb": round(size / 1024 / 1024, 2),
            "levels": levels,
            "file_path": str(log_file.absolute())
        }

    except Exception as e:
        logger.error(f"❌ Erro ao obter stats dos logs: {e}")
        return {"total": 0, "size": 0, "levels": {}}


# ============================================================================
# 🔧 OPERAÇÕES DE SISTEMA
# ============================================================================

def backup_database(backup_name: str = None) -> Dict[str, Any]:
    """Fazer backup do banco de dados"""
    try:
        if not backup_name:
            backup_name = f"gestao360_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.db"

        import shutil

        source = Path("gestao360.db")
        backup_dir = Path("backups")
        backup_dir.mkdir(exist_ok=True)

        backup_path = backup_dir / backup_name

        if source.exists():
            shutil.copy2(source, backup_path)

            return {
                "success": True,
                "backup_path": str(backup_path),
                "size": backup_path.stat().st_size,
                "timestamp": datetime.now().isoformat()
            }
        else:
            return {
                "success": False,
                "error": "Banco de dados não encontrado"
            }

    except Exception as e:
        logger.error(f"❌ Erro no backup: {e}")
        return {
            "success": False,
            "error": str(e)
        }


def get_system_info() -> Dict[str, Any]:
    """Obter informações completas do sistema"""
    try:
        import sys
        import platform
        import psutil
        from pathlib import Path

        # Informações do Python
        python_info = {
            "version": sys.version,
            "executable": sys.executable,
            "platform": platform.platform()
        }

        # Informações do sistema
        system_info = {
            "os": platform.system(),
            "os_version": platform.version(),
            "architecture": platform.architecture()[0],
            "processor": platform.processor(),
            "hostname": platform.node()
        }

        # Informações de memória e disco
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage('.')

        performance_info = {
            "memory": {
                "total": memory.total,
                "available": memory.available,
                "percent": memory.percent,
                "used": memory.used
            },
            "disk": {
                "total": disk.total,
                "used": disk.used,
                "free": disk.free,
                "percent": (disk.used / disk.total) * 100
            }
        }

        # Informações da aplicação
        app_info = {
            "database_file": "gestao360.db",
            "database_exists": Path("gestao360.db").exists(),
            "database_size": Path("gestao360.db").stat().st_size if Path("gestao360.db").exists() else 0,
            "log_file": "gestao360.log",
            "log_exists": Path("gestao360.log").exists(),
            "log_size": Path("gestao360.log").stat().st_size if Path("gestao360.log").exists() else 0
        }

        return {
            "python": python_info,
            "system": system_info,
            "performance": performance_info,
            "application": app_info,
            "timestamp": datetime.now().isoformat()
        }

    except Exception as e:
        logger.error(f"❌ Erro ao obter info do sistema: {e}")
        return {"error": str(e)}


# ============================================================================
# 📈 DASHBOARD ADMINISTRATIVO
# ============================================================================

def get_dashboard_data() -> Dict[str, Any]:
    """Obter dados completos para dashboard administrativo"""
    try:
        conn = sqlite3.connect("gestao360.db")
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        dashboard = {
            "overview": {
                "total_employees": 0,
                "total_teams": 0,
                "total_areas": 0,
                "total_managers": 0,
                "total_knowledge": 0,
                "total_users": 0
            },
            "recent_activity": [],
            "alerts": [],
            "performance": {},
            "timestamp": datetime.now().isoformat()
        }

        # Contadores básicos
        tables = {
            "employees": "total_employees",
            "teams": "total_teams",
            "areas": "total_areas",
            "managers": "total_managers",
            "knowledge": "total_knowledge",
            "users": "total_users"
        }

        for table, key in tables.items():
            try:
                cursor.execute(f"SELECT COUNT(*) FROM {table}")
                count = cursor.fetchone()[0]
                dashboard["overview"][key] = count
            except:
                dashboard["overview"][key] = 0

        # Atividade recente (simplificado)
        try:
            cursor.execute("""
                           SELECT 'employee' as type, nome as name, created_at
                           FROM employees
                           WHERE created_at IS NOT NULL
                           ORDER BY created_at DESC LIMIT 5
                           """)
            recent = cursor.fetchall()
            dashboard["recent_activity"] = [dict(row) for row in recent]
        except:
            pass

        # Alertas do sistema
        alerts = []

        # Verificar certificações vencendo
        try:
            cursor.execute("""
                           SELECT COUNT(*)
                           FROM employee_knowledge
                           WHERE data_expiracao <= date ('now'
                               , '+30 days')
                             AND status = 'OBTIDO'
                           """)
            expiring = cursor.fetchone()[0]
            if expiring > 0:
                alerts.append({
                    "type": "warning",
                    "message": f"{expiring} certificações vencendo em 30 dias",
                    "action": "Verificar certificações"
                })
        except:
            pass

        # Verificar usuários inativos
        try:
            cursor.execute("SELECT COUNT(*) FROM users WHERE is_active = 0")
            inactive_users = cursor.fetchone()[0]
            if inactive_users > 0:
                alerts.append({
                    "type": "info",
                    "message": f"{inactive_users} usuários inativos",
                    "action": "Revisar usuários"
                })
        except:
            pass

        dashboard["alerts"] = alerts

        # Performance básica
        dashboard["performance"] = {
            "database_size": Path("gestao360.db").stat().st_size if Path("gestao360.db").exists() else 0,
            "log_size": Path("gestao360.log").stat().st_size if Path("gestao360.log").exists() else 0,
            "uptime": "Sistema ativo"
        }

        cursor.close()
        conn.close()

        return dashboard

    except Exception as e:
        logger.error(f"❌ Erro ao obter dados do dashboard: {e}")
        return {
            "overview": {},
            "recent_activity": [],
            "alerts": [{"type": "error", "message": f"Erro no dashboard: {str(e)}"}],
            "performance": {},
            "timestamp": datetime.now().isoformat()
        }


# ============================================================================
# 🔐 GESTÃO DE USUÁRIOS
# ============================================================================

def get_all_users() -> List[Dict[str, Any]]:
    """Obter todos os usuários (sem senhas)"""
    try:
        conn = sqlite3.connect("gestao360.db")
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        cursor.execute("""
                       SELECT id,
                              username,
                              email,
                              is_active,
                              is_admin,
                              is_superuser,
                              permissions,
                              preferences,
                              last_login,
                              login_count,
                              created_at
                       FROM users
                       ORDER BY created_at DESC
                       """)

        users = []
        for row in cursor.fetchall():
            user = dict(row)

            # Parse JSON fields
            try:
                user["permissions"] = json.loads(user["permissions"]) if user["permissions"] else {}
            except:
                user["permissions"] = {}

            try:
                user["preferences"] = json.loads(user["preferences"]) if user["preferences"] else {}
            except:
                user["preferences"] = {}

            users.append(user)

        cursor.close()
        conn.close()

        return users

    except Exception as e:
        logger.error(f"❌ Erro ao obter usuários: {e}")
        return []


def create_user(user_data: Dict[str, Any]) -> Dict[str, Any]:
    """Criar novo usuário"""
    try:
        from app.utils.auth import get_password_hash, validate_password_strength

        # Validar senha
        password_validation = validate_password_strength(user_data["password"])
        if not password_validation["valid"]:
            return {
                "success": False,
                "error": "Senha não atende aos critérios",
                "details": password_validation["errors"]
            }

        conn = sqlite3.connect("gestao360.db")
        cursor = conn.cursor()

        # Verificar se usuário já existe
        cursor.execute("SELECT id FROM users WHERE username = ? OR email = ?",
                       (user_data["username"], user_data["email"]))
        if cursor.fetchone():
            return {
                "success": False,
                "error": "Usuário ou email já existe"
            }

        # Criar usuário
        hashed_password = get_password_hash(user_data["password"])

        cursor.execute("""
                       INSERT INTO users (username, email, hashed_password, is_active, is_admin,
                                          permissions, preferences, created_at)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                       """, (
                           user_data["username"],
                           user_data["email"],
                           hashed_password,
                           user_data.get("is_active", True),
                           user_data.get("is_admin", False),
                           json.dumps(user_data.get("permissions", {})),
                           json.dumps(user_data.get("preferences", {})),
                           datetime.now().isoformat()
                       ))

        user_id = cursor.lastrowid
        conn.commit()
        cursor.close()
        conn.close()

        logger.info(f"✅ Usuário '{user_data['username']}' criado com ID {user_id}")

        return {
            "success": True,
            "user_id": user_id,
            "message": "Usuário criado com sucesso"
        }

    except Exception as e:
        logger.error(f"❌ Erro ao criar usuário: {e}")
        return {
            "success": False,
            "error": str(e)
        }


def initialize_admin_system():
    """Inicializar sistema administrativo completo"""
    try:
        logger.info("🔧 Inicializando sistema administrativo...")

        # Criar usuário admin padrão
        admin_created = create_default_admin()

        # Criar diretório de backups
        Path("backups").mkdir(exist_ok=True)

        # Verificar logs
        log_stats = get_log_stats()

        logger.info("✅ Sistema administrativo inicializado")

        return {
            "admin_created": admin_created,
            "backup_dir_created": True,
            "log_stats": log_stats,
            "status": "ready"
        }

    except Exception as e:
        logger.error(f"❌ Erro na inicialização admin: {e}")
        return {
            "admin_created": False,
            "status": "error",
            "error": str(e)
        }
