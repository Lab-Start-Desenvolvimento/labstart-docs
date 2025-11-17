import { FastifyRequest, FastifyReply } from 'fastify'
import { makeGetUserService } from '@/services/factories/make-user-services'

export async function verifyAdminRole(request: FastifyRequest, reply: FastifyReply) {
  const getUserProfileService = makeGetUserService()
  const userId = parseInt(request.user.sub)

  const { user } = await getUserProfileService.execute({ userId })

  if (user.role !== 'ADMIN') {
    return reply.status(403).send({
      message: 'Administrator privileges required.'
    })
  }
}