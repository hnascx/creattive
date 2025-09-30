import jwt, { Secret, SignOptions } from 'jsonwebtoken'
import { env } from "../config/env"
import type { AuthPayload } from "../types"

export function generateToken(username: string): string {
  const options: SignOptions = {
    expiresIn: '24h', // Hardcoded for now
    issuer: "creattive-backend",
    audience: "creattive-frontend",
  }
  
  return jwt.sign({ username }, env.JWT_SECRET, options)
}

export function verifyToken(token: string): AuthPayload {
  return jwt.verify(token, env.JWT_SECRET, {
    issuer: "creattive-backend",
    audience: "creattive-frontend",
  }) as AuthPayload
}

export function extractTokenFromHeader(authorization?: string): string | null {
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return null
  }
  return authorization.slice(7)
}
