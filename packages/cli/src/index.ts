import { Command } from 'commander'
import { scanCommand } from './commands/scan'
import { helpCommand } from './commands/help'
import { colors, symbols } from './utils/colors'

const program = new Command()

program
  .name('labstart-docs')
  .description('Documentação automática para APIs Clean Architecture LabStart')
  .version('0.1.0')

// Comando scan
program
  .command('scan')
  .description('Analisa projeto LabStart Clean Architecture')
  .argument('[path]', 'Caminho do projeto (default: diretório atual)')
  .action(async (path?: string) => {
    await scanCommand(path)
  })

// Comando init (placeholder)
program
  .command('init')
  .description('Setup documentação em projeto existente')
  .action(() => {
    console.log()
    console.log(colors.warning(`${symbols.gear} Comando 'init' em desenvolvimento...`))
    console.log()
    console.log(colors.subtitle('Use por enquanto:'))
    console.log('  npx @labstart/docs scan')
    console.log()
  })

// Comando help customizado
program
  .command('help')
  .description('Mostra ajuda detalhada')
  .action(() => {
    helpCommand()
  })

// Override do help padrão
program.on('--help', () => {
  helpCommand()
})

// Tratamento de comandos não encontrados
program.on('command:*', () => {
  console.log()
  console.log(colors.error(`${symbols.error} Comando desconhecido: ${program.args.join(' ')}`))
  console.log()
  console.log(colors.subtitle('Comandos disponíveis:'))
  console.log('  scan, init, help, version')
  console.log()
  console.log(colors.subtitle('Use --help para mais informações'))
  console.log()
  process.exit(1)
})

// Sem argumentos - mostrar help
if (!process.argv.slice(2).length) {
  helpCommand()
}

program.parse()