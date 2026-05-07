'use client'

import { useState } from 'react'
import { signIn } from 'aws-amplify/auth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card, CardBody } from '@/components/ui/Card'
import { setAuthCookie } from '@/lib/auth-context'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { isSignedIn } = await signIn({ username: email, password })
      if (isSignedIn) {
        setAuthCookie()
        router.push('/garage')
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Credenciales incorrectas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardBody>
        <h2 className="font-title-sm text-title-sm text-on-surface mb-6">Iniciar sesión</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            autoComplete="current-password"
          />
          {error && <p className="font-body-sm text-body-sm text-error">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full mt-2">
            {loading ? 'Entrando...' : 'Entrar al garaje'}
          </Button>
        </form>
        <div className="mt-5 flex flex-col gap-2 text-center">
          <Link
            href="/forgot-password"
            className="font-body-sm text-body-sm text-primary hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </Link>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            ¿Sin cuenta aún?{' '}
            <Link href="/register" className="text-primary hover:underline">
              Regístrate
            </Link>
          </p>
        </div>
      </CardBody>
    </Card>
  )
}
