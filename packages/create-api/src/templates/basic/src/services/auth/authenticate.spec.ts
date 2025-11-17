import { describe, it, expect, beforeEach } from 'vitest'
import { AuthenticateService } from './authenticate'
import { InMemoryUsersRepository } from '@/repositories/fakes/in-memory-users-repository'
import { InvalidCredentialsError } from '@/services/errors'
import { hash } from 'bcryptjs'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateService 

describe('Authenticate Service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateService(usersRepository)
  })

  it('should authenticate with valid credentials', async () => {
    const email = 'john@test.com'
    const password = '123456'

    await usersRepository.create({
      name: 'John Doe',
      email,
      passwordHash: await hash(password, 6),
      role: 'USER'
    })

    const { user } = await sut.execute({
      email,
      password
    })

    expect(user.id).toEqual(expect.any(Number))
    expect(user.email).toEqual(email)
    expect(user).not.toHaveProperty('passwordHash')
  })

  it('should not authenticate with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'wrong@test.com',
        password: '123456'
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not authenticate with wrong password', async () => {
    const email = 'john@test.com'

    await usersRepository.create({
      name: 'John Doe',
      email,
      passwordHash: await hash('123456', 6),
      role: 'USER'
    })

    await expect(() =>
      sut.execute({
        email,
        password: 'wrong-password'
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not authenticate inactive user', async () => {
    const email = 'john@test.com'
    const password = '123456'

    const user = await usersRepository.create({
      name: 'John Doe',
      email,
      passwordHash: await hash(password, 6),
      role: 'USER'
    })

    await usersRepository.delete(user.id)

    await expect(() =>
      sut.execute({
        email,
        password
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})