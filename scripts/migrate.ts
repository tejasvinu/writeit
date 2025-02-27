import { migratePaths } from '../src/lib/migrations/add-document-paths'

async function runMigrations() {
  try {
    // Add path migration
    await migratePaths()
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

runMigrations()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Migration runner failed:', error)
    process.exit(1)
  })