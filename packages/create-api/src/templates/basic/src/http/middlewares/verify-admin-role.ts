import { FastifyRequest, FastifyReply } from 'fastify'
import { makeGetUserProfileService } from '@/services/factories/make-get-user-profile-service'

export async function verifyAdminRole(request: FastifyRequest, reply: FastifyReply) {
  const getUserProfileService = makeGetUserProfileService()
  const userId = parseInt(request.user.sub)

  const { user } = await getUserProfileService.execute({ userId })

  if (user.role !== 'ADMIN') {
    return reply.status(403).send({
      message: 'Administrator privileges required.'
    })
  }
}