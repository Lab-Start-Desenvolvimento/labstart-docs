import * as fs from 'fs'
import * as path from 'path'

export interface LabStartProjectStructure {
  isLabStartProject: boolean
  hasCleanArchitecture: boolean
  hasFastify: boolean
  hasPrisma: boolean
  hasZod: boolean
  hasJWT: boolean
  controllersPath?: string
  servicesPath?: string
  repositoriesPath?: string
  confidence: number // 0-100
}

export function detectLabStartProject(rootPath: string): LabStartProjectStructure {
  const result: LabStartProjectStructure = {
    isLabStartProject: false,
    hasCleanArchitecture: false,
    hasFastify: false,
    hasPrisma: false,
    hasZod: false,
    hasJWT: false,
    confidence: 0
  }

  try {
    const srcPath = path.join(rootPath, 'src')
    if (!fs.existsSync(srcPath)) {
      return result
    }

    const requiredPaths = {
      controllers: path.join(srcPath, 'http', 'controllers'),
      services: path.join(srcPath, 'services'),
      repositories: path.join(srcPath, 'repositories'),
      lib: path.join(srcPath, 'lib')
    }

    const existingPaths = Object.entries(requiredPaths).filter(([_, fullPath]) => 
      fs.existsSync(fullPath)
    )

    if (existingPaths.length >= 3) {
      result.hasCleanArchitecture = true
      result.controllersPath = requiredPaths.controllers
      result.servicesPath = requiredPaths.services  
      result.repositoriesPath = requiredPaths.repositories
    }

    const packageJsonPath = path.join(rootPath, 'package.json')
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
      const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies }

      result.hasFastify = 'fastify' in dependencies
      result.hasPrisma = 'prisma' in dependencies || '@prisma/client' in dependencies
      result.hasZod = 'zod' in dependencies
      result.hasJWT = '@fastify/jwt' in dependencies || 'jsonwebtoken' in dependencies
    }

    const specificFiles = [
      path.join(srcPath, 'app.ts'),      
      path.join(srcPath, 'server.ts'),   
      path.join(rootPath, 'prisma', 'schema.prisma') 
    ]

    const existingFiles = specificFiles.filter(filePath => fs.existsSync(filePath))

    let score = 0
    
    if (result.hasCleanArchitecture) score += 40
    if (result.hasFastify) score += 10
    if (result.hasPrisma) score += 10
    if (result.hasZod) score += 10
    if (result.hasJWT) score += 10
    
    score += (existingFiles.length / specificFiles.length) * 20

    result.confidence = Math.round(score)
    result.isLabStartProject = score >= 60 // 60%+ de confiança

    return result

  } catch (error) {
    console.error('Erro ao detectar projeto LabStart:', error)
    return result
  }
}

export function findControllers(projectPath: string): string[] {
  const controllersPath = path.join(projectPath, 'src', 'http', 'controllers')
  
  if (!fs.existsSync(controllersPath)) {
    return []
  }

  const controllers: string[] = []
  
  function scanDirectory(dir: string) {
    const items = fs.readdirSync(dir)
    
    for (const item of items) {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath)
      } else if (item.endsWith('.ts') && !item.includes('.test.') && !item.includes('.spec.')) {
        controllers.push(fullPath)
      }
    }
  }
  
  scanDirectory(controllersPath)
  return controllers
}