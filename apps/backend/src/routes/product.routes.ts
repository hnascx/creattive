import { FastifyInstance } from "fastify"
import {
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  updateProduct,
} from "../controllers/product.controller"
import { authMiddleware } from "../middleware/auth.middleware"

export async function productRoutes(app: FastifyInstance) {
  app.get(
    "/products",
    {
      schema: {
        querystring: {
          type: "object",
          properties: {
            page: { type: "string", pattern: "^d+$" },
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
                    description: { type: "string" },
                    price: { type: "number" },
                    expiryDate: { type: "string" },
                    imagePath: { type: ["string", "null"] },
                    createdAt: { type: "string" },
                    updatedAt: { type: "string" },
                    categories: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "string" },
                          name: { type: "string" },
                        },
                      },
                    },
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
    listProducts
  )

  app.get(
    "/products/:id",
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
                  description: { type: "string" },
                  price: { type: "number" },
                  expiryDate: { type: "string" },
                  imagePath: { type: ["string", "null"] },
                  createdAt: { type: "string" },
                  updatedAt: { type: "string" },
                  categories: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        name: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    getProduct
  )

  app.register(async function (protectedRoutes) {
    protectedRoutes.addHook("preHandler", authMiddleware)

    protectedRoutes.post(
      "/products",
      {
        schema: {
          consumes: ["multipart/form-data"],
          body: {
            type: "object",
            required: [
              "name",
              "description",
              "price",
              "expiryDate",
              "categoryIds",
            ],
            properties: {
              name: { type: "string", minLength: 2 },
              description: { type: "string", minLength: 10 },
              price: { type: "number", minimum: 0 },
              expiryDate: { type: "string", format: "date" },
              categoryIds: {
                type: "array",
                items: { type: "string" },
                minItems: 1,
              },
            },
          },
        },
      },
      createProduct
    )

    protectedRoutes.put(
      "/products/:id",
      {
        schema: {
          consumes: ["multipart/form-data"],
          params: {
            type: "object",
            required: ["id"],
            properties: {
              id: { type: "string" },
            },
          },
          body: {
            type: "object",
            properties: {
              name: { type: "string", minLength: 2 },
              description: { type: "string", minLength: 10 },
              price: { type: "number", minimum: 0 },
              expiryDate: { type: "string", format: "date" },
              categoryIds: {
                type: "array",
                items: { type: "string" },
                minItems: 1,
              },
            },
          },
        },
      },
      updateProduct
    )

    protectedRoutes.delete(
      "/products/:id",
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
      deleteProduct
    )
  })
}
