'use client'

import { useEffect, useState } from 'react'
import { fetchUserAttributes, updateUserAttributes, updatePassword } from 'aws-amplify/auth'
import { Header } from '@/components/layout/Header'
import { BottomNav } from '@/components/layout/BottomNav'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { useAuth } from '@/lib/auth-context'

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-surface-container-lowest border border-outline-variant rounded p-4 md:p-6 relative shadow-[0_2px_0_0_rgba(107,112,92,0.15)]">
      <div className="absolute top-0 left-0 w-full h-0 border-t-2 border-dashed border-outline-variant/50" />
      <h2 className="font-title-sm text-title-sm text-on-surface mb-4">{title}</h2>
      {children}
    </section>
  )
}

export default function ProfilePage() {
  const { signOut } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loadingAttrs, setLoadingAttrs] = useState(true)

  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [nameLoading, setNameLoading] = useState(false)
  const [nameSuccess, setNameSuccess] = useState(false)
  const [nameError, setNameError] = useState('')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [passwordError, setPasswordError] = useState('')

  const [signingOut, setSigningOut] = useState(false)

  useEffect(() => {
    fetchUserAttributes()
      .then(attrs => {
        setName(attrs.name ?? '')
        setEmail(attrs.email ?? '')
      })
      .catch(() => {})
      .finally(() => setLoadingAttrs(false))
  }, [])

  async function handleNameSave(e: React.FormEvent) {
    e.preventDefault()
    setNameError('')
    setNameSuccess(false)
    setNameLoading(true)
    try {
      await updateUserAttributes({ userAttributes: { name: nameInput.trim() } })
      setName(nameInput.trim())
      setEditingName(false)
      setNameSuccess(true)
      setTimeout(() => setNameSuccess(false), 3000)
    } catch (err: unknown) {
      setNameError(err instanceof Error ? err.message : 'Error al actualizar el nombre')
    } finally {
      setNameLoading(false)
    }
  }

  function validatePassword(): string | null {
    if (newPassword === currentPassword) return 'La nueva contraseña debe ser diferente a la actual'
    if (newPassword !== confirmPassword) return 'Las contraseñas no coinciden'
    if (newPassword.length < 8) return 'Mínimo 8 caracteres'
    if (!/[A-Z]/.test(newPassword)) return 'Debe incluir al menos una mayúscula'
    if (!/[a-z]/.test(newPassword)) return 'Debe incluir al menos una minúscula'
    if (!/[0-9]/.test(newPassword)) return 'Debe incluir al menos un número'
    return null
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess(false)
    const validationError = validatePassword()
    if (validationError) { setPasswordError(validationError); return }
    setPasswordLoading(true)
    try {
      await updatePassword({ oldPassword: currentPassword, newPassword })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setPasswordSuccess(true)
      setTimeout(() => setPasswordSuccess(false), 4000)
    } catch (err: unknown) {
      const errName = (err as { name?: string }).name ?? ''
      if (errName === 'NotAuthorizedException') {
        setPasswordError('Contraseña actual incorrecta')
      } else {
        setPasswordError(err instanceof Error ? err.message : 'Error al cambiar la contraseña')
      }
    } finally {
      setPasswordLoading(false)
    }
  }

  async function handleSignOut() {
    setSigningOut(true)
    await signOut()
  }

  return (
    <>
      <Header activePath="/profile" />
      <main className="max-w-[1200px] mx-auto px-5 py-10 pb-24 md:pb-10">
        <div className="mb-8 pb-4 border-b-2 border-outline-variant">
          <h1 className="font-headline-md text-headline-md text-on-surface">Perfil</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            Gestiona tu cuenta y preferencias.
          </p>
        </div>

        {loadingAttrs ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : (
          <div className="flex flex-col gap-6 max-w-lg">

            {/* ── Nombre ────────────────────────────────────────────── */}
            <SectionCard title="Nombre">
              {editingName ? (
                <form onSubmit={handleNameSave} className="flex flex-col gap-3">
                  <Input
                    label="Nombre visible"
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    maxLength={50}
                    autoFocus
                    error={nameError}
                  />
                  <div className="flex gap-2">
                    <Button type="submit" disabled={nameLoading || !nameInput.trim()}>
                      {nameLoading && <Spinner size={14} />}
                      GUARDAR
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => { setEditingName(false); setNameError('') }}
                      disabled={nameLoading}
                    >
                      CANCELAR
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className="font-body-md text-body-md text-on-surface">
                      {name || <span className="text-on-surface-variant italic">Sin nombre</span>}
                    </p>
                    {nameSuccess && (
                      <p className="font-body-sm text-body-sm text-primary mt-2 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">check_circle</span>
                        Nombre actualizado
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => { setEditingName(true); setNameInput(name); setNameError('') }}
                    className="font-label-caps text-label-caps text-primary hover:underline flex items-center gap-1 flex-shrink-0"
                  >
                    <span className="material-symbols-outlined text-[14px]">edit</span>
                    EDITAR
                  </button>
                </div>
              )}
            </SectionCard>

            {/* ── Correo ────────────────────────────────────────────── */}
            <SectionCard title="Correo electrónico">
              <p className="font-body-md text-body-md text-on-surface">{email}</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                El correo es tu identificador de acceso y no puede modificarse.
              </p>
            </SectionCard>

            {/* ── Contraseña ────────────────────────────────────────── */}
            <SectionCard title="Cambiar contraseña">
              <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
                <Input
                  label="Contraseña actual"
                  type="password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  required
                  autoComplete="current-password"
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
                  label="Confirmar nueva contraseña"
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                {passwordError && (
                  <p className="font-body-sm text-body-sm text-error">{passwordError}</p>
                )}
                {passwordSuccess && (
                  <p className="font-body-sm text-body-sm text-primary flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    Contraseña actualizada correctamente
                  </p>
                )}
                <Button
                  type="submit"
                  disabled={passwordLoading || !currentPassword || !newPassword || !confirmPassword}
                  className="self-start"
                >
                  {passwordLoading && <Spinner size={14} />}
                  ACTUALIZAR CONTRASEÑA
                </Button>
              </form>
            </SectionCard>

            {/* ── Sesión ────────────────────────────────────────────── */}
            <SectionCard title="Sesión">
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
                Cierra sesión en este dispositivo.
              </p>
              <Button
                variant="secondary"
                onClick={handleSignOut}
                disabled={signingOut}
              >
                {signingOut
                  ? <Spinner size={14} />
                  : <span className="material-symbols-outlined text-[16px]">logout</span>
                }
                CERRAR SESIÓN
              </Button>
            </SectionCard>

          </div>
        )}
      </main>
      <BottomNav activePath="/profile" />
    </>
  )
}
