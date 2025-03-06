import { connectToDatabase } from "@/lib/mongodb"
import { Document } from "@/models/Document"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "../../auth/[...nextauth]/options"
import mongoose from "mongoose"
import { isValidObjectId } from 'mongoose'

// Get a single document
export async function GET(request: Request, context: any) {
  const { params } = context
  
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Await params before using its properties
    const id = (await params).id
    
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid document ID' }, { status: 400 })
    }

    await connectToDatabase()

    const document = await Document.findOne({
      _id: id,
      owner: session.user.id,
    })

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    // Get ancestors using the new path-based method
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

// Update a document
export async function PATCH(request: Request, context: any) {
  const { params } = context
  
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Await params before using its properties
    const id = (await params).id
    
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid document ID' }, { status: 400 })
    }

    const body = await request.json()
    const { title, content, metadata, updatedAt, newParentPath } = body

    await connectToDatabase()

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
      await Document.moveDocument(session.user.id, id, newParentPath)
    }

    // Build flat update object
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
    }

    if (metadata) {
      Object.entries(metadata).forEach(([key, value]) => {
        updateData[`metadata.${key}`] = value
      })
    }

    if (updatedAt) {
      updateData.updatedAt = updatedAt
    }

    if (content) {
      updateData['metadata.wordCount'] = content
        .replace(/<[^>]*>/g, '')
        .trim()
        .split(/\s+/)
        .filter((word: string) => word.length > 0)
        .length
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

// Delete a document and its children (if it's a folder)
export async function DELETE(request: Request, context: any) {
  const { params } = context
  
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Await params before using its properties
    const id = (await params).id
    
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid document ID' }, { status: 400 })
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