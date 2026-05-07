import { Amplify } from 'aws-amplify'

let configured = false

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value && process.env.NODE_ENV === 'development') {
    console.warn(`[Amplify] Missing env var: ${name}. Check your .env.local file.`)
  }
  return value ?? ''
}

export function configureAmplify() {
  if (configured) return
  configured = true
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: requireEnv('NEXT_PUBLIC_USER_POOL_ID'),
        userPoolClientId: requireEnv('NEXT_PUBLIC_USER_POOL_CLIENT_ID'),
      },
    },
  })
}
