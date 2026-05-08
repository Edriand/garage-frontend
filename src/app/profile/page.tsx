'use client'

import { useEffect, useState } from 'react'
import { fetchUserAttributes, updateUserAttributes } from 'aws-amplify/auth'
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
