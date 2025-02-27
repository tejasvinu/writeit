import { connectToDatabase } from '@/lib/mongodb'
import { Document } from '@/models/Document'

async function buildPath(doc: any, documents: any[]): Promise<string> {
  const segments = []
  let currentDoc = doc
  
  // Build path by traversing up the parent chain
  while (currentDoc) {
    segments.unshift(currentDoc.title)
    if (!currentDoc.parent) break
    currentDoc = documents.find(d => d._id.toString() === currentDoc.parent.toString())
  }

  return `/root/${segments.join('/')}`
}

export async function migratePaths() {
  console.log('Starting document path migration...')
  
  await connectToDatabase()
  
  // Get all documents
  const documents = await Document.find({}).lean()
  console.log(`Found ${documents.length} documents to migrate`)
  
  // Build a map of document paths
  const pathMap = new Map()
  for (const doc of documents) {
    const path = await buildPath(doc, documents)
    pathMap.set(doc._id.toString(), path)
  }
  
  // Update all documents with their paths
  let updated = 0
  for (const [id, path] of pathMap.entries()) {
    await Document.findByIdAndUpdate(id, { path })
    updated++
    
    if (updated % 100 === 0) {
      console.log(`Updated ${updated} documents...`)
    }
  }
  
  console.log(`Migration complete. Updated ${updated} documents.`)
}

// Run migration if this file is executed directly
if (require.main === module) {
  migratePaths()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Migration failed:', error)
      process.exit(1)
    })
}