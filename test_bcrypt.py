#!/usr/bin/env python3

def test_bcrypt():
    try:
        from passlib.context import CryptContext

        # Configurar contexto BCrypt
        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

        # Testar hash
        password = "admin123"
        hashed = pwd_context.hash(password)
        print(f"✅ Hash gerado: {hashed}")

        # Testar verificação
        if pwd_context.verify(password, hashed):
            print("✅ BCrypt funcionando perfeitamente!")
            return True
        else:
            print("❌ Verificação BCrypt falhou")
            return False

    except Exception as e:
        print(f"❌ Erro no BCrypt: {e}")
        return False


if __name__ == "__main__":
    test_bcrypt()
