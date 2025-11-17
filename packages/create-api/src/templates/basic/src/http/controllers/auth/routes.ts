import { FastifyInstance } from 'fastify'
import { authenticate } from './authenticate'
import { refresh } from './refresh'

export async function authRoutes(app: FastifyInstance) {
  // ROTAS PÚBLICAS
  app.post('/sessions', authenticate)
  app.patch('/token/refresh', refresh)
}