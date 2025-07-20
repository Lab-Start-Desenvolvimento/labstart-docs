import { User } from '@prisma/client'
import { hash } from 'bcryptjs'
import { UsersRepository } from '@/repositories/users-repository'
import { UserAlreadyExistsError, AdminRequiredError } from '@/services/errors'

interface CreateUserServiceRequest {
  name: string
  email: string
  password: string
  role?: 'USER' | 'ADMIN'
  requestingUserId: number
}

interface CreateUserServiceResponse {
  user: Omit<User, 'passwordHash'>
}

export class CreateUserService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
    role = 'USER',
    requestingUserId
  }: CreateUserServiceRequest): Promise<CreateUserServiceResponse> {
    const requestingUser = await this.usersRepository.findById(requestingUserId)
    if (!requestingUser || requestingUser.role !== 'ADMIN') {
      throw new AdminRequiredError()
    }

    const userExists = await this.usersRepository.findByEmail(email)
    if (userExists) {
      throw new UserAlreadyExistsError()
    }

    if (name.trim().length < 2) {
      throw new Error('Name must have at least 2 characters')
    }

    const passwordHash = await hash(password, 6)

    const user = await this.usersRepository.create({
      name: name.trim(),
      email: email.toLowerCase(),
      passwordHash,
      role
    })

    const { passwordHash: _, ...userWithoutPassword } = user
    return { user: userWithoutPassword }
  }
}