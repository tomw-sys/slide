'use client'

import { useState } from 'react'
import { revealRewardCode } from '@/app/actions/rewards'

type Reward = {
  id: string
  partner_name: string
  offer_description: string
  discount_value: string
  expires_at: string | null
  minimum_tier: string
}

const REWARD_GRADIENTS = [
  'linear-gradient(150deg, #FF5C9D 0%, #7C5CFF 100%)',
  'linear-gradient(150deg, #C6F23E 0%, #4D8BFF 100%)',
  'linear-gradient(150deg, #7C5CFF 0%, #4D8BFF 100%)',
]

export function RewardCard({ reward, index }: { reward: Reward; index: number }) {
  const [code, setCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const gradient = REWARD_GRADIENTS[index % REWARD_GRADIENTS.length]

  async function handleReveal() {
    setLoading(true)
    setError(null)
    const result = await revealRewardCode(reward.id)
    setLoading(false)
    if (result.error) {
      setError(result.error)
    } else if (result.code) {
      setCode(result.code)
    }
  }

  async function handleCopy() {
    if (!code) return
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      const el = document.createElement('textarea')
      el.value = code
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    }
  }

  const expiryLabel = reward.expires_at
    ? new Date(reward.expires_at).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : null

  return (
    <div className="relative h-80 rounded-2xl overflow-hidden" style={{ background: gradient }}>
      {/* Dark bottom scrim for text legibility */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)' }}
      />

      {/* Top row */}
      <div className="absolute top-0 left-0 right-0 p-4 flex items-start justify-between z-10">
        <span className="bg-black/30 backdrop-blur-sm text-white text-[9px] font-black uppercase tracking-[0.18em] px-2.5 py-1 rounded-full border border-white/20">
          Exclusive to Slide
        </span>
        {expiryLabel && (
          <span className="bg-black/30 backdrop-blur-sm text-white/70 text-[10px] font-medium px-2.5 py-1 rounded-full border border-white/10">
            Expires {expiryLabel}
          </span>
        )}
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        {/* Partner + discount hero */}
        <div className="flex items-end justify-between mb-3">
          <div className="flex-1 min-w-0 pr-3">
            <p className="text-white font-black text-xl leading-tight truncate">
              {reward.partner_name}
            </p>
            <p className="text-white/70 text-xs mt-0.5 line-clamp-1">
              {reward.offer_description}
            </p>
          </div>
          <p className="text-white font-black text-3xl leading-none flex-shrink-0 tabular-nums">
            {reward.discount_value}
          </p>
        </div>

        {error && <p className="text-[#ef4444] text-xs mb-2">{error}</p>}

        {code ? (
          <button
            onClick={handleCopy}
            className="w-full flex items-center justify-between gap-3 bg-black/50 backdrop-blur-sm rounded-xl px-4 py-3 transition-all tap-scale border"
            style={{ borderColor: copied ? '#C6F23E' : 'rgba(255,255,255,0.2)' }}
          >
            <span className="font-mono font-bold text-base tracking-[0.18em] text-[#C6F23E] flex-1 text-left truncate">
              {code}
            </span>
            <span
              className="flex items-center gap-1.5 text-xs font-semibold flex-shrink-0 transition-colors"
              style={{ color: copied ? '#C6F23E' : 'rgba(255,255,255,0.7)' }}
            >
              {copied ? (
                <>
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd"/>
                  </svg>
                  Copied
                </>
              ) : (
                <>
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z"/>
                    <path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z"/>
                  </svg>
                  Copy
                </>
              )}
            </span>
          </button>
        ) : (
          <button
            onClick={handleReveal}
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-bold tracking-wide transition-all tap-scale disabled:opacity-50 disabled:cursor-not-allowed bg-black/40 backdrop-blur-sm text-white border border-white/30 hover:border-white/60 hover:bg-black/50"
          >
            {loading ? 'Unlocking...' : 'Reveal code →'}
          </button>
        )}
      </div>
    </div>
  )
}
