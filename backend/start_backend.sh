#!/bin/bash
echo "🐍 Iniciando Gestão 360 Backend..."

# Ir para pasta do backend
cd /home/willlian/Projetos/Gestao_360/backend

# 1º - ATIVAR ambiente virtual PRIMEIRO
source venv/bin/activate

# 2º - Instalar/atualizar dependências
pip install -r requirements.txt

# 3º - Iniciar o servidor
echo "🚀 Iniciando servidor FastAPI..."
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
