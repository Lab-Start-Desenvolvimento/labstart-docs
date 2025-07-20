import * as path from 'path'
import { detectLabStartProject, findControllers } from '../../../core/dist/index'
import { colors, symbols } from '../utils/colors'
import ora from 'ora'

export async function scanCommand(targetPath?: string) {
  const projectPath = targetPath ? path.resolve(targetPath) : process.cwd()
  
  // Header
  console.log()
  console.log(colors.title(`${symbols.search} LabStart Docs Scanner v0.1.0`))
  console.log()
  console.log(colors.subtitle(`${symbols.folder} Analyzing: ${projectPath}`))
  console.log()
  
  // Spinner durante análise
  const spinner = ora('Detecting project structure...').start()
  
  try {
    // Análise do projeto
    const analysis = detectLabStartProject(projectPath)
    const controllers = findControllers(projectPath)
    
    spinner.stop()
    
    if (!analysis.isLabStartProject) {
      console.log(colors.error(`${symbols.error} Not a LabStart Clean Architecture project`))
      console.log()
      console.log(colors.subtitle('Requirements:'))
      console.log(`├── ${analysis.hasCleanArchitecture ? colors.checkmark : colors.cross} Clean Architecture structure`)
      console.log(`├── ${analysis.hasFastify ? colors.checkmark : colors.cross} Fastify framework`)
      console.log(`├── ${analysis.hasPrisma ? colors.checkmark : colors.cross} Prisma ORM`)
      console.log(`├── ${analysis.hasZod ? colors.checkmark : colors.cross} Zod validation`)
      console.log(`└── ${analysis.hasJWT ? colors.checkmark : colors.cross} JWT authentication`)
      console.log()
      console.log(colors.subtitle(`${symbols.chart} Confidence: ${colors.confidence(analysis.confidence)(`${analysis.confidence}%`)}`))
      return
    }
    
    // Projeto detectado com sucesso
    console.log(colors.success(`${symbols.success} LabStart Clean Architecture detected!`))
    console.log()
    
    // Score breakdown
    console.log(colors.subtitle('Architecture Analysis:'))
    console.log(`├── ${colors.architecture} Clean Architecture: ${colors.checkmark} (40 pts)`)
    console.log(`├── ${colors.fastify} Fastify: ${analysis.hasFastify ? colors.checkmark : colors.cross} (10 pts)`)
    console.log(`├── ${colors.prisma} Prisma: ${analysis.hasPrisma ? colors.checkmark : colors.cross} (10 pts)`)
    console.log(`├── ${colors.zod} Zod: ${analysis.hasZod ? colors.checkmark : colors.cross} (10 pts)`)
    console.log(`├── ${colors.jwt} JWT: ${analysis.hasJWT ? colors.checkmark : colors.cross} (10 pts)`)
    console.log(`└── ${colors.files} Files: ${colors.checkmark} (${Math.round((20/3))} pts)`)
    console.log()
    
    // Confidence score
    const confidenceLabel = getConfidenceLabel(analysis.confidence)
    console.log(colors.subtitle(`${symbols.chart} Confidence: ${colors.confidence(analysis.confidence)(`${analysis.confidence}% (${confidenceLabel})`)}`))
    console.log()
    
    // Files found
    console.log(colors.subtitle(`${symbols.file} Found:`))
    console.log(`├── Controllers: ${colors.highlight(controllers.length.toString())} files`)
    if (analysis.controllersPath) {
      console.log(`│   └── ${colors.subtitle(analysis.controllersPath)}`)
    }
    if (analysis.servicesPath) {
      console.log(`├── Services: ${colors.subtitle('detected')}`)
      console.log(`│   └── ${colors.subtitle(analysis.servicesPath)}`)
    }
    if (analysis.repositoriesPath) {
      console.log(`└── Repositories: ${colors.subtitle('detected')}`)
      console.log(`    └── ${colors.subtitle(analysis.repositoriesPath)}`)
    }
    console.log()
    
    // Next steps
    if (analysis.confidence >= 80) {
      console.log(colors.success(`${symbols.rocket} Ready for documentation generation!`))
    } else if (analysis.confidence >= 60) {
      console.log(colors.warning(`${symbols.warning} Project partially ready. Consider adding missing dependencies.`))
    }
    console.log()
    
  } catch (error) {
    spinner.stop()
    console.log(colors.error(`${symbols.error} Error analyzing project:`))
    console.log(colors.error(error instanceof Error ? error.message : String(error)))
    console.log()
  }
}

function getConfidenceLabel(confidence: number): string {
  if (confidence >= 90) return 'Excellent'
  if (confidence >= 80) return 'Great'
  if (confidence >= 70) return 'Good'
  if (confidence >= 60) return 'Partial'
  return 'Needs Setup'
}