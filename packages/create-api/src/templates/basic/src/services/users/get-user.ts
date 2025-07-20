import { User } from '@prisma/client'
import { UsersRepository } from '@/repositories/users-repository'
import { UserNotFoundError } from '@/services/errors'

interface GetUserServiceRequest {
  userId: number
}

interface GetUserServiceResponse {
  user: Omit<User, 'passwordHash'>
}

export class GetUserService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId
  }: GetUserServiceRequest): Promise<GetUserServiceResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    return { user }
  }
}