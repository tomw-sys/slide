'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { recordSwipe } from '@/app/actions/briefs'

interface Brief {
  id: string
  title: string | null
  description: string | null
  budget: number | null
  deadline: string | null
  niches: string[] | null
  brand_name: string
}

interface Props {
  briefs: Brief[]
}

const SWIPE_THRESHOLD = 80

const NICHE_GRADIENT: Record<string, string> = {
  Gaming:    'linear-gradient(135deg, #7C5CFF 0%, #4D8BFF 100%)',
  Food:      'linear-gradient(135deg, #FF5C9D 0%, #7C5CFF 100%)',
  Lifestyle: 'linear-gradient(135deg, #FF5C9D 0%, #7C5CFF 100%)',
  Beauty:    'linear-gradient(135deg, #FF5C9D 0%, #FF8C42 100%)',
  Fashion:   'linear-gradient(135deg, #FF5C9D 0%, #FF8C42 100%)',
  Travel:    'linear-gradient(135deg, #7C5CFF 0%, #4D8BFF 100%)',
  Fitness:   'linear-gradient(135deg, #FF5C9D 0%, #7C5CFF 100%)',
}

const FALLBACK_GRADIENTS = [
  'linear-gradient(135deg, #7C5CFF 0%, #4D8BFF 100%)',
  'linear-gradient(135deg, #FF5C9D 0%, #7C5CFF 100%)',
  'linear-gradient(135deg, #FF5C9D 0%, #FF8C42 100%)',
]

function getNicheGradient(niches: string[] | null): string {
  if (!niches || niches.length === 0) return FALLBACK_GRADIENTS[0]
  for (const n of niches) {
    if (NICHE_GRADIENT[n]) return NICHE_GRADIENT[n]
  }
  const hash = niches[0].split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return FALLBACK_GRADIENTS[hash % FALLBACK_GRADIENTS.length]
}

function formatBudget(pence: number) {
  return `£${(pence / 100).toLocaleString('en-GB')}`
}

