'use client'

import { useState } from 'react'
import { toggleRewardActive } from '@/app/actions/rewards'

export function ToggleButton({
  rewardId,
  isActive,
}: {
  rewardId: string
  isActive: boolean
}) {
  const [active, setActive] = useState(isActive)
  const [loading, setLoading] = useState(false)

  async function handleToggle() {
    setLoading(true)
    const result = await toggleRewardActive(rewardId, !active)
    setLoading(false)
    if (!result.error) setActive(!active)
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`text-xs font-medium uppercase tracking-wider px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-60 ${
        active
          ? 'border-[#ef4444]/40 text-[#ef4444] hover:bg-[#ef4444]/10'
          : 'border-[#1ee231]/40 text-[#1ee231] hover:bg-[#1ee231]/10'
      }`}
    >
      {loading ? '...' : active ? 'Deactivate' : 'Activate'}
    </button>
  )
}
