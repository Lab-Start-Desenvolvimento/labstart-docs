#!/bin/bash

echo "🚀 {{projectNamePascalCase}} - Setup para Desenvolvimento"
echo ""

# Verificar se .env existe
if [ ! -f .env ]; then
  echo "📝 Criando arquivo .env..."
  cp .env.example .env
  echo "✅ Arquivo .env criado! Configure suas variáveis."
  echo ""
fi

# Verificar se Docker está rodando
if command -v docker &> /dev/null && docker info &> /dev/null; then
  echo "🐳 Docker detectado! Subindo banco de dados..."
  {{#includeDocker}}
  docker-compose up -d
  echo "⏳ Aguardando banco de dados..."
  sleep 5
  {{/includeDocker}}
else
  echo "⚠️ Docker não encontrado. Configure o banco manualmente."
fi

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Gerar cliente Prisma
echo "🗄️ Gerando cliente Prisma..."
npm run db:generate

# Executar migrações
echo "🔄 Executando migrações..."
npm run db:migrate

# Executar seed
echo "🌱 Executando seed..."
npm run db:seed

echo ""
echo "✅ Setup concluído!"
echo ""
echo "🌐 Para iniciar o servidor:"
echo "   npm run dev"
echo ""
echo "📚 Endpoints disponíveis:"
echo "   http://localhost:3333/health"
echo "   http://localhost:3333/users"
echo ""
echo "🔑 Credenciais padrão:"
echo "   Admin: admin@labstart.com / admin123"
echo "   User: user@labstart.com / user123"