import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { CreateUserService } from '@/services/users/create-user'
import { FetchUsersService } from '@/services/users/fetch-users'
import { GetUserService } from '@/services/users/get-user'

export function makeCreateUserService() {
  const usersRepository = new PrismaUsersRepository()
  const createUserService = new CreateUserService(usersRepository)
  
  return createUserService
}

export function makeGetUsersService() {
  const usersRepository = new PrismaUsersRepository()
  const fetchUsersService = new FetchUsersService(usersRepository)
  
  return fetchUsersService
}

export function makeGetUserService() {
  const usersRepository = new PrismaUsersRepository()
  const getUserService = new GetUserService(usersRepository)
  
  return getUserService
}