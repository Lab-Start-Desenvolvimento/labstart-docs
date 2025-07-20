import { prisma } from '@/lib/prisma'
import { Prisma, User } from '@prisma/client'
import { UsersRepository } from '../users-repository'

export class PrismaUsersRepository implements UsersRepository {
  async create(data: Prisma.UserCreateInput) {
    return await prisma.user.create({
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        passwordHash: false
      }
    }) as User
  }

  async findById(id: number) {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        passwordHash: false
      }
    }) as User | null
  }

  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email }
    })
  }

  async findMany(page = 1, limit = 20) {
    const skip = (page - 1) * limit
    
    return await prisma.user.findMany({
      skip,
      take: limit,
      where: {
        isActive: true
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        passwordHash: false
      },
      orderBy: {
        createdAt: 'desc'
      }
    }) as User[]
  }

  async save(user: User) {
    return await prisma.user.update({
      where: { id: user.id },
      data: user,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        passwordHash: false
      }
    }) as User
  }

  async delete(id: number) {
    await prisma.user.update({
      where: { id },
      data: { isActive: false }
    })
  }
}