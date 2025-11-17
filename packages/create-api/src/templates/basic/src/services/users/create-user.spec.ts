import { describe, it, expect, beforeEach } from 'vitest'
import { CreateUserService } from './create-user'
import { InMemoryUsersRepository } from '@/repositories/fakes/in-memory-users-repository'
import { UserAlreadyExistsError, AdminRequiredError } from '@/services/errors'
import { hash } from 'bcryptjs'

let usersRepository: InMemoryUsersRepository
let sut: CreateUserService 

describe('Create User Service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new CreateUserService(usersRepository)
  })

  it('should create a new user', async () => {
    const admin = await usersRepository.create({
      name: 'Admin',
      email: 'admin@test.com',
      passwordHash: await hash('123456', 6),
      role: 'ADMIN'
    })

    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'john@test.com',
      password: '123456',
      requestingUserId: admin.id
    })

    expect(user.id).toEqual(expect.any(Number))
    expect(user.email).toEqual('john@test.com')
    expect(user.name).toEqual('John Doe')
    expect(user.role).toEqual('USER')
    expect(user).not.toHaveProperty('passwordHash')
  })

  it('should not create user with same email', async () => {
    const admin = await usersRepository.create({
      name: 'Admin',
      email: 'admin@test.com',
      passwordHash: await hash('123456', 6),
      role: 'ADMIN'
    })

    await sut.execute({
      name: 'First User',
      email: 'same@test.com',
      password: '123456',
      requestingUserId: admin.id
    })

    await expect(() =>
      sut.execute({
        name: 'Second User',
        email: 'same@test.com',
        password: '654321',
        requestingUserId: admin.id
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should not create user if requesting user is not admin', async () => {
    const regularUser = await usersRepository.create({
      name: 'Regular User',
      email: 'user@test.com',
      passwordHash: await hash('123456', 6),
      role: 'USER'
    })

    await expect(() =>
      sut.execute({
        name: 'John Doe',
        email: 'john@test.com',
        password: '123456',
        requestingUserId: regularUser.id
      })
    ).rejects.toBeInstanceOf(AdminRequiredError)
  })

  it('should hash user password upon creation', async () => {
    const admin = await usersRepository.create({
      name: 'Admin',
      email: 'admin@test.com',
      passwordHash: await hash('123456', 6),
      role: 'ADMIN'
    })

    await sut.execute({
      name: 'John Doe',
      email: 'john@test.com',
      password: '123456',
      requestingUserId: admin.id
    })

    const userInRepository = usersRepository.items.find(
      item => item.email === 'john@test.com'
    )

    expect(userInRepository?.passwordHash).not.toEqual('123456')
  })
})