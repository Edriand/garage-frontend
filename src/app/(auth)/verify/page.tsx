'use client'

import { Suspense, useState } from 'react'
import { confirmSignUp, resendSignUpCode } from 'aws-amplify/auth'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card, CardBody } from '@/components/ui/Card'

function VerifyForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') ?? ''

  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resent, setResent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await confirmSignUp({ username: email, confirmationCode: code })
      router.push('/login')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Código incorrecto')
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    setError('')
    try {
      await resendSignUpCode({ username: email })
      setResent(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al reenviar')
    }
  }

  return (
    <Card>
      <CardBody>
        <h2 className="font-title-sm text-title-sm text-on-surface mb-2">Verificar cuenta</h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">
          Hemos enviado un código a <strong>{email}</strong>
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Código de verificación"
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={code}
            onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
            required
            placeholder="000000"
          />
          {error && <p className="font-body-sm text-body-sm text-error">{error}</p>}
          <Button type="submit" disabled={loading || code.length !== 6} className="w-full mt-2">
            {loading ? 'Verificando...' : 'Verificar cuenta'}
          </Button>
        </form>
        <div className="mt-5 text-center">
          {resent ? (
            <p className="font-body-sm text-body-sm text-on-surface-variant">Código reenviado</p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="font-body-sm text-body-sm text-primary hover:underline cursor-pointer"
            >
              Reenviar código
            </button>
          )}
        </div>
        <p className="mt-3 text-center font-body-sm text-body-sm text-on-surface-variant">
          <Link href="/login" className="text-primary hover:underline">
            Volver al inicio de sesión
          </Link>
        </p>
      </CardBody>
    </Card>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={null}>
      <VerifyForm />
    </Suspense>
  )
}
