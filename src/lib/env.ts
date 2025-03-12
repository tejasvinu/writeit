const requiredEnvVars = [
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  'MONGODB_URI',
  'VERCEL_URL', // For Vercel deployments
] as const;

export function validateEnv() {
  // Special handling for NEXTAUTH_URL in Vercel
  if (process.env.VERCEL_URL && !process.env.NEXTAUTH_URL) {
    process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`;
  }

  const missingVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar] && !(envVar === 'VERCEL_URL' && process.env.NEXTAUTH_URL)
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}\n` +
      'Please check your .env file or Vercel environment variables.'
    );
  }

  // Validate NEXTAUTH_URL format in production
  if (process.env.NODE_ENV === 'production') {
    try {
      const url = new URL(process.env.NEXTAUTH_URL as string);
      if (url.protocol !== 'https:') {
        throw new Error('NEXTAUTH_URL must use HTTPS in production');
      }
    } catch (error) {
      throw new Error('NEXTAUTH_URL must be a valid URL');
    }
  }

  // Validate NEXTAUTH_SECRET length
  if ((process.env.NEXTAUTH_SECRET as string).length < 32) {
    throw new Error(
      'NEXTAUTH_SECRET must be at least 32 characters long.\n' +
      'You can generate a secure secret using: openssl rand -base64 32'
    );
  }

  // Validate MongoDB URI
  if (!process.env.MONGODB_URI?.startsWith('mongodb')) {
    throw new Error('MONGODB_URI must be a valid MongoDB connection string');
  }
}