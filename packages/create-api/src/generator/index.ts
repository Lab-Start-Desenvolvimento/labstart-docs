import path from 'path'
import fs from 'fs-extra'
import ora from 'ora'
import { promisify } from 'util'
import { ProjectConfig } from '../types'
import { 
  copyTemplate, 
  getTemplatePath, 
  logStep, 
  logSuccess, 
  logError,
  colors,
  symbols
} from '../utils'

export class ProjectGenerator {
  constructor(private config: ProjectConfig) {}

  async generate(): Promise<void> {
    console.log()
    console.log(colors.title(`${symbols.package} Criando projeto: ${this.config.projectName}`))
    console.log()

    try {
      await this.createProjectStructure()
      await this.installDependencies()
      await this.setupDatabase()
      await this.runInitialSetup()
      this.showSuccessMessage()
    } catch (error) {
      logError('Erro durante a criação do projeto:')
      console.error(error)
      process.exit(1)
    }
  }

  private async createProjectStructure(): Promise<void> {
    const spinner = ora('Criando estrutura do projeto...').start()

    try {
      // Criar diretório do projeto
      await fs.ensureDir(this.config.projectPath)

      // Contexto para templates
      const templateContext = {
        projectName: this.config.projectName,
        projectNameCamelCase: this.toCamelCase(this.config.projectName),
        projectNamePascalCase: this.toPascalCase(this.config.projectName),
        database: this.config.database,
        databaseUrl: this.getDatabaseUrl(),
        includeDocker: this.config.includeDocker,
        setupTests: this.config.setupTests,
        setupCI: this.config.setupCI,
        year: new Date().getFullYear(),
        postgresql: this.config.database === 'postgresql',
        mysql: this.config.database === 'mysql'
      }

      // Copiar template base
      const templatePath = path.join(getTemplatePath(), this.config.template)
      await copyTemplate(templatePath, this.config.projectPath, templateContext)

      // Copiar arquivos condicionais
      if (this.config.includeDocker) {
        const dockerTemplatePath = path.join(getTemplatePath(), 'docker')
        await copyTemplate(dockerTemplatePath, this.config.projectPath, templateContext)
      }

      if (this.config.setupCI) {
        const ciTemplatePath = path.join(getTemplatePath(), 'github')
        await copyTemplate(ciTemplatePath, this.config.projectPath, templateContext)
      }

      spinner.succeed('Estrutura do projeto criada')
    } catch (error) {
      spinner.fail('Erro ao criar estrutura do projeto')
      throw error
    }
  }

  private async installDependencies(): Promise<void> {
    const spinner = ora('Instalando dependências...').start()

    try {
      const exec = promisify(require('child_process').exec)
      
      await exec('npm install', {
        cwd: this.config.projectPath
      })

      spinner.succeed('Dependências instaladas')
    } catch (error) {
      spinner.warn('Erro ao instalar dependências - execute manualmente: npm install')
    }
  }
  private async setupDatabase(): Promise<void> {
    const spinner = ora('Configurando banco de dados...').start()

    try {
      const exec = promisify(require('child_process').exec)
      
      await exec('npx prisma generate', {
        cwd: this.config.projectPath
      })

      spinner.succeed('Banco de dados configurado')
    } catch (error) {
      spinner.warn('Erro ao configurar banco - execute manualmente: npm run db:generate')
    }
  }

  private async runInitialSetup(): Promise<void> {
    if (!this.config.setupTests) return

    const spinner = ora('Executando setup inicial...').start()

    try {

      const exec = promisify(require('child_process').exec)
      
      await exec('npm run build', {
        cwd: this.config.projectPath
      })

      spinner.succeed('Setup inicial concluído')
    } catch (error) {
      spinner.warn('Build falhou - você pode executar manualmente depois')
    }
  }

  private showSuccessMessage(): void {
    console.log()
    logSuccess('Projeto criado com sucesso!')
    console.log()
    
    console.log(colors.title('📋 Próximos passos:'))
    console.log()
    console.log(colors.info(`  cd ${this.config.projectName}`))
    console.log(colors.info('  chmod +x scripts/dev-setup.sh'))
    console.log(colors.info('  ./scripts/dev-setup.sh'))
    console.log()
    console.log(colors.subtitle('Ou manualmente:'))
    console.log(colors.info('  cp .env.example .env'))
    
    if (this.config.includeDocker) {
      console.log(colors.info('  docker-compose up -d'))
    }
    
    console.log(colors.info('  npm run db:migrate'))
    console.log(colors.info('  npm run db:seed'))
    console.log(colors.info('  npm run dev'))
    console.log()
    
    console.log(colors.title('🌐 Endpoints disponíveis:'))
    console.log(colors.subtitle('  API: http://localhost:3333'))
    console.log(colors.subtitle('  Health: http://localhost:3333/health'))
    console.log(colors.subtitle('  Users: http://localhost:3333/users'))
    console.log()
    
    if (this.config.includeDocker) {
      console.log(colors.title('🗄️ Banco de dados:'))
      console.log(colors.subtitle(`  ${this.config.database.toUpperCase()}: localhost:${this.getDbPort()}`))
      console.log()
    }
    
    console.log(colors.title('📚 Documentação:'))
    console.log(colors.subtitle('  README.md com instruções completas'))
    console.log(colors.subtitle('  src/ com exemplos da Clean Architecture'))
    console.log()
    
    console.log(colors.success(`${symbols.rocket} Feliz codificação!`))
    console.log()
  }

  private toCamelCase(str: string): string {
    return str
      .replace(/-([a-z])/g, (g) => g[1].toUpperCase())
      .replace(/^[A-Z]/, (g) => g.toLowerCase())
  }

  private toPascalCase(str: string): string {
    return str
      .replace(/-([a-z])/g, (g) => g[1].toUpperCase())
      .replace(/^[a-z]/, (g) => g.toUpperCase())
  }

  private getDatabaseUrl(): string {
    const dbName = this.config.projectName.replace(/-/g, '_')
    
    if (this.config.database === 'postgresql') {
      return `postgresql://postgres:postgres@localhost:5432/${dbName}?schema=public`
    } else {
      return `mysql://root:root@localhost:3306/${dbName}`
    }
  }

  private getDbPort(): number {
    return this.config.database === 'postgresql' ? 5432 : 3306
  }
}