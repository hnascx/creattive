import { Prisma } from "@prisma/client"
import { FastifyReply, FastifyRequest } from "fastify"
import fs from "fs/promises"
import path from "path"
import { prisma } from "../config/database"
import { env } from "../config/env"
import { createProductSchema, updateProductSchema } from "../schemas/product.schema"
import { z } from "zod"

export async function listProducts(
  request: FastifyRequest<{
    Querystring: {
      page?: string
      search?: string
    }
  }>,
  reply: FastifyReply
) {
  const page = Number(request.query.page) || 1
  const limit = 20
  const search = request.query.search?.trim()

  const where = search
    ? {
        OR: [
          {
            name: { contains: search, mode: "insensitive" as Prisma.QueryMode },
          },
          {
            description: {
              contains: search,
              mode: "insensitive" as Prisma.QueryMode,
            },
          },
        ],
      }
    : {}

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ])

  const totalPages = Math.ceil(total / limit)

  return reply.send({
    success: true,
    data: products.map((product) => ({
      ...product,
      categories: product.categories.map((pc) => pc.category),
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  })
}

export async function getProduct(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const { id } = request.params

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      categories: {
        include: {
          category: true,
        },
      },
    },
  })

  if (!product) {
    return reply.status(404).send({
      success: false,
      message: "Produto não encontrado",
    })
  }

  return reply.send({
    success: true,
    data: {
      ...product,
      categories: product.categories.map((pc) => pc.category),
    },
  })
}

export async function createProduct(
  request: FastifyRequest<{
    Body: {
      name: string
      description: string
      price: number
      expiryDate: string
      categoryIds: string[]
      imageUrl?: string
    }
  }>,
  reply: FastifyReply
) {
  try {
    const validatedData = createProductSchema.parse(request.body)

    const product = await prisma.product.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        price: new Prisma.Decimal(validatedData.price),
        expiryDate: new Date(validatedData.expiryDate),
        imagePath: validatedData.imageUrl,
        categories: {
          create: validatedData.categoryIds.map((categoryId) => ({
            categoryId,
          })),
        },
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    })

    return reply.status(201).send({
      success: true,
      message: "Produto criado com sucesso",
      data: {
        ...product,
        categories: product.categories.map((pc) => pc.category),
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        success: false,
        message: "Dados inválidos",
        errors: error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      })
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return reply.status(400).send({
          success: false,
          message: "Já existe um produto com este nome",
        })
      }
      if (error.code === "P2003") {
        return reply.status(400).send({
          success: false,
          message: "Uma ou mais categorias não existem",
        })
      }
    }
    throw error
  }
}

export async function updateProduct(
  request: FastifyRequest<{
    Params: { id: string }
    Body: Partial<{
      name: string
      description: string
      price: number
      expiryDate: string
      categoryIds: string[]
      imageUrl: string
    }>
  }>,
  reply: FastifyReply
) {
  try {
    const validatedData = updateProductSchema.parse(request.body)

    const product = await prisma.product.update({
      where: { id: request.params.id },
      data: {
        ...(validatedData.name && { name: validatedData.name }),
        ...(validatedData.description && {
          description: validatedData.description,
        }),
        ...(validatedData.price && {
          price: new Prisma.Decimal(validatedData.price),
        }),
        ...(validatedData.expiryDate && {
          expiryDate: new Date(validatedData.expiryDate),
        }),
        ...(validatedData.imageUrl && { imagePath: validatedData.imageUrl }),
        ...(validatedData.categoryIds && {
          categories: {
            deleteMany: {},
            create: validatedData.categoryIds.map((categoryId) => ({
              categoryId,
            })),
          },
        }),
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    })

    return reply.send({
      success: true,
      message: "Produto atualizado com sucesso",
      data: {
        ...product,
        categories: product.categories.map((pc) => pc.category),
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        success: false,
        message: "Dados inválidos",
        errors: error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      })
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return reply.status(400).send({
          success: false,
          message: "Já existe um produto com este nome",
        })
      }
      if (error.code === "P2003") {
        return reply.status(400).send({
          success: false,
          message: "Uma ou mais categorias não existem",
        })
      }
      if (error.code === "P2025") {
        return reply.status(404).send({
          success: false,
          message: "Produto não encontrado",
        })
      }
    }
    throw error
  }
}

export async function deleteProduct(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const { id } = request.params

  try {
    const product = await prisma.product.delete({
      where: { id },
      select: { imagePath: true },
    })

    if (product.imagePath) {
      const filepath = path.join(env.UPLOAD_PATH, product.imagePath)
      await fs.unlink(filepath).catch(() => {})
    }

    return reply.send({
      success: true,
      message: "Produto excluído com sucesso",
    })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return reply.status(404).send({
          success: false,
          message: "Produto não encontrado",
        })
      }
    }
    throw error
  }
}
