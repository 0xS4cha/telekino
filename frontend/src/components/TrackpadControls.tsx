import { useRef } from 'react'
import type { PointerEvent } from 'react'
import type { ControlAction } from '@/lib/protocol'

type TrackpadControlsProps = {
  disabled: boolean
  onCommand: (
    action: ControlAction,
    args: Record<string, number>
  ) => void
}

export function TrackpadControls({
  disabled,
  onCommand,
}: TrackpadControlsProps) {
  const trackpadRef = useRef<HTMLDivElement>(null)
  const lastPositionRef = useRef<{ x: number; y: number } | null>(null)

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (disabled) return

    const previous = lastPositionRef.current
    lastPositionRef.current = { x: event.clientX, y: event.clientY }

    // Mouse events already expose the delta, including on the first move into
    // the pad. Touch events need to be measured from the last pointer position.
    const x = event.pointerType === 'mouse'
      ? event.movementX
      : previous ? event.clientX - previous.x : 0
    const y = event.pointerType === 'mouse'
      ? event.movementY
      : previous ? event.clientY - previous.y : 0

    if (x === 0 && y === 0) return

    onCommand('track_pad', {
      x,
      y,
    })
  }

  const resetPointerPosition = () => {
    lastPositionRef.current = null
  }

  return (
    <section className="space-y-3" aria-labelledby="trackpad-title">
      <h2
        id="trackpad-title"
        className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground"
      >
        Trackpad
      </h2>

      <div
        ref={trackpadRef}
        role="application"
        aria-label="Trackpad de contrôle"
        aria-disabled={disabled}
        onPointerDown={(event) => {
          lastPositionRef.current = { x: event.clientX, y: event.clientY }
        }}
        onPointerMove={handlePointerMove}
        onPointerLeave={resetPointerPosition}
        onPointerCancel={resetPointerPosition}
        className={[
          'relative aspect-[4/3] w-full overflow-hidden rounded-2xl',
          'border border-border bg-muted/40',
          'touch-none select-none',
          'transition-colors',
          disabled
            ? 'cursor-not-allowed opacity-50'
            : 'cursor-crosshair hover:bg-muted/60',
        ].join(' ')}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-full w-px bg-border" />
          <div className="absolute left-0 top-1/2 h-px w-full bg-border" />

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="rounded-full border border-border bg-background/80 px-3 py-1 text-xs text-muted-foreground">
              {disabled ? 'Désactivé' : 'Déplacez le curseur'}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
