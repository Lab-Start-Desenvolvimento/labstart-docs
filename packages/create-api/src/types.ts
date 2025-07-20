export interface ProjectConfig {
  projectName: string
  projectPath: string
  database: 'postgresql' | 'mysql'
  includeDocker: boolean
  setupTests: boolean
  setupCI: boolean
  template: 'basic' | 'full'
}

export interface TemplateFile {
  source: string
  destination: string
  template?: boolean
}

export interface TemplateConfig {
  name: string
  description: string
  files: TemplateFile[]
  scripts: Record<string, string>
  dependencies: Record<string, string>
  devDependencies: Record<string, string>
}