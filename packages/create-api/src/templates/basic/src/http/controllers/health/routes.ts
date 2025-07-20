import { FastifyInstance } from 'fastify'
import { healthCheck } from './health-check'

export async function healthRoutes(app: FastifyInstance) {
  // ROTA PÚBLICA
  app.get('/health', healthCheck)
}