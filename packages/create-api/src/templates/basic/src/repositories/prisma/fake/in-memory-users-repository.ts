import { Prisma, User } from '@prisma/client'
import { UsersRepository } from '../users-repository'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async create(data: Prisma.UserCreateInput) {
    const user: User = {
      id: this.items.length + 1,
      name: data.name,
      email: data.email,
      passwordHash: data.passwordHash,
      role: data.role || 'USER',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.items.push(user)

    const { passwordHash, ...userWithoutPassword } = user
    return userWithoutPassword as User
  }

  async findById(id: number) {
    const user = this.items.find(item => item.id === id && item.isActive)
    
    if (!user) return null

    const { passwordHash, ...userWithoutPassword } = user
    return userWithoutPassword as User
  }

  async findByEmail(email: string) {
    const user = this.items.find(item => item.email === email && item.isActive)
    return user || null
  }

  async findMany(page = 1, limit = 20) {
    const skip = (page - 1) * limit
    const activeUsers = this.items.filter(item => item.isActive)
    
    const users = activeUsers
      .slice(skip, skip + limit)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    return users.map(user => {
      const { passwordHash, ...userWithoutPassword } = user
      return userWithoutPassword as User
    })
  }

  async save(user: User) {
    const itemIndex = this.items.findIndex(item => item.id === user.id)

    if (itemIndex >= 0) {
      this.items[itemIndex] = { ...user, updatedAt: new Date() }
      
      const { passwordHash, ...userWithoutPassword } = this.items[itemIndex]
      return userWithoutPassword as User
    }

    throw new Error('User not found')
  }

  async delete(id: number) {
    const itemIndex = this.items.findIndex(item => item.id === id)

    if (itemIndex >= 0) {
      this.items[itemIndex].isActive = false
      this.items[itemIndex].updatedAt = new Date()
    }
  }
}