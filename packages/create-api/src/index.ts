import { promptProjectConfig } from './prompts'
import { ProjectGenerator } from './generator'
import { colors, symbols, logError } from './utils'

async function main() {
  try {
    const projectName = process.argv[2]
    
    const config = await promptProjectConfig(projectName)
    
    const generator = new ProjectGenerator(config)
    await generator.generate()
  } catch (error) {
    if (error instanceof Error) {
      logError(error.message)
    } else {
      logError('Erro inesperado durante a criação do projeto')
    }
    process.exit(1)
  }
}

process.on('SIGINT', () => {
  console.log()
  console.log(colors.warning(`${symbols.warning} Operação cancelada pelo usuário`))
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log()
  console.log(colors.warning(`${symbols.warning} Operação interrompida`))
  process.exit(0)
})

main().catch((error) => {
  logError('Erro fatal:')
  console.error(error)
  process.exit(1)
})