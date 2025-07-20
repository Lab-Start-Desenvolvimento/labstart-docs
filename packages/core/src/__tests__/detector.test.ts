import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('fs', () => ({
  existsSync: vi.fn(),
  readFileSync: vi.fn(),
  readdirSync: vi.fn(),
  statSync: vi.fn()
}))

import { detectLabStartProject, findControllers } from '../detector'
import * as fs from 'fs'

describe('LabStart Project Detector', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('detectLabStartProject', () => {
    it('should detect complete LabStart project', () => {
      vi.mocked(fs.existsSync).mockImplementation((filePath: any) => {
        const pathStr = String(filePath)
        return (
          pathStr.includes('src') ||
          pathStr.includes('controllers') ||
          pathStr.includes('services') ||
          pathStr.includes('repositories') ||
          pathStr.includes('lib') ||
          pathStr.includes('package.json') ||
          pathStr.includes('app.ts') ||
          pathStr.includes('server.ts') ||
          pathStr.includes('schema.prisma')
        )
      })

      vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify({
        dependencies: {
          'fastify': '^4.0.0',
          '@prisma/client': '^5.0.0',
          'zod': '^3.0.0'
        },
        devDependencies: {
          '@fastify/jwt': '^7.0.0'
        }
      }) as any)

      const result = detectLabStartProject('/fake/project')

      expect(result.isLabStartProject).toBe(true)
      expect(result.hasCleanArchitecture).toBe(true)
      expect(result.hasFastify).toBe(true)
      expect(result.hasPrisma).toBe(true)
      expect(result.hasZod).toBe(true)
      expect(result.hasJWT).toBe(true)
      expect(result.confidence).toBeGreaterThan(80)
    })

    it('should not detect non-LabStart project', () => {
      vi.mocked(fs.existsSync).mockImplementation((filePath: any) => {
        const pathStr = String(filePath)

        return pathStr.includes('src') && 
               !pathStr.includes('controllers') && 
               !pathStr.includes('services') && 
               !pathStr.includes('repositories')
      })

      vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify({
        dependencies: {
          'express': '^4.0.0',
          'mongoose': '^7.0.0'
        }
      }) as any)

      const result = detectLabStartProject('/fake/express-project')

      expect(result.isLabStartProject).toBe(false)
      expect(result.hasCleanArchitecture).toBe(false)
      expect(result.confidence).toBeLessThan(60)
    })

    it('should handle project without src folder', () => {
      vi.mocked(fs.existsSync).mockReturnValue(false)

      const result = detectLabStartProject('/fake/empty-project')

      expect(result.isLabStartProject).toBe(false)
      expect(result.confidence).toBe(0)
    })
  })

  describe('findControllers', () => {
    it('should find all controller files', () => {
      vi.mocked(fs.existsSync).mockReturnValue(true)
      
      vi.mocked(fs.readdirSync).mockImplementation((dir: any) => {
        const pathStr = String(dir)
        
        if (pathStr.includes('controllers') && !pathStr.includes('users') && !pathStr.includes('products')) {
          return ['users', 'products'] as any  
        }
        if (pathStr.includes('users')) {
          return ['create-user.ts', 'get-users.ts'] as any  
        }
        if (pathStr.includes('products')) {
          return ['list-products.ts'] as any  
        }
        return [] as any  
      })

      vi.mocked(fs.statSync).mockImplementation((filePath: any) => {
        const pathStr = String(filePath)
        return {
          isDirectory: () => !pathStr.endsWith('.ts'),
          isFile: () => pathStr.endsWith('.ts')
        } as any
      })

      const controllers = findControllers('/fake/project')

      expect(controllers.length).toBeGreaterThan(0)
      expect(vi.mocked(fs.readdirSync)).toHaveBeenCalled()
    })

    it('should return empty array when controllers folder does not exist', () => {
      vi.mocked(fs.existsSync).mockReturnValue(false)

      const controllers = findControllers('/fake/project')

      expect(controllers).toEqual([])
    })
  })
})