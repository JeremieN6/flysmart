import 'dotenv/config'
import { config as loadEnv } from 'dotenv'
import { defineConfig } from 'prisma/config'

// Les secrets du projet vivent dans .env.local, que Prisma ne lit pas seul.
loadEnv({ path: '.env.local', override: true })

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
})
