import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeGetUserService } from '@/services/factories/make-user-services'
import { UserNotFoundError } from '@/services/errors'

export async function getUser(request: FastifyRequest, reply: FastifyReply) {
  const getUserParamsSchema = z.object({
    id: z.coerce.number().min(1)
  })

  const { id } = getUserParamsSchema.parse(request.params)

  try {
    const getUserService = makeGetUserService()

    const { user } = await getUserService.execute({
      userId: id
    })

    return reply.status(200).send({ user })
  } catch (err) {
    if (err instanceof UserNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    throw err
  }
}