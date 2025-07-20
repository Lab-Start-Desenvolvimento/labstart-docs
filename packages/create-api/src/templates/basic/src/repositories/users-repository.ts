import { User, Prisma } from '@prisma/client'

export interface UsersRepository {
  create(data: Prisma.UserCreateInput): Promise<User>
  findById(id: number): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  findMany(page?: number, limit?: number): Promise<User[]>
  save(user: User): Promise<User>
  delete(id: number): Promise<void>
}