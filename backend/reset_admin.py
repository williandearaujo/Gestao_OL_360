#!/usr/bin/env python3
import sqlite3
import hashlib
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def reset_admin_password():
    conn = sqlite3.connect('gestao360.db')
    cursor = conn.cursor()

    # Nova senha
    new_password = "admin123"

    # Gerar hash da nova senha (com fallback)
    try:
        new_hash = pwd_context.hash(new_password)
        print(f"✅ Hash BCrypt gerado: {new_hash[:50]}...")
    except:
        new_hash = hashlib.sha256(new_password.encode()).hexdigest()
        print(f"✅ Hash SHA256 gerado: {new_hash}")

    # Atualizar no banco
    cursor.execute("""
                   UPDATE users
                   SET hashed_password = ?
                   WHERE username = 'admin'
                   """, (new_hash,))

    if cursor.rowcount > 0:
        print("✅ Senha do admin atualizada com sucesso!")
        conn.commit()
    else:
        print("❌ Usuário admin não encontrado para atualizar!")

    conn.close()


if __name__ == "__main__":
    reset_admin_password()

