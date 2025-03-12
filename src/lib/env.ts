const requiredEnvVars = [
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  'MONGODB_URI'
] as const;

export function validateEnv() {
  const missingVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }

  // Validate NEXTAUTH_URL format in production
  if (process.env.NODE_ENV === 'production') {
    try {
      const url = new URL(process.env.NEXTAUTH_URL);
      if (url.protocol !== 'https:') {
        throw new Error('NEXTAUTH_URL must use HTTPS in production');
      }
    } catch (error) {
      throw new Error('NEXTAUTH_URL must be a valid URL');
    }
  }

  // Validate NEXTAUTH_SECRET length
  if (process.env.NEXTAUTH_SECRET?.length < 32) {
    throw new Error('NEXTAUTH_SECRET must be at least 32 characters long');
  }
}