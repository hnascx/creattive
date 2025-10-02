FROM node:18-alpine

WORKDIR /app

# Instalar pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copiar arquivos do projeto
COPY package.json pnpm-lock.yaml ./

# Instalar dependências
RUN pnpm install

# Copiar o resto dos arquivos
COPY . .

EXPOSE 3000

CMD ["pnpm", "dev"] 