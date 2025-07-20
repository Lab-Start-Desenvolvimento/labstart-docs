LabStart Docs

Documentação automática para APIs Clean Architecture LabStart

🚀 Status
Fase 1: Core Foundation ✅ 80% Completo

✅ Detector de projetos LabStart Clean Architecture
✅ Scanner automático de controllers/services/repositories
✅ Score de confiança (0-100%)
✅ Monorepo configurado
🔄 Testes finalizando

📦 Packages
@labstart/docs-core
Core library para detecção e análise de projetos LabStart.
bashnpm install @labstart/docs-core
typescriptimport { detectLabStartProject } from '@labstart/docs-core'

const analysis = detectLabStartProject('./meu-projeto')
console.log(analysis.confidence) // 95%
🎯 Próximos Passos

CLI interface (npx @labstart/docs scan)
Gerador de boilerplate (npx create-labstart-api)
Interface web de documentação
Testador integrado

🛠️ Desenvolvimento
bash# Instalar dependências
npm install

# Build

npm run build

# Testes

npm test

# Lint

npm run lint
📄 License
MIT © LabStart
