import { User } from '@prisma/client'
import { UsersRepository } from '@/repositories/users-repository'

interface GetUsersServiceRequest {
  page?: number
  limit?: number
}

interface GetUsersServiceResponse {
  users: Omit<User, 'passwordHash'>[]
}

export class FetchUsersService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    page = 1,
    limit = 20
  }: GetUsersServiceRequest): Promise<GetUsersServiceResponse> {
    if (page < 1) {
      throw new Error('Page must be greater than 0')
    }

    if (limit < 1 || limit > 100) {
      throw new Error('Limit must be between 1 and 100')
    }

    const users = await this.usersRepository.findMany(page, limit)

    return { users }
  }
}