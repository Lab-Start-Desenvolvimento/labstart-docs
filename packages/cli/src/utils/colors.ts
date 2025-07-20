import chalk from 'chalk'

export const colors = {
  success: chalk.green,
  error: chalk.red,
  warning: chalk.yellow,
  info: chalk.blue,
  
  title: chalk.bold.cyan,
  subtitle: chalk.gray,
  highlight: chalk.white.bold,
  
  checkmark: chalk.green('✅'),
  cross: chalk.red('❌'),
  warningIcon: chalk.yellow('⚠️'),  
  infoIcon: chalk.blue('ℹ️'),
  
  logo: chalk.blue.bold,
  confidence: (score: number) => {
    if (score >= 80) return chalk.green.bold
    if (score >= 60) return chalk.yellow.bold
    return chalk.red.bold
  },
  
  architecture: chalk.blue('🏗️'),
  fastify: chalk.white('⚡'),
  prisma: chalk.cyan('🗄️'),
  zod: chalk.magenta('🔒'),    
  jwt: chalk.yellow('🔑'),     
  files: chalk.gray('📁')
}

export const symbols = {
  success: '✅',
  error: '❌', 
  warning: '⚠️',
  info: 'ℹ️',
  search: '🔍',
  folder: '📁',
  file: '📄',
  rocket: '🚀',
  gear: '⚙️',
  chart: '📊'
}