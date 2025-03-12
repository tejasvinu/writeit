import { connectToDatabase } from "@/lib/mongodb"
import { User } from "@/models/User"
import { NextResponse } from "next/server"
import { headers } from 'next/headers'

// Simple rate limiting
const REQUESTS_PER_IP = new Map<string, { count: number; timestamp: number }>()
const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour
const MAX_REQUESTS = 5 // Max 5 signup attempts per hour

export async function POST(request: Request) {
  try {
    // Rate limiting
    const headersList = headers()
    const ip = (headersList.get('x-forwarded-for') || 'unknown').split(',')[0]
    const now = Date.now()
    
    const ipData = REQUESTS_PER_IP.get(ip) || { count: 0, timestamp: now }
    if (now - ipData.timestamp > RATE_LIMIT_WINDOW) {
      // Reset if window has passed
      ipData.count = 0
      ipData.timestamp = now
    }
    
    if (ipData.count >= MAX_REQUESTS) {
      return NextResponse.json(
        { error: "Too many signup attempts. Please try again later." },
        { status: 429 }
      )
    }
    
    ipData.count++
    REQUESTS_PER_IP.set(ip, ipData)

    const { email, password, name } = await request.json()

    // Input validation
    if (!email?.trim() || !password?.trim() || !name?.trim()) {
      return NextResponse.json(
        { error: "Please provide all required fields" },
        { status: 400 }
      )
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      )
    }

    // Password strength validation
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      )
    }

    await connectToDatabase()

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json(
        { error: "Email address is already registered" },
        { status: 400 }
      )
    }

    // Create new user
    const user = await User.create({
      email: email.toLowerCase(),
      password,
      name: name.trim(),
    })

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Signup error:', error)
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: Object.values(error.errors).map((err: any) => err.message).join(', ') },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: "An error occurred during signup. Please try again later." },
      { status: 500 }
    )
  }
}