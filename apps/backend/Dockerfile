FROM node:18-alpine

WORKDIR /app

# Instalar pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Instalar dependências do sistema
RUN apk add --no-cache \
    openssl \
    netcat-openbsd \
    git

# Copiar arquivos do projeto
COPY package.json pnpm-lock.yaml ./

# Instalar dependências incluindo devDependencies
RUN pnpm install

# Copiar o resto dos arquivos
COPY . .

# Gerar cliente Prisma
RUN pnpm prisma generate

# Script para aguardar o banco e iniciar a aplicação
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Criar diretório de uploads e configurar permissões
RUN mkdir -p /app/public/uploads && \
    chown -R node:node /app && \
    chmod -R 755 /app/public/uploads

# Mudar para o usuário node
USER node

EXPOSE 3001

ENTRYPOINT ["docker-entrypoint.sh"] 