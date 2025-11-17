import { app } from './app'
import { env } from '@/env'

app
  .listen({
    host: '0.0.0.0',
    port: env.PORT,
  })
  .then(() => {
    console.log(`🚀 HTTP Server running on http://localhost:${env.PORT}`)
    console.log(`📚 Health check: http://localhost:${env.PORT}/health`)
  })
  .catch((err) => {
    console.error('❌ Error starting server:', err)
    process.exit(1)
  })