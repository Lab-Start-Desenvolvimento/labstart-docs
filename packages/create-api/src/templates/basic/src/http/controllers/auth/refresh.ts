import { FastifyRequest, FastifyReply } from 'fastify'
import { makeGetUserService } from '@/services/factories/make-user-services'
import { UserNotFoundError } from '@/services/errors'

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify({ onlyCookie: true })

    const getUserService = makeGetUserService()
    const userId = parseInt(request.user.sub)

    const { user } = await getUserService.execute({
      userId
    })

    const token = await reply.jwtSign(
      {
        role: user.role
      },
      {
        sign: {
          sub: user.id.toString()
        }
      }
    )

    const refreshToken = await reply.jwtSign(
      {
        role: user.role
      },
      {
        sign: {
          sub: user.id.toString(),
          expiresIn: '7d'
        }
      }
    )

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true
      })
      .status(200)
      .send({
        user,
        token
      })
  } catch (err) {
    if (err instanceof UserNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    return reply.status(401).send({ message: 'Unauthorized.' })
  }
}