import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeCreateUserService } from '@/services/factories/make-user-services'
import { UserAlreadyExistsError, AdminRequiredError } from '@/services/errors'

export async function createUser(request: FastifyRequest, reply: FastifyReply) {
  const createUserBodySchema = z.object({
    name: z.string().min(2, 'Name must have at least 2 characters'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must have at least 6 characters'),
    role: z.enum(['USER', 'ADMIN']).optional().default('USER')
  })

  const { name, email, password, role } = createUserBodySchema.parse(request.body)

  try {
    const createUserService = makeCreateUserService()

    const requestingUserId = parseInt(request.user.sub)

    const { user } = await createUserService.execute({
      name,
      email,
      password,
      role,
      requestingUserId
    })

    return reply.status(201).send({ user })
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }

    if (err instanceof AdminRequiredError) {
      return reply.status(403).send({ message: err.message })
    }

    throw err
  }
}