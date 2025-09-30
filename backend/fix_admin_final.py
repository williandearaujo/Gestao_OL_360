#!/usr/bin/env python3
import sqlite3
import hashlib
from passlib.context import CryptContext


def fix_admin_password():
    print("🔐 === CORREÇÃO FINAL ADMIN ===")

    # Conectar ao banco
    conn = sqlite3.connect('gestao360.db')
    cursor = conn.cursor()

    # Nova senha
    password = "admin123"

    # Métodos de hash
    try:
        # Método 1: BCrypt
        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        bcrypt_hash = pwd_context.hash(password)
        print(f"✅ BCrypt hash: {bcrypt_hash[:50]}...")
        hash_method = "BCrypt"
        final_hash = bcrypt_hash
    except Exception as e:
        print(f"⚠️ BCrypt falhou: {e}")
        # Método 2: SHA256
        final_hash = hashlib.sha256(password.encode()).hexdigest()
        hash_method = "SHA256"
        print(f"✅ SHA256 hash: {final_hash}")

    # Verificar se admin existe
    cursor.execute("SELECT id FROM users WHERE username = 'admin'")
    result = cursor.fetchone()

    if result:
        # Admin existe - atualizar senha
        cursor.execute("""
                       UPDATE users
                       SET hashed_password = ?
                       WHERE username = 'admin'
                       """, (final_hash,))
        print(f"✅ Senha do admin ATUALIZADA com {hash_method}")
    else:
        # Admin não existe - criar
        cursor.execute("""
                       INSERT INTO users (username, email, hashed_password, is_admin, is_active, created_at)
                       VALUES (?, ?, ?, ?, ?, datetime('now'))
                       """, ('admin', 'admin@gestao360.com', final_hash, True, True))
        print(f"✅ Admin CRIADO com {hash_method}")

    conn.commit()

    # Testar a senha
    cursor.execute("SELECT hashed_password FROM users WHERE username = 'admin'")
    stored_hash = cursor.fetchone()[0]

    print(f"\n🧪 TESTANDO SENHA:")
    print(f"Hash armazenado: {stored_hash[:50]}...")

    if hash_method == "BCrypt":
        try:
            if pwd_context.verify(password, stored_hash):
                print("✅ Teste BCrypt: SUCESSO!")
            else:
                print("❌ Teste BCrypt: FALHOU!")
        except Exception as e:
            print(f"❌ Erro teste BCrypt: {e}")
    else:
        test_hash = hashlib.sha256(password.encode()).hexdigest()
        if test_hash == stored_hash:
            print("✅ Teste SHA256: SUCESSO!")
        else:
            print("❌ Teste SHA256: FALHOU!")

    conn.close()
    print(f"\n🎯 USAR: admin / {password}")


if __name__ == "__main__":
    fix_admin_password()
