'use client'

import { useState } from 'react'
import { signUp } from 'aws-amplify/auth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card, CardBody } from '@/components/ui/Card'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setPasswordError('')
    setFormError('')
    if (password !== confirm) {
      setPasswordError('Las contraseñas no coinciden')
      return
    }
    setLoading(true)
    try {
      await signUp({
        username: email,
        password,
        options: { userAttributes: { email, name } },
      })
      router.push(`/verify?email=${encodeURIComponent(email)}`)
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Error al registrarse')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardBody>
        <h2 className="font-title-sm text-title-sm text-on-surface mb-6">Crear cuenta</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Nombre completo"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            autoComplete="name"
          />
          <Input
            label="Correo electrónico"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <Input
            label="Contraseña"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
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
            {loading ? 'Registrando...' : 'Crear cuenta'}
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
