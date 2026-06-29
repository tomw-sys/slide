'use client'

import { useState } from 'react'
import { resetSwipes } from '@/app/actions/briefs'

export function ResetSwipesButton() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleReset() {
    setLoading(true)
    setError(null)
    const result = await resetSwipes()
    if (result.error) {
      setError(result.error)
      setLoading(false)
    }
    // revalidatePath('/swipe') triggers a server re-render so no manual reload needed
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleReset}
        disabled={loading}
        className="text-[#8a8575] text-xs border border-[#3a3730] rounded-lg px-4 py-2 hover:border-[#4a4640] hover:text-white transition-colors disabled:opacity-40"
      >
        {loading ? 'Resetting...' : 'Reset swipe history'}
      </button>
      {error && <p className="text-[#ef4444] text-xs">{error}</p>}
    </div>
  )
}
