import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  const adminPasswordHash = await hash('admin123', 6)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@labstart.com' },
    update: {},
    create: {
      name: 'Admin LabStart',
      email: 'admin@labstart.com',
      passwordHash: adminPasswordHash,
      role: 'ADMIN'
    }
  })

  const userPasswordHash = await hash('user123', 6)
  
  const user = await prisma.user.upsert({
    where: { email: 'user@labstart.com' },
    update: {},
    create: {
      name: 'User LabStart',
      email: 'user@labstart.com',
      passwordHash: userPasswordHash,
      role: 'USER'
    }
  })

  console.log('✅ Seed completed!')
  console.log('👤 Admin created:', { id: admin.id, email: admin.email })
  console.log('👤 User created:', { id: user.id, email: user.email })
  console.log()
  console.log('🔑 Login credentials:')
  console.log('Admin: admin@labstart.com / admin123')
  console.log('User: user@labstart.com / user123')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
