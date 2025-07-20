
import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { verifyAdminRole } from '@/http/middlewares/verify-admin-role'

import { createUser } from './create-user'
import { fetchUsers } from './fetch-users'
import { getUser } from './get-user'
import { getProfile } from './get-profile'

export async function usersRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)
  
  app.get('/me', getProfile)
  
  app.get('/users', fetchUsers)
  
  app.get('/users/:id', getUser)

  app.register(async function adminRoutes(adminApp) {
    adminApp.addHook('onRequest', verifyAdminRole)
        adminApp.post('/users', createUser)
  })
}