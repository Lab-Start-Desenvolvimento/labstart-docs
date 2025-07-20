import { FastifyRequest, FastifyReply } from 'fastify'
import { makeGetUserService } from '@/services/factories/make-user-services'
import { UserNotFoundError } from '@/services/errors'

export async function getProfile(request: FastifyRequest, reply: FastifyReply) {
  try {
    const getUserService = makeGetUserService()

    const userId = parseInt(request.user.sub)

    const { user } = await getUserService.execute({
      userId
    })

    return reply.status(200).send({ user })
  } catch (err) {
    if (err instanceof UserNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    throw err
  }
}