function daysLeft(dateStr: string) {
  const diff = Math.ceil(
    (new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  )
  if (diff < 0) return 'Overdue'
  if (diff === 0) return 'Due today'
  if (diff === 1) return '1 day left'
  return `${diff} days left`
}

export function SwipeFeed({ briefs }: Props) {
  const router = useRouter()
  const [index, setIndex] = useState(0)
  const [exitDir, setExitDir] = useState<'left' | 'right' | null>(null)
  const [busy, setBusy] = useState(false)

  const cardRef = useRef<HTMLDivElement>(null)
  const nextCardRef = useRef<HTMLDivElement>(null)
  const passLabelRef = useRef<HTMLDivElement>(null)
  const slideLabelRef = useRef<HTMLDivElement>(null)
  const drag = useRef({ active: false, startX: 0, currentDelta: 0, pointerId: -1 })

  const current = briefs[index]
  const next = briefs[index + 1]

  function applyDrag(delta: number) {
    const card = cardRef.current
    if (!card) return

    const rotation = delta * 0.055
    const lift = Math.min(Math.abs(delta) * 0.025, 10)
    card.style.transform = `translateX(${delta}px) rotate(${rotation}deg) translateY(-${lift}px)`

    const ratio = Math.min(Math.abs(delta) / SWIPE_THRESHOLD, 1)
    if (delta > 8) {
      card.style.boxShadow = `0 0 ${48 * ratio}px rgba(198,242,62,${0.5 * ratio}), 0 0 ${100 * ratio}px rgba(198,242,62,${0.15 * ratio})`
    } else if (delta < -8) {
      card.style.boxShadow = `0 0 ${48 * ratio}px rgba(239,68,68,${0.5 * ratio}), 0 0 ${100 * ratio}px rgba(239,68,68,${0.15 * ratio})`
    } else {
      card.style.boxShadow = ''
    }

    if (passLabelRef.current) {
      passLabelRef.current.style.opacity = delta < -24 ? String(Math.min((-delta - 24) / 56, 1)) : '0'
    }
    if (slideLabelRef.current) {
      slideLabelRef.current.style.opacity = delta > 24 ? String(Math.min((delta - 24) / 56, 1)) : '0'
    }

    if (nextCardRef.current) {
      const scale = 0.93 + 0.07 * ratio
      const opacity = 0.45 + 0.55 * ratio
      nextCardRef.current.style.transform = `scale(${scale})`
      nextCardRef.current.style.opacity = String(opacity)
    }
  }

  function resetCard() {
    const card = cardRef.current
    if (card) {
      card.style.transition = 'transform 0.38s cubic-bezier(0.16,1,0.3,1), box-shadow 0.38s'
      card.style.transform = ''
      card.style.boxShadow = ''
      setTimeout(() => { if (cardRef.current) cardRef.current.style.transition = '' }, 400)
    }
    if (passLabelRef.current) passLabelRef.current.style.opacity = '0'
    if (slideLabelRef.current) slideLabelRef.current.style.opacity = '0'
    if (nextCardRef.current) {
      nextCardRef.current.style.transition = 'transform 0.38s cubic-bezier(0.16,1,0.3,1), opacity 0.38s'
      nextCardRef.current.style.transform = 'scale(0.93)'
      nextCardRef.current.style.opacity = '0.45'
      setTimeout(() => { if (nextCardRef.current) nextCardRef.current.style.transition = '' }, 400)
    }
  }

  const handlePass = useCallback(async () => {
    if (busy || !current) return
    setBusy(true)
    setExitDir('left')
    recordSwipe(current.id, 'pass')
    await new Promise((r) => setTimeout(r, 340))
    setExitDir(null)
    setIndex((i) => i + 1)
    setBusy(false)
  }, [busy, current])

  const handleSlide = useCallback(async () => {
    if (busy || !current) return
    setBusy(true)
    setExitDir('right')
    recordSwipe(current.id, 'slide')
    await new Promise((r) => setTimeout(r, 300))
    router.push(`/briefs/${current.id}`)
  }, [busy, current, router])

  function onPointerDown(e: React.PointerEvent) {
    if (busy || exitDir) return
    drag.current = { active: true, startX: e.clientX, currentDelta: 0, pointerId: e.pointerId }
    const card = cardRef.current
    if (card) {
      card.setPointerCapture(e.pointerId)
      card.style.transition = ''
      card.style.userSelect = 'none'
    }
    if (nextCardRef.current) nextCardRef.current.style.transition = ''
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!drag.current.active || e.pointerId !== drag.current.pointerId) return
    const delta = e.clientX - drag.current.startX
    drag.current.currentDelta = delta
    applyDrag(delta)
  }

  async function onPointerUp(e: React.PointerEvent) {
    if (!drag.current.active || e.pointerId !== drag.current.pointerId) return
    drag.current.active = false
    if (cardRef.current) cardRef.current.style.userSelect = ''
    const delta = drag.current.currentDelta
    if (delta > SWIPE_THRESHOLD) {
      await handleSlide()
    } else if (delta < -SWIPE_THRESHOLD) {
      await handlePass()
    } else {
      resetCard()
    }
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') handlePass()
      if (e.key === 'ArrowRight') handleSlide()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handlePass, handleSlide])

  if (!current) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 px-6 text-center" style={{ paddingTop: 'max(calc(env(safe-area-inset-top) + 52px), 68px)', paddingBottom: 100 }}>
        <div className="w-24 h-24 rounded-full bg-[#17150F] border border-[#3a3730] flex items-center justify-center text-5xl mb-6 animate-pop-in">
          🎬
        </div>
        <h2 className="text-white text-2xl font-bold mb-2 animate-fade-up" style={{ animationDelay: '100ms' }}>
          All caught up
        </h2>
        <p className="text-[#8a8575] text-sm max-w-xs animate-fade-up" style={{ animationDelay: '160ms' }}>
          New briefs appear here as brands post them. Check back soon.
        </p>
      </div>
    )
  }

  const gradient = getNicheGradient(current.niches)
  const nextGradient = next ? getNicheGradient(next.niches) : null
  const primaryNiche = current.niches?.[0] ?? null

  return (
    <div
      className="flex flex-col flex-1 overflow-hidden"
      style={{ paddingTop: 'max(calc(env(safe-area-inset-top) + 52px), 68px)' }}
    >
      {/* Counter */}
      <div className="flex justify-center pb-2 pointer-events-none">
        <span className="text-[#8a8575] text-xs uppercase tracking-wider">
          {index + 1} / {briefs.length}
        </span>
      </div>

      {/* Card stack — full width, fills available height */}
      <div className="flex-1 relative">
          {/* Next card — peeking underneath */}
          {next && nextGradient && (
            <div
              ref={nextCardRef}
              className="absolute inset-0 overflow-hidden"
              style={{ zIndex: 0, transform: 'scale(0.93)', opacity: 0.45, background: nextGradient }}
            >
              {/* Dark bottom scrim for text legibility */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)' }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-white text-lg font-black leading-tight line-clamp-2">{next.title}</p>
                <p className="text-white/60 text-xs mt-1">{next.brand_name}</p>
              </div>
            </div>
          )}

          {/* Active card */}
          <div
            ref={cardRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            key={current.id}
            className="absolute inset-0 overflow-hidden touch-none animate-card-enter"
            style={{
              zIndex: 1,
              cursor: 'grab',
              background: gradient,
              transition: exitDir
                ? 'transform 0.34s cubic-bezier(0.4,0,0.2,1), opacity 0.34s'
                : undefined,
              transform: exitDir === 'left'
                ? 'translateX(-130%) rotate(-22deg)'
                : exitDir === 'right'
                ? 'translateX(130%) rotate(22deg)'
                : undefined,
              opacity: exitDir ? 0 : undefined,
            }}
          >
            {/* Dark bottom scrim for text legibility */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.2) 45%, transparent 70%)' }}
            />

            {/* PASS stamp */}
            <div
              ref={passLabelRef}
              className="absolute top-8 right-5 z-20 pointer-events-none rotate-[14deg]"
              style={{ opacity: 0 }}
            >
              <div className="border-[3px] border-[#ef4444] rounded-xl px-4 py-1.5 bg-black/40 backdrop-blur-sm">
                <span className="text-[#ef4444] font-black text-xl tracking-[0.2em] uppercase">PASS</span>
              </div>
            </div>

            {/* SLIDE stamp */}
            <div
              ref={slideLabelRef}
              className="absolute top-8 left-5 z-20 pointer-events-none -rotate-[14deg]"
              style={{ opacity: 0 }}
            >
              <div className="border-[3px] border-[#C6F23E] rounded-xl px-4 py-1.5 bg-black/40 backdrop-blur-sm">
                <span className="text-[#C6F23E] font-black text-xl tracking-[0.2em] uppercase">SLIDE</span>
              </div>
            </div>

            {/* Top badges */}
            <div className="absolute top-0 left-0 right-0 p-5 flex items-start justify-between z-10">
              {primaryNiche ? (
                <span className="bg-black/30 backdrop-blur-sm text-white text-[11px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full border border-white/20">
                  {primaryNiche}
                </span>
              ) : (
                <span />
              )}
              <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/20">
                <svg viewBox="0 0 20 20" fill="#C6F23E" className="w-3.5 h-3.5 flex-shrink-0">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
                <span className="text-[11px] font-semibold text-white uppercase tracking-wider">Verified</span>
              </div>
            </div>

            {/* Bottom content */}
            <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 z-10">
              {current.budget && (
                <p className="text-[#C6F23E] text-4xl font-black leading-none mb-2">
                  {formatBudget(current.budget)}
                </p>
              )}
              <h2 className="text-white text-2xl font-black leading-tight mb-3">
                {current.title}
              </h2>
              <div className="flex items-center justify-between">
                <p className="text-white/80 text-sm font-medium">{current.brand_name}</p>
                {current.deadline && (
                  <span className="text-white/60 text-xs">{daysLeft(current.deadline)}</span>
                )}
              </div>
            </div>
          </div>
      </div>

      {/* Action buttons */}
      <div
        className="flex-shrink-0 flex items-center justify-center gap-8 px-6 pt-5"
        style={{ paddingBottom: 'max(calc(env(safe-area-inset-bottom) + 84px), 100px)' }}
      >
        <button
          onClick={handlePass}
          disabled={busy}
          aria-label="Pass"
          className="group flex flex-col items-center gap-1.5 disabled:opacity-40 tap-scale"
        >
          <span className="w-16 h-16 rounded-full bg-[#17150F] border-2 border-[#ef4444]/30 flex items-center justify-center text-[#ef4444] text-xl group-hover:border-[#ef4444] group-hover:bg-[#ef4444]/10 transition-all">
            ✕
          </span>
          <span className="text-[#8a8575] text-[10px] uppercase tracking-widest font-semibold">Pass</span>
        </button>

        <button
          onClick={handleSlide}
          disabled={busy}
          aria-label="Slide"
          className="group flex flex-col items-center gap-1.5 disabled:opacity-40 tap-scale"
        >
          <span className="w-20 h-20 rounded-full bg-[#C6F23E] flex items-center justify-center text-[#100F0C] text-3xl group-hover:bg-[#ADDA38] transition-all shadow-[0_0_32px_rgba(198,242,62,0.3)]">
            →
          </span>
          <span className="text-[#C6F23E] text-[10px] uppercase tracking-widest font-semibold">Slide</span>
        </button>
      </div>
    </div>
  )
}
