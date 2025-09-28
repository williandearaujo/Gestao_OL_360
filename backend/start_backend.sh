#!/bin/bash

echo "🚀 Iniciando Backend Gestão 360..."

# Verificar se virtual environment existe
if [ ! -d "venv" ]; then
    echo "📦 Criando virtual environment..."
    python3 -m venv venv
fi

# Ativar virtual environment
echo "🔄 Ativando virtual environment..."
source venv/bin/activate

# Instalar dependências
echo "📚 Instalando dependências..."
pip install -r requirements.txt

# Criar dados iniciais se necessário
if [ ! -f "gestao360.db" ]; then
    echo "🗄️  Criando banco e dados iniciais..."
    python create_initial_data.py
fi

# Iniciar servidor
echo "🎯 Iniciando FastAPI server..."
echo "📍 URLs disponíveis:"
echo "   • API: http://localhost:8000"
echo "   • Docs: http://localhost:8000/docs"
echo "   • ReDoc: http://localhost:8000/redoc"
echo ""
echo "👤 Usuário inicial:"
echo "   • Username: admin"
echo "   • Password: admin123"
echo ""

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
