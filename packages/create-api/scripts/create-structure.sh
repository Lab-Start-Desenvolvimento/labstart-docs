#!/bin/bash

echo "🏗️ Criando estrutura de diretórios do template basic..."

mkdir -p packages/create-api/templates/basic/src/@types
mkdir -p packages/create-api/templates/basic/src/env
mkdir -p packages/create-api/templates/basic/src/lib
mkdir -p packages/create-api/templates/basic/src/http/controllers/users
mkdir -p packages/create-api/templates/basic/src/http/controllers/auth
mkdir -p packages/create-api/templates/basic/src/http/controllers/health
mkdir -p packages/create-api/templates/basic/src/http/middlewares
mkdir -p packages/create-api/templates/basic/src/repositories/prisma
mkdir -p packages/create-api/templates/basic/src/repositories/fakes
mkdir -p packages/create-api/templates/basic/src/services/users
mkdir -p packages/create-api/templates/basic/src/services/auth
mkdir -p packages/create-api/templates/basic/src/services/errors
mkdir -p packages/create-api/templates/basic/src/services/factories
mkdir -p packages/create-api/templates/basic/src/utils
mkdir -p packages/create-api/templates/basic/prisma
mkdir -p packages/create-api/templates/docker
mkdir -p packages/create-api/templates/github/.github/workflows

echo "✅ Estrutura criada com sucesso!"
echo "📁 Total de diretórios: $(find packages/create-api/templates -type d | wc -l)"