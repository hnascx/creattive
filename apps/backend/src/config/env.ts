import { config } from "dotenv"
import type { Secret } from "jsonwebtoken"
import { z } from "zod"

config()

const envSchema = z.object({
  DATABASE_URL: z.string().url(),

  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET must be at least 32 characters")
    .transform((val) => val as Secret),
  JWT_EXPIRES_IN: z.enum(["1h", "24h", "7d", "30d"]).default("24h"),

  // Admin credentials
  ADMIN_USERNAME: z.string().min(3),
  ADMIN_PASSWORD: z.string().min(6),

  PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default("3001"),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  // CORS
  FRONTEND_URL: z.string().url().default("http://localhost:3000"),

  MAX_FILE_SIZE: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default("2097152"), // 2MB
  UPLOAD_PATH: z.string().default("../frontend/public/product-images"),
})

export type Env = z.infer<typeof envSchema>

const result = envSchema.safeParse(process.env)

if (!result.success) {
  console.error("❌ Invalid environment variables:")
  console.error(result.error.format())
  process.exit(1)
}

export const env = result.data
