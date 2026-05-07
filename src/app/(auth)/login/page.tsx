'use client'

import { useState } from 'react'
import { signIn, confirmSignIn } from 'aws-amplify/auth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card, CardBody } from '@/components/ui/Card'
import { setAuthCookie } from '@/lib/auth-context'

type Step = 'email' | 'otp'

export default function LoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn({
        username: email,
        options: { authFlowType: 'USER_AUTH', preferredChallenge: 'EMAIL_OTP' },
      })
      setStep('otp')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al enviar el código'
      setError(
        msg.toLowerCase().includes('userpool not configured')
          ? 'Servicio de autenticación no disponible. Contacta con el administrador.'
          : msg,
      )
    } finally {
      setLoading(false)
    }
  }

  async function handleOtpSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { isSignedIn, nextStep } = await confirmSignIn({ challengeResponse: otp })
      if (isSignedIn) {
        setAuthCookie()
        router.push('/garage')
      } else {
        setError(`Paso adicional requerido: ${nextStep.signInStep}`)
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : ''
      if (msg.toLowerCase().includes('auth state') || msg.toLowerCase().includes('not authorized')) {
        setStep('email')
        setOtp('')
        setError('La sesión ha expirado. Por favor, solicita un nuevo código.')
      } else if (msg.toLowerCase().includes('code mismatch') || msg.toLowerCase().includes('invalid code')) {
        setError('Código incorrecto. Comprueba el correo e inténtalo de nuevo.')
      } else {
        setError(msg || 'Código incorrecto')
      }
    } finally {
      setLoading(false)
    }
  }

  if (step === 'otp') {
    return (
      <Card>
        <CardBody>
          <h2 className="font-title-sm text-title-sm text-on-surface mb-2">Código de acceso</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">
            Hemos enviado un código a <strong>{email}</strong>
          </p>
          <form onSubmit={handleOtpSubmit} className="flex flex-col gap-4">
            <Input
              label="Código"
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
              required
              placeholder="000000"
              autoFocus
            />
            {error && <p className="font-body-sm text-body-sm text-error">{error}</p>}
            <Button type="submit" disabled={loading || otp.length !== 6} className="w-full mt-2">
              {loading ? 'Verificando...' : 'Entrar al garaje'}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => { setStep('email'); setOtp(''); setError('') }}
              className="font-body-sm text-body-sm text-primary hover:underline cursor-pointer"
            >
              Cambiar correo
            </button>
          </div>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card>
      <CardBody>
        <h2 className="font-title-sm text-title-sm text-on-surface mb-6">Iniciar sesión</h2>
        <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
          <Input
            label="Correo electrónico"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          {error && <p className="font-body-sm text-body-sm text-error">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full mt-2">
            {loading ? 'Enviando código...' : 'Continuar'}
          </Button>
        </form>
        <p className="mt-5 text-center font-body-sm text-body-sm text-on-surface-variant">
          ¿Sin cuenta aún?{' '}
          <Link href="/register" className="text-primary hover:underline">
            Regístrate
          </Link>
        </p>
      </CardBody>
    </Card>
  )
}
