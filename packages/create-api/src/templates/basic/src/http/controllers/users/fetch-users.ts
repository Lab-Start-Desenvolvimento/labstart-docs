import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeFetchUsersService } from '@/services/factories/make-user-services'

export async function fetchUsers(request: FastifyRequest, reply: FastifyReply) {
  const fetchUsersQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(20)
  })

  const { page, limit } = fetchUsersQuerySchema.parse(request.query)

  try {
    const fetchUsersService = makeFetchUsersService()

    const { users } = await fetchUsersService.execute({
      page,
      limit
    })

    return reply.status(200).send({
      users,
      pagination: {
        page,
        limit,
        total: users.length
      }
    })
  } catch (err) {
    throw err
  }
}