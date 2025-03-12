import NextAuth from "next-auth"
import { authOptions } from "./options"
import { validateEnv } from "@/lib/env"

// Validate environment variables before initializing NextAuth
validateEnv()

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }