import { connectToDatabase } from "@/lib/mongodb"
import { Document } from "@/models/Document"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "../auth/[...nextauth]/options"
import { DocumentType, DocumentStatus } from "@/types/Document"

// Get all documents for the current user
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const parentPath = searchParams.get('path') || '/root'

    await connectToDatabase()

    // Use the new getChildren static method
    const documents = await Document.getChildren(session.user.id, parentPath)

    return NextResponse.json(documents)
  } catch (error) {
    console.error('Error fetching documents:', error)
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    )
  }
}

// Create a new document or folder
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, content, isFolder, parent, type, parentPath } = body

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      )
    }

    await connectToDatabase()

    // Calculate word count if there's content
    const wordCount = content ? content.trim().split(/\s+/).length : 0

    // Base path calculation
    const path = parentPath ? `${parentPath}/${title}` : `/root/${title}`

    // Handle folder creation
    if (isFolder) {
      const folderData = {
        title,
        content: '',
        isFolder: true,
        parent: parent || null,
        path,
        owner: session.user.id,
        metadata: {
          type: 'folder',
          wordCount: 0,
          status: 'draft'
        }
      }
      
      const folder = await Document.create(folderData)
      return NextResponse.json(folder, { status: 201 })
    }

    // For regular documents, determine the type
    const docType = type && ['chapter', 'scene', 'note', 'character', 'plotline'].includes(type)
      ? type as DocumentType
      : 'note'

    // Create document object with appropriate defaults
    const documentData = {
      title,
      content: content || '',
      isFolder: false,
      parent: parent || null,
      path,
      owner: session.user.id,
      metadata: {
        type: docType,
        wordCount,
        status: 'draft'
      }
    }
    
    const document = await Document.create(documentData)
    return NextResponse.json(document, { status: 201 })
  } catch (error) {
    console.error('Error creating document:', error)
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Failed to create document: ${error.message}` },
        { status: 500 }
      )
    }
    return NextResponse.json(
      { error: "Failed to create document" },
      { status: 500 }
    )
  }
}