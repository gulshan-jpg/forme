interface LoadingProps {
  message?: string
  fullScreen?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function BouncingDots({
  size = 'md',
  className = ''
}: {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const dotClass =
    size === 'sm'
      ? 'h-1.5 w-1.5'
      : size === 'lg'
      ? 'h-3.5 w-3.5'
      : 'h-2.5 w-2.5'

  return (
    <div
      className={`inline-flex items-center gap-1.5 ${className}`}
      aria-label="Loading"
      role="status"
    >
      <span className={`${dotClass} rounded-full bg-black bounce-dot-1`} />
      <span className={`${dotClass} rounded-full bg-black bounce-dot-2`} />
      <span className={`${dotClass} rounded-full bg-black bounce-dot-3`} />
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export default function LoadingScreen({
  message = 'Loading FORME®…',
  fullScreen = false
}: LoadingProps) {
  const content = (
    <div
      className="flex flex-col items-center justify-center gap-4 text-center select-none animate-fade-in"
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      {/* Brand Name in Luxury Serif */}
      <span className="font-brand text-3xl sm:text-4xl font-black tracking-tight text-black uppercase leading-none">
        FORME
      </span>

      {/* 3 Synchronized Luxury Bouncing Dots */}
      <BouncingDots size="lg" className="my-1" />

      {/* Loading Message */}
      {message && (
        <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-black/60">
          {message}
        </p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-xs">
        {content}
      </div>
    )
  }

  return (
    <div className="flex min-h-[300px] w-full items-center justify-center py-16">
      {content}
    </div>
  )
}
