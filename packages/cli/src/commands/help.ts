import { colors, symbols } from '../utils/colors'

export function helpCommand() {
  console.log()
  console.log(colors.title(`${symbols.rocket} LabStart Docs CLI v0.1.0`))
  console.log()
  console.log(colors.subtitle('Documentação automática para APIs Clean Architecture LabStart'))
  console.log()
  
  console.log(colors.highlight('USAGE:'))
  console.log('  npx @labstart/docs <command> [options]')
  console.log()
  
  console.log(colors.highlight('COMMANDS:'))
  console.log(`  ${colors.info('scan')}           Analisa projeto LabStart`)
  console.log(`  ${colors.info('scan <path>')}    Analisa projeto em path específico`)
  console.log(`  ${colors.info('init')}           Setup documentação em projeto existente`)
  console.log(`  ${colors.info('help')}           Mostra esta ajuda`)
  console.log(`  ${colors.info('version')}        Mostra versão`)
  console.log()
  
  console.log(colors.highlight('EXAMPLES:'))
  console.log('  npx @labstart/docs scan')
  console.log('  npx @labstart/docs scan ./meu-projeto')
  console.log('  npx @labstart/docs init')
  console.log('  npx @labstart/docs --help')
  console.log()
  
  console.log(colors.highlight('MAIS INFORMAÇÕES:'))
  console.log(`  ${colors.info('GitHub:')} https://github.com/labstart/labstart-docs`)
  console.log(`  ${colors.info('Docs:')}   https://docs.labstart.com.br`)
  console.log()
}