import { Amplify } from 'aws-amplify'

let configured = false

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    console.error(`[Amplify] Missing required env var: ${name}`)
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
