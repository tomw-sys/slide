'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateBriefStatus } from '@/app/actions/briefs'

interface Props {
  briefId: string
  currentStatus: string
}

export function BriefStatusControls({ briefId, currentStatus }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleStatusChange(status: 'draft' | 'live' | 'closed') {
    setLoading(true)
    await updateBriefStatus(briefId, status)
    router.refresh()
    setLoading(false)
  }

  if (currentStatus === 'completed') return null

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      {currentStatus === 'draft' && (
        <button
          onClick={() => handleStatusChange('live')}
          disabled={loading}
          className="text-xs font-medium px-3 py-1.5 rounded-lg bg-[#C6F23E]/10 text-[#C6F23E] hover:bg-[#C6F23E]/20 transition-colors disabled:opacity-50"
        >
          Publish
        </button>
      )}
      {currentStatus === 'live' && (
        <button
          onClick={() => handleStatusChange('closed')}
          disabled={loading}
          className="text-xs font-medium px-3 py-1.5 rounded-lg bg-[#3a3730] text-[#8a8575] hover:text-white hover:bg-[#333] transition-colors disabled:opacity-50"
        >
          Close
        </button>
      )}
      {currentStatus === 'closed' && (
        <button
          onClick={() => handleStatusChange('live')}
          disabled={loading}
          className="text-xs font-medium px-3 py-1.5 rounded-lg bg-[#C6F23E]/10 text-[#C6F23E] hover:bg-[#C6F23E]/20 transition-colors disabled:opacity-50"
        >
          Reopen
        </button>
      )}
    </div>
  )
}
