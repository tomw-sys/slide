'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { revealRewardCode } from '@/app/actions/rewards'

export type Reward = {
  id: string
  partner_name: string
  offer_description: string
  discount_value: string
  discount_code: string
  minimum_tier: string
  expires_at: string | null
}

export type RevealedReward = Reward & { code: string }

interface Props {
  available: Reward[]
  redeemed: RevealedReward[]
}

const REWARD_GRADIENTS = [
  'linear-gradient(150deg, #FF5C9D 0%, #7C5CFF 100%)',
  'linear-gradient(150deg, #C6F23E 0%, #4D8BFF 100%)',
  'linear-gradient(150deg, #7C5CFF 0%, #4D8BFF 100%)',
  'linear-gradient(150deg, #FF8C42 0%, #FF5C9D 100%)',
]

const SWIPE_THRESHOLD = 80

function RevealedRow({ rewards }: { rewards: RevealedReward[] }) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  async function handleCopy(reward: RevealedReward) {
    try {
      await navigator.clipboard.writeText(reward.code)
    } catch {
      const el = document.createElement('textarea')
      el.value = reward.code
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    setCopiedId(reward.id)
    setTimeout(() => setCopiedId(null), 2200)
  }

  return (
    <div className="px-4">
      <p className="text-[#5C584C] text-[10px] uppercase tracking-widest font-bold mb-2.5">
        Already revealed · {rewards.length}
      </p>
      <div
        className="flex gap-3"
        style={{ overflowX: 'auto', scrollbarWidth: 'none' } as React.CSSProperties}
      >
        {rewards.map((r, i) => (
          <button
            key={r.id}
            onClick={() => handleCopy(r)}
            className="flex-shrink-0 rounded-xl overflow-hidden text-left tap-scale"
            style={{
              width: 144,
              background: REWARD_GRADIENTS[i % REWARD_GRADIENTS.length],
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <div className="p-3.5">
              <p className="text-white/70 text-[9px] font-bold uppercase tracking-wider mb-1 truncate">
                {r.partner_name}
              </p>
              <p
                className="font-mono font-bold text-xs tracking-wider truncate"
                style={{ color: copiedId === r.id ? '#C6F23E' : 'white' }}
              >
                {copiedId === r.id ? '✓ Copied!' : r.code}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export function RewardsFeed({ available, redeemed: initialRedeemed }: Props) {
  const [index, setIndex] = useState(0)
  const [exitDir, setExitDir] = useState<'left' | 'right' | null>(null)
  const [busy, setBusy] = useState(false)
  const [revealed, setRevealed] = useState<RevealedReward[]>(initialRedeemed)

  const cardRef = useRef<HTMLDivElement>(null)
  const nextCardRef = useRef<HTMLDivElement>(null)
  const skipLabelRef = useRef<HTMLDivElement>(null)
  const savedLabelRef = useRef<HTMLDivElement>(null)
  const drag = useRef({ active: false, startX: 0, currentDelta: 0, pointerId: -1 })

  const current = available[index]
  const next = available[index + 1]

  function applyDrag(delta: number) {
    const card = cardRef.current
    if (!card) return
    const rotation = delta * 0.055
    const lift = Math.min(Math.abs(delta) * 0.025, 10)
    card.style.transform = `translateX(${delta}px) rotate(${rotation}deg) translateY(-${lift}px)`
    const ratio = Math.min(Math.abs(delta) / SWIPE_THRESHOLD, 1)
    if (delta > 8) {
      card.style.boxShadow = `0 0 ${48 * ratio}px rgba(198,242,62,${0.5 * ratio})`
    } else if (delta < -8) {
      card.style.boxShadow = `0 0 ${48 * ratio}px rgba(239,68,68,${0.5 * ratio})`
    } else {
      card.style.boxShadow = ''
    }
    if (skipLabelRef.current) {
      skipLabelRef.current.style.opacity = delta < -24 ? String(Math.min((-delta - 24) / 56, 1)) : '0'
    }
    if (savedLabelRef.current) {
      savedLabelRef.current.style.opacity = delta > 24 ? String(Math.min((delta - 24) / 56, 1)) : '0'
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
    if (skipLabelRef.current) skipLabelRef.current.style.opacity = '0'
    if (savedLabelRef.current) savedLabelRef.current.style.opacity = '0'
    if (nextCardRef.current) {
      nextCardRef.current.style.transition = 'transform 0.38s cubic-bezier(0.16,1,0.3,1), opacity 0.38s'
      nextCardRef.current.style.transform = 'scale(0.93)'
      nextCardRef.current.style.opacity = '0.45'
      setTimeout(() => { if (nextCardRef.current) nextCardRef.current.style.transition = '' }, 400)
    }
  }

  const handleSkip = useCallback(async () => {
    if (busy || !current) return
    setBusy(true)
    setExitDir('left')
    await new Promise<void>((r) => setTimeout(r, 340))
    setExitDir(null)
    setIndex((i) => i + 1)
    setBusy(false)
  }, [busy, current])

  const handleReveal = useCallback(async () => {
    if (busy || !current) return
    setBusy(true)
    setExitDir('right')
    // Record redemption in background; code is used from local data for instant UX
    revealRewardCode(current.id)
    setRevealed((prev) => [{ ...current, code: current.discount_code }, ...prev])
    await new Promise<void>((r) => setTimeout(r, 340))
    setExitDir(null)
    setIndex((i) => i + 1)
    setBusy(false)
  }, [busy, current])

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
    drag.current.currentDelta = e.clientX - drag.current.startX
    applyDrag(drag.current.currentDelta)
  }

  async function onPointerUp(e: React.PointerEvent) {
    if (!drag.current.active || e.pointerId !== drag.current.pointerId) return
    drag.current.active = false
    if (cardRef.current) cardRef.current.style.userSelect = ''
    const delta = drag.current.currentDelta
    if (delta > SWIPE_THRESHOLD) {
      await handleReveal()
    } else if (delta < -SWIPE_THRESHOLD) {
      await handleSkip()
    } else {
      resetCard()
    }
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') handleSkip()
      if (e.key === 'ArrowRight') handleReveal()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleSkip, handleReveal])

  const BOTTOM_PAD = 'max(calc(env(safe-area-inset-bottom) + 84px), 100px)'

  // Empty states
  if (!current) {
    return (
      <div
        className="flex flex-col flex-1 overflow-hidden"
        style={{ paddingTop: 'max(calc(env(safe-area-inset-top) + 52px), 68px)' }}
      >
        <div className="flex flex-col items-center justify-center flex-1 px-6 text-center">
          {revealed.length === 0 ? (
            <>
              <div className="w-20 h-20 rounded-full bg-[#17150F] border border-[#3a3730] flex items-center justify-center text-4xl mb-6">
                ⭐
              </div>
              <h2 className="text-white text-2xl font-bold mb-2">No drops yet</h2>
              <p className="text-[#8a8575] text-sm max-w-xs">
                New partner offers are added regularly. Check back soon.
              </p>
            </>
          ) : (
            <>
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                style={{ background: 'rgba(198,242,62,0.1)', border: '1px solid rgba(198,242,62,0.3)' }}
              >
                <svg viewBox="0 0 24 24" fill="none" className="w-9 h-9" stroke="#C6F23E" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h2 className="text-white text-2xl font-bold mb-2">All rewards revealed</h2>
              <p className="text-[#8a8575] text-sm max-w-xs">
                You've unlocked every available reward. New drops appear regularly.
              </p>
            </>
          )}
        </div>
        <div className="flex-shrink-0" style={{ paddingBottom: BOTTOM_PAD }}>
          {revealed.length > 0 && <RevealedRow rewards={revealed} />}
        </div>
      </div>
    )
  }

  return (
    <div
      className="flex flex-col flex-1 overflow-hidden"
      style={{ paddingTop: 'max(calc(env(safe-area-inset-top) + 52px), 68px)' }}
    >
      {/* Counter */}
      <div className="flex justify-center pb-2 pointer-events-none">
        <span className="text-[#8a8575] text-xs uppercase tracking-wider">
          {index + 1} / {available.length}
        </span>
      </div>

      {/* Card stack */}
      <div className="flex-1 relative mx-4 min-h-0">
        {/* Next card peeking */}
        {next && (
          <div
            ref={nextCardRef}
            className="absolute inset-0 overflow-hidden"
            style={{
              zIndex: 0,
              borderRadius: 24,
              transform: 'scale(0.93)',
              opacity: 0.45,
              background: REWARD_GRADIENTS[(index + 1) % REWARD_GRADIENTS.length],
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)' }}
            />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="text-white text-lg font-black leading-tight">{next.partner_name}</p>
              <p className="text-white/60 text-sm mt-0.5">{next.discount_value}</p>
            </div>
          </div>
        )}

        {/* Active card */}
        <div
          ref={cardRef}
          key={current.id}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="absolute inset-0 overflow-hidden touch-none animate-card-enter"
          style={{
            zIndex: 1,
            cursor: 'grab',
            borderRadius: 24,
            background: REWARD_GRADIENTS[index % REWARD_GRADIENTS.length],
            transition: exitDir
              ? 'transform 0.34s cubic-bezier(0.4,0,0.2,1), opacity 0.34s'
              : undefined,
            transform:
              exitDir === 'left'
                ? 'translateX(-130%) rotate(-22deg)'
                : exitDir === 'right'
                ? 'translateX(130%) rotate(22deg)'
                : undefined,
            opacity: exitDir ? 0 : undefined,
          }}
        >
          {/* Dark scrim */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)' }}
          />

          {/* SKIP stamp */}
          <div
            ref={skipLabelRef}
            className="absolute top-8 right-5 z-20 pointer-events-none rotate-[14deg]"
            style={{ opacity: 0 }}
          >
            <div className="border-[3px] border-[#ef4444] rounded-xl px-4 py-1.5 bg-black/40 backdrop-blur-sm">
              <span className="text-[#ef4444] font-black text-xl tracking-[0.2em] uppercase">SKIP</span>
            </div>
          </div>

          {/* SAVED stamp */}
          <div
            ref={savedLabelRef}
            className="absolute top-8 left-5 z-20 pointer-events-none -rotate-[14deg]"
            style={{ opacity: 0 }}
          >
            <div className="border-[3px] border-[#C6F23E] rounded-xl px-4 py-1.5 bg-black/40 backdrop-blur-sm">
              <span className="text-[#C6F23E] font-black text-xl tracking-[0.2em] uppercase">SAVED</span>
            </div>
          </div>

          {/* Top badge */}
          <div className="absolute top-0 left-0 right-0 p-5 z-10">
            <span className="bg-black/30 backdrop-blur-sm text-white text-[9px] font-black uppercase tracking-[0.18em] px-2.5 py-1 rounded-full border border-white/20">
              Exclusive to Slide
            </span>
          </div>

          {/* Bottom content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
            {current.expires_at && (
              <p className="text-white/50 text-xs mb-3">
                Expires{' '}
                {new Date(current.expires_at).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            )}
            <p className="text-[#C6F23E] text-5xl font-black leading-none mb-2">
              {current.discount_value}
            </p>
            <h2 className="text-white text-2xl font-black leading-tight mb-1">
              {current.partner_name}
            </h2>
            <p className="text-white/70 text-sm mb-5 line-clamp-2">
              {current.offer_description}
            </p>
            <button
              onClick={handleReveal}
              disabled={busy}
              className="w-full py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all disabled:opacity-50 tap-scale"
              style={{
                background: '#C6F23E',
                color: '#100F0C',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              Reveal code →
            </button>
          </div>
        </div>
      </div>

      {/* Bottom: action buttons + revealed row */}
      <div className="flex-shrink-0" style={{ paddingBottom: BOTTOM_PAD }}>
        <div className="flex items-center justify-center gap-10 px-6 pt-5 pb-4">
          {/* Skip */}
          <button
            onClick={handleSkip}
            disabled={busy}
            aria-label="Skip"
            className="flex flex-col items-center gap-2 disabled:opacity-40 tap-scale"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <span
              className="flex items-center justify-center"
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                border: '2px solid #FF5C9D',
                background: 'transparent',
                color: '#FF5C9D',
                fontSize: 22,
              }}
            >
              ✕
            </span>
            <span className="text-[#8a8575] text-[10px] uppercase tracking-widest font-bold">Skip</span>
          </button>

          {/* Reveal */}
          <button
            onClick={handleReveal}
            disabled={busy}
            aria-label="Reveal"
            className="flex flex-col items-center gap-2 disabled:opacity-40 tap-scale"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <span
              className="flex items-center justify-center"
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: '#C6F23E',
                color: '#100F0C',
                fontSize: 26,
                boxShadow: '0 0 32px rgba(198,242,62,0.3)',
              }}
            >
              →
            </span>
            <span className="text-[#C6F23E] text-[10px] uppercase tracking-widest font-bold">Reveal</span>
          </button>
        </div>

        {revealed.length > 0 && <RevealedRow rewards={revealed} />}
      </div>
    </div>
  )
}
