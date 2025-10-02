# Creattive

Sistema de gerenciamento de produtos e categorias.

## 🚀 Como executar

### Pré-requisitos

- Docker
- Docker Compose

### Executando a aplicação

1. Clone o repositório:

```bash
git clone https://github.com/hnascx/creattive.git
cd creattive
```

2. Inicie a aplicação:

```bash
# Inicie a aplicação
docker-compose up --build
```

As URLs e credenciais serão exibidas automaticamente quando a aplicação estiver pronta.

### 🌐 URLs

- Frontend: http://localhost:3000
- Backend: http://localhost:3001

### 🔐 Credenciais

- Usuário: admin
- Senha: admin123

### 📝 Funcionalidades

- Autenticação de usuário
- Gerenciamento de categorias
- Gerenciamento de produtos
- Upload de imagens
- Busca e paginação

### 🛠 Tecnologias

- Frontend:

  - Next.js
  - React
  - TypeScript
  - Tailwind CSS
  - Shadcn/ui

- Backend:
  - Node.js
  - Fastify
  - TypeScript
  - Prisma
  - PostgreSQL

### 🔧 Desenvolvimento

A aplicação está configurada para desenvolvimento com hot reload:

- Alterações no frontend são refletidas instantaneamente
- Alterações no backend são refletidas automaticamente
- O banco de dados é persistido mesmo após parar os containers
- Os uploads são persistidos na pasta `apps/backend/public`

### 📦 Estrutura

```
creattive/
├── apps/
│   ├── backend/         # API em Fastify
│   └── frontend/        # Interface em Next.js
└── docker-compose.yml   # Configuração dos containers
```
