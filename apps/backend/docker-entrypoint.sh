#!/bin/sh

# Aguardar o PostgreSQL estar pronto
echo "Aguardando PostgreSQL..."
while ! nc -z postgres 5432; do
  sleep 1
done
echo "PostgreSQL pronto!"

# Gerar e executar migrações
echo "Gerando e executando migrações..."
pnpm prisma migrate dev --name init

# Executar seed
echo "Executando seed..."
pnpm prisma db seed

# Iniciar a aplicação em modo de desenvolvimento
echo "Iniciando aplicação em modo de desenvolvimento..."
pnpm dev 