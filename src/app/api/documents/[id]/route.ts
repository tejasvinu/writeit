import { connectToDatabase } from "@/lib/mongodb"
import { Document } from "@/models/Document"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "../../auth/[...nextauth]/options"
import { isValidObjectId } from 'mongoose'
import { IDocument } from "@/models/Document"

/**
 * Get a single document and its ancestors
 */
export async function GET(request: Request, context: { params: { id: string } }) {
  const { params } = context
  
  try {
    // Authentication check
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    
    // Validate document ID format
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid document ID format' }, { status: 400 })
    }

    await connectToDatabase()

    // Find document with projection to exclude large fields if not needed
    const document = await Document.findOne({
      _id: id,
      owner: session.user.id,
    })

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    // Get ancestors using the path-based method
    const ancestors = await Document.getAncestors(session.user.id, document.path)

    return NextResponse.json({ document, ancestors })
  } catch (error) {
    console.error('Error fetching document:', error)
    return NextResponse.json(
      { error: "Failed to fetch document" },
      { status: 500 }
    )
  }
}

/**
 * Update a document's properties and/or move it to a new location
 */
export async function PATCH(request: Request, context: { params: { id: string } }) {
  const { params } = context
  
  try {
    // Authentication check
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    
    // Validate document ID format
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid document ID format' }, { status: 400 })
    }

    // Parse request body
    const body = await request.json()
    const { title, content, metadata, updatedAt, newParentPath } = body

    // Validate required fields
    if (title !== undefined && (typeof title !== 'string' || title.trim().length === 0)) {
      return NextResponse.json({ error: 'Title cannot be empty' }, { status: 400 })
    }

    await connectToDatabase()

    // Fetch the document
    const document = await Document.findOne({ _id: id, owner: session.user.id })
    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    // Check for duplicate title if title is being changed
    if (title && title !== document.title) {
      const parentPath = newParentPath || document.path.substring(0, document.path.lastIndexOf('/'))
      const existingDoc = await Document.findOne({
        owner: session.user.id,
        path: `${parentPath}/${title}`,
        _id: { $ne: id } // Exclude current document
      })

      if (existingDoc) {
        return NextResponse.json(
          { error: 'A document with this title already exists in this location' },
          { status: 409 }
        )
      }
    }

    // Handle document move if newParentPath is provided
    if (newParentPath !== undefined) {
      // Validate that the new parent path exists (except for root path)
      if (newParentPath !== '/root') {
        const parentExists = await Document.exists({
          owner: session.user.id,
          path: newParentPath,
          isFolder: true
        })
        
        if (!parentExists) {
          return NextResponse.json({ error: 'Parent folder not found' }, { status: 400 })
        }
      }
      
      await Document.moveDocument(session.user.id, id, newParentPath)
    }

    // Build update object
    const updateData: Record<string, any> = {}
    
    if (title !== undefined) {
      updateData.title = title
      // Update path if title changes
      if (document.parent) {
        const parentDoc = await Document.findById(document.parent)
        if (parentDoc) {
          updateData.path = `${parentDoc.path}/${title}`
        }
      } else {
        updateData.path = `/root/${title}`
      }
    }
    
    if (content !== undefined) {
      updateData.content = content
      
      // Calculate word count
      updateData['metadata.wordCount'] = content
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .trim()
        .split(/\s+/)
        .filter((word: string) => word.length > 0)
        .length
    }

    if (metadata) {
      // Validate metadata structure
      if (typeof metadata !== 'object') {
        return NextResponse.json({ error: 'Metadata must be an object' }, { status: 400 })
      }
      
      Object.entries(metadata).forEach(([key, value]) => {
        updateData[`metadata.${key}`] = value
      })
    }

    if (updatedAt) {
      updateData.updatedAt = updatedAt
    }

    // Use $set to update only specified fields
    try {
      const updatedDoc = await Document.findOneAndUpdate(
        { _id: id, owner: session.user.id },
        { $set: updateData },
        { 
          new: true,
          runValidators: true,
        }
      )
      
      if (!updatedDoc) {
        return NextResponse.json({ error: "Failed to update document" }, { status: 500 })
      }
      
      return NextResponse.json(updatedDoc)
    } catch (error: any) {
      // Handle unique constraint violation
      if (error.code === 11000) {
        return NextResponse.json(
          { error: 'A document with this title already exists in this location' },
          { status: 409 }
        )
      }
      throw error
    }
  } catch (error) {
    console.error('Error updating document:', error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ error: "Failed to update document" }, { status: 500 })
  }
}

/**
 * Delete a document and its children recursively using path-based matching
 */
export async function DELETE(request: Request, context: { params: { id: string } }) {
  const { params } = context
  
  try {
    // Authentication check
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    
    // Validate document ID format
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid document ID format' }, { status: 400 })
    }

    await connectToDatabase()

    // Find the document first to get its path
    const document = await Document.findOne({ 
      _id: id,
      owner: session.user.id 
    })

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Delete the document and all its descendants using path-based matching
    const result = await Document.deleteMany({
      owner: session.user.id,
      $or: [
        { _id: id },
        { path: new RegExp(`^${document.path}/`) }
      ]
    })

    return NextResponse.json({ 
      message: 'Document and its descendants deleted successfully',
      deletedCount: result.deletedCount
    })
  } catch (error) {
    console.error('Error deleting document:', error)
    return NextResponse.json(
      { error: "Failed to delete document" },
      { status: 500 }
    )
  }
}