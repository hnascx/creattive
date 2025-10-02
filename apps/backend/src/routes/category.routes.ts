import { FastifyInstance } from "fastify"
import {
  createCategory,
  deleteCategory,
  getCategory,
  listCategories,
  updateCategory,
} from "../controllers/category.controller"
import { authMiddleware } from "../middleware/auth.middleware"

export async function categoryRoutes(app: FastifyInstance) {
  app.get(
    "/categories",
    {
      schema: {
        querystring: {
          type: "object",
          properties: {
            page: { type: "string", pattern: "^\\d+$" },
            search: { type: "string" },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    name: { type: "string" },
                    createdAt: { type: "string" },
                    updatedAt: { type: "string" },
                  },
                },
              },
              pagination: {
                type: "object",
                properties: {
                  page: { type: "number" },
                  limit: { type: "number" },
                  total: { type: "number" },
                  totalPages: { type: "number" },
                  hasNext: { type: "boolean" },
                  hasPrev: { type: "boolean" },
                },
              },
            },
          },
        },
      },
    },
    listCategories
  )

  app.get(
    "/categories/:id",
    {
      schema: {
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "string" },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              data: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  name: { type: "string" },
                  createdAt: { type: "string" },
                  updatedAt: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
    getCategory
  )

  app.register(async function (protectedRoutes) {
    protectedRoutes.addHook("preHandler", authMiddleware)

    protectedRoutes.post(
      "/categories",
      {
        schema: {
          body: {
            type: "object",
            required: ["name"],
            properties: {
              name: { type: "string", minLength: 2 },
            },
          },
        },
      },
      createCategory
    )

    protectedRoutes.put(
      "/categories/:id",
      {
        schema: {
          params: {
            type: "object",
            required: ["id"],
            properties: {
              id: { type: "string" },
            },
          },
          body: {
            type: "object",
            required: ["name"],
            properties: {
              name: { type: "string", minLength: 2 },
            },
          },
        },
      },
      updateCategory
    )

    protectedRoutes.delete(
      "/categories/:id",
      {
        schema: {
          params: {
            type: "object",
            required: ["id"],
            properties: {
              id: { type: "string" },
            },
          },
        },
      },
      deleteCategory
    )
  })
}
