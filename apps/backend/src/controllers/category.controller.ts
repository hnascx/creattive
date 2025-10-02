import { Prisma } from "@prisma/client"
import { FastifyReply, FastifyRequest } from "fastify"
import { prisma } from "../config/database"

export async function listCategories(
  request: FastifyRequest<{
    Querystring: {
      search?: string
      page?: string
    }
  }>,
  reply: FastifyReply
) {
  const search = request.query.search?.trim()
  const page = Math.max(1, parseInt(request.query.page || "1"))
  const limit = 20 

  const where = search
    ? {
        name: {
          contains: search,
          mode: "insensitive" as Prisma.QueryMode,
        },
      }
    : {}

  const [categories, total] = await Promise.all([
    prisma.category.findMany({
      where,
      orderBy: { name: "asc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.category.count({ where }),
  ])

  const totalPages = Math.ceil(total / limit)
  const hasNext = page < totalPages
  const hasPrev = page > 1

  return reply.send({
    success: true,
    data: categories,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext,
      hasPrev,
    },
  })
}

export async function getCategory(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const { id } = request.params

  const category = await prisma.category.findUnique({
    where: { id },
  })

  if (!category) {
    return reply.status(404).send({
      success: false,
      message: "Categoria não encontrada",
    })
  }

  return reply.send({
    success: true,
    data: category,
  })
}

export async function createCategory(
  request: FastifyRequest<{ Body: { name: string } }>,
  reply: FastifyReply
) {
  const { name } = request.body

  try {
    const category = await prisma.category.create({
      data: { name },
    })

    return reply.status(201).send({
      success: true,
      message: "Categoria criada com sucesso",
      data: category,
    })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return reply.status(400).send({
        success: false,
        message: "Já existe uma categoria com este nome",
      })
    }
    throw error
  }
}

export async function updateCategory(
  request: FastifyRequest<{
    Params: { id: string }
    Body: { name: string }
  }>,
  reply: FastifyReply
) {
  const { id } = request.params
  const { name } = request.body

  try {
    const category = await prisma.category.update({
      where: { id },
      data: { name },
    })

    return reply.send({
      success: true,
      message: "Categoria atualizada com sucesso",
      data: category,
    })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return reply.status(404).send({
        success: false,
        message: "Categoria não encontrada",
      })
    }
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return reply.status(400).send({
        success: false,
        message: "Já existe uma categoria com este nome",
      })
    }
    throw error
  }
}

export async function deleteCategory(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const { id } = request.params

  try {
    await prisma.category.delete({
      where: { id },
    })

    return reply.send({
      success: true,
      message: "Categoria excluída com sucesso",
    })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return reply.status(404).send({
        success: false,
        message: "Categoria não encontrada",
      })
    }
    throw error
  }
}
