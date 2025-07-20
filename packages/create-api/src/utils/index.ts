import chalk from 'chalk'
import fs from 'fs-extra'
import path from 'path'
import validatePackageName from 'validate-npm-package-name'

export const colors = {
  success: chalk.green,
  error: chalk.red,
  warning: chalk.yellow,
  info: chalk.blue,
  title: chalk.bold.cyan,
  subtitle: chalk.gray,
  highlight: chalk.white.bold
}

export const symbols = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️',
  rocket: '🚀',
  package: '📦',
  gear: '⚙️',
  database: '🗄️',
  docker: '🐳',
  test: '🧪'
}

export function validateProjectName(name: string): string | null {
  const validation = validatePackageName(name)
  
  if (!validation.validForNewPackages) {
    return validation.errors?.[0] || validation.warnings?.[0] || 'Invalid package name'
  }
  
  return null
}

export function formatProjectName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-')
}

export async function ensureDir(dirPath: string): Promise<void> {
  await fs.ensureDir(dirPath)
}

export async function copyTemplate(
  sourcePath: string,
  destPath: string,
  context: Record<string, any>
): Promise<void> {
  const stat = await fs.stat(sourcePath)
  
  if (stat.isDirectory()) {
    await ensureDir(destPath)
    const files = await fs.readdir(sourcePath)
    
    for (const file of files) {
      await copyTemplate(
        path.join(sourcePath, file),
        path.join(destPath, file),
        context
      )
    }
  } else {
    const content = await fs.readFile(sourcePath, 'utf8')
    
    if (sourcePath.endsWith('.mustache')) {
      const mustache = require('mustache')
      const processed = mustache.render(content, context)
      const finalDestPath = destPath.replace('.mustache', '')
      await fs.writeFile(finalDestPath, processed)
    } else {
      await fs.copy(sourcePath, destPath)
    }
  }
}

export function getTemplatePath(): string {
  return path.join(__dirname, '..', '..', 'templates')
}

export function logStep(step: string, description: string): void {
  console.log(colors.info(`${symbols.gear} ${step}`), colors.subtitle(description))
}

export function logSuccess(message: string): void {
  console.log(colors.success(`${symbols.success} ${message}`))
}

export function logError(message: string): void {
  console.log(colors.error(`${symbols.error} ${message}`))
}

export function logWarning(message: string): void {
  console.log(colors.warning(`${symbols.warning} ${message}`))
}