'use client'

import { useState, useRef } from 'react'
import { approveCreator, rejectCreator } from '@/app/actions/verification'

type Mode = 'idle' | 'rejecting' | 'loading' | 'done'

export function VerificationActions({ creatorId }: { creatorId: string }) {
  const [mode, setMode] = useState<Mode>('idle')
  const [reason, setReason] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [outcome, setOutcome] = useState<'approved' | 'rejected' | null>(null)
  // Separate flag avoids TypeScript narrowing the mode union in JSX branches
  const loading = useRef(false)

  async function handleApprove() {
    loading.current = true
    setMode('loading')
    setError(null)
    const result = await approveCreator(creatorId)
    loading.current = false
    if (result.error) {
      setError(result.error)
      setMode('idle')
    } else {
      setOutcome('approved')
      setMode('done')
    }
  }

  async function handleReject() {
    if (!reason.trim()) {
      setError('Enter a reason before rejecting.')
      return
    }
    loading.current = true
    setMode('loading')
    setError(null)
    const result = await rejectCreator(creatorId, reason)
    loading.current = false
    if (result.error) {
      setError(result.error)
      setMode('rejecting')
    } else {
      setOutcome('rejected')
      setMode('done')
    }
  }

  if (mode === 'done') {
    return (
      <span
        className={`text-xs font-medium uppercase tracking-wider px-3 py-1.5 rounded-lg ${
          outcome === 'approved'
            ? 'bg-[#1ee231]/10 text-[#1ee231]'
            : 'bg-[#ef4444]/10 text-[#ef4444]'
        }`}
      >
        {outcome === 'approved' ? 'Approved' : 'Rejected'}
      </span>
    )
  }

  const isLoading = mode === 'loading'

  return (
    <div className="flex flex-col gap-3">
      {error && <p className="text-[#ef4444] text-xs">{error}</p>}

      {mode === 'rejecting' || mode === 'loading' && loading.current ? (
        <div className="flex flex-col gap-2">
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Explain what the creator should improve before re-submitting..."
            rows={3}
            className="bg-[#151515] border border-[#2a2a2a] rounded-xl px-3 py-2 text-white text-sm placeholder-[#a3a3a3] focus:outline-none focus:border-[#ef4444]/60 resize-none transition-colors w-full"
          />
          <div className="flex gap-2">
            <button
              onClick={handleReject}
              disabled={isLoading}
              className="text-xs font-medium bg-[#ef4444] text-white rounded-lg px-3 py-1.5 hover:bg-[#dc2626] transition-colors disabled:opacity-60"
            >
              {isLoading ? 'Saving...' : 'Confirm rejection'}
            </button>
            <button
              onClick={() => { setMode('idle'); setError(null) }}
              disabled={isLoading}
              className="text-xs font-medium border border-[#2a2a2a] text-[#a3a3a3] rounded-lg px-3 py-1.5 hover:text-white transition-colors disabled:opacity-40"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={handleApprove}
            disabled={isLoading}
            className="text-xs font-medium bg-[#1ee231] text-[#151515] rounded-lg px-3 py-1.5 hover:bg-[#17c029] transition-colors disabled:opacity-60"
          >
            {isLoading ? 'Saving...' : 'Approve'}
          </button>
          <button
            onClick={() => setMode('rejecting')}
            disabled={isLoading}
            className="text-xs font-medium border border-[#ef4444]/40 text-[#ef4444] rounded-lg px-3 py-1.5 hover:bg-[#ef4444]/10 transition-colors disabled:opacity-60"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  )
}
