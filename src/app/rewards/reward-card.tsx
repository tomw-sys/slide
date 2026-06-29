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

const PARTNER_IMAGE: Record<string, string> = {
  // Seeded partners
  'asos':                 '1558618666-fcd25c85cd64',
  'gymshark':             '1517836357463-d25dfeac3438',
  'adobe creative cloud': '1461749280684-dccba630e2f6',
  'squarespace':          '1488590528505-98d2b5aba04b',
  'airbnb':               '1476514525535-07fb3b4ae5f1',
  // Generic category fallbacks
  'fashion':    '1441986300917-64674bd600d8',
  'food':       '1565299624946-b28f40a0ae38',
  'fitness':    '1517836357463-d25dfeac3438',
  'beauty':     '1522335789203-aabd1fc54bc9',
  'travel':     '1476514525535-07fb3b4ae5f1',
  'lifestyle':  '1506126613408-eca07ce68773',
  'tech':       '1498050108023-c5249f4df085',
  'creative':   '1461749280684-dccba630e2f6',
}

const FALLBACK_IMAGES = [
  '1441986300917-64674bd600d8',
  '1565299624946-b28f40a0ae38',
  '1517836357463-d25dfeac3438',
  '1558618666-fcd25c85cd64',
  '1522335789203-aabd1fc54bc9',
  '1476514525535-07fb3b4ae5f1',
  '1498050108023-c5249f4df085',
  '1461749280684-dccba630e2f6',
]

function getPartnerImage(name: string): string {
  const key = name.toLowerCase()
  if (PARTNER_IMAGE[key]) return PARTNER_IMAGE[key]
  // Deterministic fallback from partner name hash
  const hash = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return FALLBACK_IMAGES[hash % FALLBACK_IMAGES.length]
}

export function RewardCard({ reward }: { reward: Reward }) {
  const [code, setCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const photoId = getPartnerImage(reward.partner_name)
  const imageUrl = `https://images.unsplash.com/photo-${photoId}?w=800&q=80`

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
    <div className="relative h-80 rounded-2xl overflow-hidden">
      {/* Full-bleed background image */}
      <img
        src={imageUrl}
        alt={reward.partner_name}
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.15) 100%)' }}
      />

      {/* Top row */}
      <div className="absolute top-0 left-0 right-0 p-4 flex items-start justify-between z-10">
        <span className="bg-[#C6F23E] text-[#100F0C] text-[9px] font-black uppercase tracking-[0.18em] px-2.5 py-1 rounded-full">
          Exclusive to Slide
        </span>
        {expiryLabel && (
          <span className="bg-black/50 backdrop-blur-sm text-[#8a8575] text-[10px] font-medium px-2.5 py-1 rounded-full border border-white/10">
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
            <p className="text-[#8a8575] text-xs mt-0.5 line-clamp-1">
              {reward.offer_description}
            </p>
          </div>
          <p className="text-[#C6F23E] font-black text-3xl leading-none flex-shrink-0 tabular-nums">
            {reward.discount_value}
          </p>
        </div>

        {error && <p className="text-[#ef4444] text-xs mb-2">{error}</p>}

        {code ? (
          <button
            onClick={handleCopy}
            className="w-full flex items-center justify-between gap-3 bg-black/60 backdrop-blur-sm rounded-xl px-4 py-3 transition-all tap-scale border"
            style={{ borderColor: copied ? '#C6F23E' : 'rgba(255,255,255,0.12)' }}
          >
            <span className="font-mono font-bold text-base tracking-[0.18em] text-[#C6F23E] flex-1 text-left truncate">
              {code}
            </span>
            <span
              className="flex items-center gap-1.5 text-xs font-semibold flex-shrink-0 transition-colors"
              style={{ color: copied ? '#C6F23E' : '#8a8575' }}
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
            className="w-full py-3 rounded-xl text-sm font-bold tracking-wide transition-all tap-scale disabled:opacity-50 disabled:cursor-not-allowed bg-black/50 backdrop-blur-sm text-[#C6F23E] border border-[#C6F23E]/40 hover:border-[#C6F23E]/80 hover:bg-black/60"
          >
            {loading ? 'Unlocking...' : 'Reveal code →'}
          </button>
        )}
      </div>
    </div>
  )
}
