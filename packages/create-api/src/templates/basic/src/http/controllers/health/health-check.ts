import { prisma } from '@/lib/prisma'

export async function healthCheck(request: FastifyRequest, reply: FastifyReply) {
  try {
    await prisma.$queryRaw`SELECT 1`

    const healthInfo = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      database: {
        status: 'connected',
        type: '{{database}}'
      },
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        external: Math.round(process.memoryUsage().external / 1024 / 1024)
      }
    }

    return reply.status(200).send(healthInfo)
  } catch (error) {
    const errorInfo = {
      status: 'error',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      database: {
        status: 'disconnected',
        type: '{{database}}',
        error: error instanceof Error ? error.message : 'Unknown database error'
      }
    }

    return reply.status(503).send(errorInfo)
  }
}