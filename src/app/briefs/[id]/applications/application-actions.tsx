'use client'

import { useState } from 'react'
import { acceptApplication, rejectApplication } from '@/app/actions/applications'

interface Props {
  applicationId: string
  currentStatus: string
}

const REVIEWED_BADGE: Record<string, { label: string; classes: string }> = {
  accepted: { label: 'Accepted', classes: 'bg-[#1ee231]/10 text-[#1ee231]' },
  rejected: { label: 'Not progressed', classes: 'bg-[#ef4444]/10 text-[#ef4444]' },
  withdrawn: { label: 'Withdrawn', classes: 'bg-[#2a2a2a] text-[#a3a3a3]' },
}

export function ApplicationActions({ applicationId, currentStatus }: Props) {
  const [loading, setLoading] = useState<'accept' | 'reject' | null>(null)
  const [status, setStatus] = useState(currentStatus)
  const [error, setError] = useState('')

  if (status !== 'pending') {
    const badge = REVIEWED_BADGE[status]
    if (!badge) return null
    return (
      <span
        className={`inline-block px-2.5 py-0.5 rounded-lg text-xs font-medium uppercase tracking-wider ${badge.classes}`}
      >
        {badge.label}
      </span>
    )
  }

  async function handleAccept() {
    setLoading('accept')
    setError('')
    const result = await acceptApplication(applicationId)
    if (result.error) {
      setError(result.error)
      setLoading(null)
    } else {
      setStatus('accepted')
      setLoading(null)
    }
  }

  async function handleReject() {
    setLoading('reject')
    setError('')
    const result = await rejectApplication(applicationId)
    if (result.error) {
      setError(result.error)
      setLoading(null)
    } else {
      setStatus('rejected')
      setLoading(null)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <button
          onClick={handleAccept}
          disabled={!!loading}
          className="px-4 py-2 bg-[#1ee231] text-[#151515] text-sm font-semibold rounded-xl hover:bg-[#17c029] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading === 'accept' ? 'Accepting...' : 'Accept'}
        </button>
        <button
          onClick={handleReject}
          disabled={!!loading}
          className="px-4 py-2 bg-[#1c1c1c] border border-[#ef4444]/30 text-[#ef4444] text-sm font-semibold rounded-xl hover:bg-[#ef4444]/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading === 'reject' ? 'Passing...' : 'Pass'}
        </button>
      </div>
      {error && <p className="text-[#ef4444] text-xs">{error}</p>}
    </div>
  )
}
