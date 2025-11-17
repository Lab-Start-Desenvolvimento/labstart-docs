import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'
import fastifyCors from '@fastify/cors'
import { ZodError } from 'zod'
import { env } from '@/env'

import { authRoutes } from '@/http/controllers/auth/routes'
import { usersRoutes } from '@/http/controllers/users/routes'
import { healthRoutes } from '@/http/controllers/health/routes'

export const app = fastify({
  logger: env.NODE_ENV === 'development'
})

app.register(fastifyCors, {
  origin: env.NODE_ENV === 'development' ? true : false,
  credentials: true
})

app.register(fastifyCookie)

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  },
})

app.register(healthRoutes)
app.register(authRoutes)
app.register(usersRoutes)

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: Here we should log to an external tool like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})