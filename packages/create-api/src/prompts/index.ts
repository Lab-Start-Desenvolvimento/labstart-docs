import inquirer from 'inquirer'
import path from 'path'
import fs from 'fs-extra'
import { ProjectConfig } from '../types'
import { validateProjectName, formatProjectName, colors, symbols } from '../utils'

export async function promptProjectConfig(projectName?: string): Promise<ProjectConfig> {
  console.log()
  console.log(colors.title(`${symbols.rocket} LabStart API Generator v0.1.0`))
  console.log()
  console.log(colors.subtitle('Vamos criar seu projeto LabStart com Clean Architecture!'))
  console.log()

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'Nome do projeto:',
      default: projectName || 'minha-api-labstart',
      validate: (input: string) => {
        const formatted = formatProjectName(input)
        const error = validateProjectName(formatted)
        if (error) return error
        
        const projectPath = path.resolve(process.cwd(), formatted)
        if (fs.existsSync(projectPath)) {
          return `Diretório "${formatted}" já existe`
        }
        
        return true
      },
      filter: (input: string) => formatProjectName(input)
    },
    {
      type: 'list',
      name: 'template',
      message: 'Escolha o template:',
      choices: [
        {
          name: 'Basic - API simples (users + auth + health)',
          value: 'basic',
          short: 'Basic'
        },
        {
          name: 'Full - API completa (users + products + orders)',
          value: 'full',
          short: 'Full'
        }
      ],
      default: 'basic'
    },
    {
      type: 'list',
      name: 'database',
      message: 'Banco de dados:',
      choices: [
        {
          name: 'PostgreSQL (recomendado)',
          value: 'postgresql',
          short: 'PostgreSQL'
        },
        {
          name: 'MySQL',
          value: 'mysql',
          short: 'MySQL'
        }
      ],
      default: 'postgresql'
    },
    {
      type: 'confirm',
      name: 'includeDocker',
      message: 'Incluir Docker Compose?',
      default: true
    },
    {
      type: 'confirm',
      name: 'setupTests',
      message: 'Configurar testes (Vitest + Supertest)?',
      default: true
    },
    {
      type: 'confirm',
      name: 'setupCI',
      message: 'Setup CI/CD (GitHub Actions)?',
      default: true
    }
  ])

  const projectPath = path.resolve(process.cwd(), answers.projectName)

  return {
    projectName: answers.projectName,
    projectPath,
    database: answers.database,
    includeDocker: answers.includeDocker,
    setupTests: answers.setupTests,
    setupCI: answers.setupCI,
    template: answers.template
  }
}