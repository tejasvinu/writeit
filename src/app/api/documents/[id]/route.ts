import { connectToDatabase } from "@/lib/mongodb"
import { Document } from "@/models/Document"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "../../auth/[...nextauth]/options"
import mongoose from "mongoose"

// Get a single document
export async function GET(request: Request, context: any) {
  const { params } = context
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const document = await Document.findOne({
      _id: params.id,
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

    const body = await request.json()
    const { title, content, metadata, updatedAt, newParentPath } = body

    await connectToDatabase()

    const document = await Document.findOne({ _id: params.id, owner: session.user.id })
    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    // Handle document move if newParentPath is provided
    if (newParentPath !== undefined) {
      await Document.moveDocument(session.user.id, params.id, newParentPath)
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
    const updatedDoc = await Document.findOneAndUpdate(
      { _id: params.id, owner: session.user.id },
      { $set: updateData },
      { 
        new: true,
        runValidators: true,
      }
    )

    return NextResponse.json(updatedDoc)
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

    await connectToDatabase()

    // Start a session for transaction
    const dbSession = await mongoose.startSession()
    await dbSession.startTransaction()

    try {
      const document = await Document.findOne({ _id: params.id, owner: session.user.id })
      if (!document) {
        throw new Error("Document not found")
      }

      // Delete all documents with paths that start with this document's path
      await Document.deleteMany(
        {
          owner: session.user.id,
          path: new RegExp(`^${document.path}(/|$)`)
        },
        { session: dbSession }
      )

      await dbSession.commitTransaction()
      return NextResponse.json({ success: true })
    } catch (error) {
      await dbSession.abortTransaction()
      throw error
    } finally {
      dbSession.endSession()
    }
  } catch (error) {
    console.error('Error deleting document:', error)
    return NextResponse.json(
      { error: "Failed to delete document" },
      { status: 500 }
    )
  }
}