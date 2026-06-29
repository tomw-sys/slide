'use client'

import { useState } from 'react'
import { RewardForm } from './reward-form'
import { ToggleButton } from './toggle-button'

type Reward = {
  id: string
  partner_name: string
  offer_description: string
  discount_code: string
  discount_value: string
  minimum_tier: string
  expires_at: string | null
  is_active: boolean
}

const TIER_COLOUR: Record<string, string> = {
  rising: 'text-[#a3a3a3]',
  verified: 'text-[#1ee231]',
  elite: 'text-[#f59e0b]',
  ambassador: 'text-[#a855f7]',
}

export function RewardsManager({ rewards }: { rewards: Reward[] }) {
  const [editingReward, setEditingReward] = useState<Reward | null>(null)
  const [showNew, setShowNew] = useState(false)

  function handleClose() {
    setEditingReward(null)
    setShowNew(false)
  }

  return (
    <div>
      {/* Add / form panel */}
      {(showNew || editingReward) && (
        <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-6 mb-6">
          <h2 className="text-white font-semibold mb-5">
            {editingReward ? `Edit — ${editingReward.partner_name}` : 'Add reward'}
          </h2>
          <RewardForm reward={editingReward ?? undefined} onClose={handleClose} />
        </div>
      )}

      {/* Add button */}
      {!showNew && !editingReward && (
        <button
          onClick={() => setShowNew(true)}
          className="mb-6 bg-[#1ee231] text-[#151515] font-semibold rounded-xl px-4 py-2.5 text-sm hover:bg-[#17c029] transition-colors"
        >
          Add reward
        </button>
      )}

      {/* Rewards list */}
      {rewards.length === 0 ? (
        <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-10 text-center">
          <p className="text-white font-semibold mb-1">No rewards yet</p>
          <p className="text-[#a3a3a3] text-sm">Add your first reward offer above.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {rewards.map((reward) => {
            const tierColour = TIER_COLOUR[reward.minimum_tier] ?? 'text-[#a3a3a3]'
            const expiryLabel = reward.expires_at
              ? new Date(reward.expires_at).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
              : 'No expiry'

            return (
              <div
                key={reward.id}
                className={`bg-[#1c1c1c] border rounded-xl p-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between ${
                  reward.is_active ? 'border-[#2a2a2a]' : 'border-[#2a2a2a] opacity-50'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <p className="text-white font-semibold">{reward.partner_name}</p>
                    <span className="bg-[#1ee231]/10 text-[#1ee231] text-xs font-bold px-2.5 py-0.5 rounded-lg">
                      {reward.discount_value}
                    </span>
                    {!reward.is_active && (
                      <span className="text-[#a3a3a3] text-xs uppercase tracking-wider">
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className="text-[#d4d4d4] text-sm mb-2">{reward.offer_description}</p>
                  <div className="flex items-center gap-4 text-xs text-[#a3a3a3] flex-wrap">
                    <span>
                      Code:{' '}
                      <span className="font-mono text-[#d4d4d4]">{reward.discount_code}</span>
                    </span>
                    <span>
                      Tier:{' '}
                      <span className={`font-medium uppercase tracking-wider ${tierColour}`}>
                        {reward.minimum_tier}
                      </span>
                      +
                    </span>
                    <span>Expires: {expiryLabel}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => {
                      setShowNew(false)
                      setEditingReward(reward)
                    }}
                    className="text-xs font-medium border border-[#2a2a2a] text-[#a3a3a3] rounded-lg px-3 py-1.5 hover:border-[#3a3a3a] hover:text-white transition-colors"
                  >
                    Edit
                  </button>
                  <ToggleButton rewardId={reward.id} isActive={reward.is_active} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
