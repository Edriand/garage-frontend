'use client'

import { Suspense, useState } from 'react'
import { confirmResetPassword } from 'aws-amplify/auth'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card, CardBody } from '@/components/ui/Card'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') ?? ''

  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setPasswordError('')
    setFormError('')
    if (newPassword !== confirm) {
      setPasswordError('Las contraseñas no coinciden')
      return
    }
    setLoading(true)
    try {
      await confirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword,
      })
      router.push('/login')
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Error al cambiar la contraseña')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardBody>
        <h2 className="font-title-sm text-title-sm text-on-surface mb-2">
          Nueva contraseña
        </h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">
          Introduce el código que recibiste en <strong>{email}</strong> y tu nueva contraseña.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Código de verificación"
            type="text"
            inputMode="numeric"
            value={code}
            onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
            required
            placeholder="000000"
          />
          <Input
            label="Nueva contraseña"
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
          <Input
            label="Confirmar contraseña"
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
            autoComplete="new-password"
            error={passwordError || undefined}
          />
          {formError && <p className="font-body-sm text-body-sm text-error">{formError}</p>}
          <Button type="submit" disabled={loading} className="w-full mt-2">
            {loading ? 'Guardando...' : 'Cambiar contraseña'}
          </Button>
        </form>
        <p className="mt-5 text-center font-body-sm text-body-sm text-on-surface-variant">
          <Link href="/login" className="text-primary hover:underline">
            Volver al inicio de sesión
          </Link>
        </p>
      </CardBody>
    </Card>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  )
}
