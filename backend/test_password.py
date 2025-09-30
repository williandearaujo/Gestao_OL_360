#!/usr/bin/env python3
import sqlite3
import hashlib
from passlib.context import CryptContext

# Configurar o contexto da senha (igual ao usado na aplicação)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def test_password():
    # Conectar ao banco
    conn = sqlite3.connect('gestao360.db')
    cursor = conn.cursor()

    # Buscar usuário admin
    cursor.execute("SELECT id, username, hashed_password FROM users WHERE username = 'admin'")
    result = cursor.fetchone()

    if not result:
        print("❌ Usuário admin não encontrado!")
        return

    user_id, username, hashed_password = result
    print(f"✅ Usuário encontrado: {username} (ID: {user_id})")
    print(f"🔐 Hash armazenado: {hashed_password[:50]}...")

    # Testar senha com bcrypt
    test_password = "admin123"

    try:
        # Teste 1: BCrypt
        if pwd_context.verify(test_password, hashed_password):
            print("✅ Senha correta com BCrypt!")
            return True
        else:
            print("❌ Senha incorreta com BCrypt")
    except Exception as e:
        print(f"⛔ Erro no BCrypt: {e}")

    try:
        # Teste 2: SHA256 (fallback)
        simple_hash = hashlib.sha256(test_password.encode()).hexdigest()
        if hashed_password == simple_hash:
            print("✅ Senha correta com SHA256!")
            return True
        else:
            print("❌ Senha incorreta com SHA256")
    except Exception as e:
        print(f"⛔ Erro no SHA256: {e}")

    print("❌ Senha não confere com nenhum método!")

    # Mostrar o que deveria ser
    correct_bcrypt = pwd_context.hash(test_password)
    correct_sha256 = hashlib.sha256(test_password.encode()).hexdigest()

    print(f"\n🔧 Hash correto BCrypt: {correct_bcrypt}")
    print(f"🔧 Hash correto SHA256: {correct_sha256}")

    conn.close()
    return False


if __name__ == "__main__":
    test_password()
