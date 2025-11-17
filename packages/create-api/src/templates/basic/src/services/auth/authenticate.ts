import { User } from '@prisma/client'
import { compare } from 'bcryptjs'
import { UsersRepository } from '@/repositories/users-repository'
import { InvalidCredentialsError } from '@/services/errors'

interface AuthenticateServiceRequest {
  email: string
  password: string
}

interface AuthenticateServiceResponse {
  user: Omit<User, 'passwordHash'>
}

export class AuthenticateService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    password
  }: AuthenticateServiceRequest): Promise<AuthenticateServiceResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    if (!user.isActive) {
      throw new InvalidCredentialsError()
    }

    const doesPasswordMatch = await compare(password, user.passwordHash)

    if (!doesPasswordMatch) {
      throw new InvalidCredentialsError()
    }

    const { passwordHash, ...userWithoutPassword } = user
    return { user: userWithoutPassword }
  }
}