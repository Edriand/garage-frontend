import { Amplify } from 'aws-amplify'

let configured = false

export function configureAmplify() {
  if (configured) return
  configured = true
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID ?? '',
        userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID ?? '',
      },
    },
  })
}
