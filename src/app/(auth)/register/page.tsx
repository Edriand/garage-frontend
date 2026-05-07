'use client'

import { useState } from 'react'
import { signUp, confirmSignUp, autoSignIn } from 'aws-amplify/auth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card, CardBody } from '@/components/ui/Card'
import { setAuthCookie } from '@/lib/auth-context'

type Step = 'form' | 'otp'

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('form')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signUp({
        username: email,
        options: {
          userAttributes: { email },
          autoSignIn: true,
        },
      })
      setStep('otp')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al registrarse')
    } finally {
      setLoading(false)
    }
  }

  async function handleOtp(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await confirmSignUp({ username: email, confirmationCode: otp })
      const { isSignedIn } = await autoSignIn()
      if (isSignedIn) {
        setAuthCookie()
        router.push('/garage')
      } else {
        router.push('/login')
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Código incorrecto')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'otp') {
    return (
      <Card>
        <CardBody>
          <h2 className="font-title-sm text-title-sm text-on-surface mb-2">Verificar cuenta</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">
            Hemos enviado un código a <strong>{email}</strong>
          </p>
          <form onSubmit={handleOtp} className="flex flex-col gap-4">
            <Input
              label="Código de verificación"
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
              {loading ? 'Activando...' : 'Activar cuenta'}
            </Button>
          </form>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card>
      <CardBody>
        <h2 className="font-title-sm text-title-sm text-on-surface mb-6">Crear cuenta</h2>
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
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
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </Button>
        </form>
        <p className="mt-5 text-center font-body-sm text-body-sm text-on-surface-variant">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-primary hover:underline">
            Iniciar sesión
          </Link>
        </p>
      </CardBody>
    </Card>
  )
}
