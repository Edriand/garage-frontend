export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-5 py-10">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="font-label-caps text-label-caps text-secondary tracking-widest block mb-2">
            Vintage Garage
          </span>
          <h1 className="font-headline-md text-headline-md text-on-surface">
            Ruta Mecánica
          </h1>
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="h-px flex-1 bg-outline-variant" />
            <div className="w-1.5 h-1.5 rounded-full bg-outline-variant" />
            <div className="h-px flex-1 bg-outline-variant" />
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}
