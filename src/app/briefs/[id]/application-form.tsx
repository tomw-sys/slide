'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { submitApplication } from '@/app/actions/briefs'

interface Props {
  briefId: string
  briefBudget: number | null
}

export function ApplicationForm({ briefId, briefBudget }: Props) {
  const router = useRouter()
  const [pitch, setPitch] = useState('')
  const [proposedRate, setProposedRate] = useState(
    briefBudget ? String(Math.round(briefBudget / 100)) : ''
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData()
    formData.set('brief_id', briefId)
    formData.set('pitch', pitch)
    formData.set('proposed_rate', proposedRate)

    const result = await submitApplication(formData)

    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    if (result.redirectTo) {
      router.push(result.redirectTo)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-white font-semibold mb-1">Apply to this brief</h2>
      <p className="text-[#8a8575] text-sm mb-4">
        Tell the brand why you are the right creator for this job.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-[#F4EFE3] text-sm font-medium mb-1.5">Your pitch</label>
          <textarea
            value={pitch}
            onChange={(e) => setPitch(e.target.value)}
            placeholder="Introduce yourself, explain your approach to this brief, and share any relevant experience or previous work links."
            rows={5}
            required
            className="w-full bg-[#100F0C] border border-[#3a3730] rounded-xl px-4 py-3 text-white placeholder-[#8a8575] focus:outline-none focus:ring-2 focus:ring-[#C6F23E] focus:border-transparent transition-all resize-none text-sm"
          />
        </div>

        <div>
          <label className="block text-[#F4EFE3] text-sm font-medium mb-1.5">
            Your proposed rate
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a8575] font-medium">
              £
            </span>
            <input
              type="number"
              value={proposedRate}
              onChange={(e) => setProposedRate(e.target.value)}
              placeholder="500"
              min="1"
              step="1"
              required
              className="w-full bg-[#100F0C] border border-[#3a3730] rounded-xl pl-8 pr-4 py-3 text-white placeholder-[#8a8575] focus:outline-none focus:ring-2 focus:ring-[#C6F23E] focus:border-transparent transition-all"
            />
          </div>
        </div>

        {error && <p className="text-[#ef4444] text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#C6F23E] text-[#100F0C] font-semibold rounded-xl px-4 py-3 hover:bg-[#ADDA38] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : 'Submit application'}
        </button>
      </div>
    </form>
  )
}
