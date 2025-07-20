# {{projectNamePascalCase}} API

> API LabStart com Clean Architecture gerada automaticamente

## 🚀 Tecnologias

- **Runtime:** Node.js
- **Linguagem:** TypeScript
- **Framework:** Fastify
- **ORM:** Prisma
- **Banco:** {{database}}
- **Validação:** Zod
- **Autenticação:** JWT
- **Testes:** Vitest + Supertest
- **Hash:** bcryptjs

## 🏗️ Arquitetura

Este projeto segue os padrões **Clean Architecture LabStart**:

```
src/
├── @types/              # Tipos TypeScript customizados
├── app.ts              # Configuração principal do Fastify
├── env/                # Validação de variáveis de ambiente
├── http/               # 🌐 Camada de Apresentação
│   ├── controllers/    # Controllers organizados por funcionalidade
│   └── middlewares/    # Middlewares (auth, cors, etc)
├── lib/                # Configurações (Prisma, JWT, etc)
├── repositories/       # 💾 Camada de Infraestrutura
│   ├── fakes/         # Implementações em memória (testes)
│   └── prisma/        # Implementações com Prisma
├── server.ts          # Ponto de entrada
├── services/          # 🧠 Camada de Aplicação
│   ├── errors/        # Classes de erro customizadas
│   ├── factories/     # Factory pattern para DI
│   └── [dominio]/     # Services organizados por domínio
└── utils/             # Utilitários gerais
```

## 🔧 Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar ambiente

```bash
cp .env.example .env
# Editar .env com suas configurações
```

{{#includeDocker}}

### 3. Subir banco de dados (Docker)

```bash
docker-compose up -d
```

{{/includeDocker}}

### 4. Configurar banco de dados

```bash
# Executar migrações
npm run db:migrate

# Gerar cliente Prisma
npm run db:generate

# Executar seed (dados iniciais)
npm run db:seed
```

### 5. Iniciar servidor

```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

## 🌐 Endpoints

### Públicos

- `GET /health` - Health check
- `POST /sessions` - Login
- `PATCH /token/refresh` - Refresh token

### Autenticados (JWT)

- `GET /me` - Perfil do usuário logado
- `GET /users` - Listar usuários
- `GET /users/:id` - Buscar usuário por ID

### Administrativos (JWT + ADMIN)

- `POST /users` - Criar usuário

## 🧪 Testes

```bash
# Testes unitários
npm test

# Testes em modo watch
npm run test:watch

# Testes E2E
npm run test:e2e

# Coverage
npm run test:coverage

# Interface de testes
npm run test:ui
```

## 🗄️ Banco de Dados

### Comandos Prisma

```bash
# Criar migração
npm run db:migrate

# Gerar cliente
npm run db:generate

# Executar seed
npm run db:seed

# Interface visual
npm run db:studio
```

### Schema

- **Users**: Sistema de usuários com roles (USER/ADMIN)
- **Autenticação**: JWT com refresh tokens
- **Soft Delete**: Usuários desativados com `isActive: false`

## 🔐 Autenticação

### Login

```bash
POST /sessions
{
  "email": "admin@labstart.com",
  "password": "admin123"
}
```

### Credenciais Padrão

- **Admin**: `admin@labstart.com` / `admin123`
- **User**: `user@labstart.com` / `user123`

### Headers

```bash
Authorization: Bearer
```

## 🐳 Docker

{{#includeDocker}}

### Desenvolvimento

```bash
# Subir apenas banco
docker-compose up -d

# Logs
docker-compose logs -f
```

### Produção

```bash
# Build da aplicação
docker build -t {{projectName}} .

# Run
docker run -p 3333:3333 {{projectName}}
```

{{/includeDocker}}

{{^includeDocker}}
Para usar Docker, configure manualmente:

1. Criar `docker-compose.yml`
2. Configurar serviços {{database}}
3. Ajustar `DATABASE_URL` no `.env`
   {{/includeDocker}}

## 📊 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Servidor em modo desenvolvimento
npm run build        # Build para produção
npm start           # Iniciar servidor produção

# Banco de dados
npm run db:migrate   # Executar migrações
npm run db:generate  # Gerar cliente Prisma
npm run db:seed     # Executar seed
npm run db:studio   # Interface visual do banco

# Testes
npm test            # Testes unitários
npm run test:e2e    # Testes end-to-end
npm run test:coverage # Cobertura de testes

# Qualidade de código
npm run lint        # ESLint
npm run lint:fix    # ESLint com correção automática
```

## 🏆 Padrões de Qualidade

### Fluxo Obrigatório

```
Request → Controller → Service → Repository → Database
   ↓
Response ← Controller ← Service ← Repository ← Database
```

### Regras Críticas

- ✅ **Validar entrada** com Zod nos controllers
- ✅ **Usar interfaces** para repositories
- ✅ **Aplicar factories** para injeção de dependência
- ✅ **Tratar erros** específicos em cada camada
- ✅ **Escrever testes** para services
- ✅ **Nunca expor** dados sensíveis (passwordHash)

## 🚀 Deploy

### Variáveis de Ambiente

```bash
NODE_ENV=production
PORT=3333
DATABASE_URL="sua-url-do-banco"
JWT_SECRET="seu-jwt-secret-super-seguro"
```

### Build de Produção

```bash
npm run build
npm start
```

## 📚 Documentação

- [Fastify Documentation](https://www.fastify.io/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Zod Documentation](https://zod.dev/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

**🚀 Gerado com [create-labstart-api](https://github.com/labstart/labstart-docs)**
