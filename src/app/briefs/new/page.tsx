'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createBrief } from '@/app/actions/briefs'

const NICHES = [
  'Fashion', 'Beauty', 'Lifestyle', 'Food & Drink', 'Travel', 'Fitness',
  'Tech', 'Gaming', 'Home & Living', 'Parenting', 'Finance', 'Music',
  'Comedy', 'Education', 'Sustainability', 'Pets',
]

export default function NewBriefPage() {
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [deliverables, setDeliverables] = useState('')
  const [budget, setBudget] = useState('')
  const [deadline, setDeadline] = useState('')
  const [selectedNiches, setSelectedNiches] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function toggleNiche(niche: string) {
    setSelectedNiches((prev) =>
      prev.includes(niche) ? prev.filter((n) => n !== niche) : [...prev, niche]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData()
    formData.set('title', title)
    formData.set('description', description)
    formData.set('deliverables', deliverables)
    formData.set('budget', budget)
    formData.set('deadline', deadline)
    formData.set('niches', selectedNiches.join(','))

    const result = await createBrief(formData)

    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    router.push(`/briefs/${result.id}`)
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <main className="min-h-screen bg-[#151515]">
      <nav className="border-b border-[#2a2a2a] px-6 py-4 flex items-center gap-4">
        <Link href="/briefs" className="text-[#1ee231] text-xl font-bold tracking-tight">
          Slide
        </Link>
        <span className="text-[#2a2a2a]">/</span>
        <span className="text-[#a3a3a3] text-sm">New brief</span>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-white text-2xl font-bold mb-1">Create a brief</h1>
          <p className="text-[#a3a3a3] text-sm">
            Briefs are saved as drafts first. Publish when you are ready for creators to see it.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-6 space-y-4">
            <h2 className="text-white font-semibold">The basics</h2>
            <div>
              <label className="block text-[#d4d4d4] text-sm font-medium mb-1.5">
                Brief title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Summer collection UGC for Instagram"
                required
                className="w-full bg-[#151515] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder-[#a3a3a3] focus:outline-none focus:ring-2 focus:ring-[#1ee231] focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-[#d4d4d4] text-sm font-medium mb-1.5">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the content you need. What is the product? What tone and style are you after? Any brand guidelines to follow?"
                rows={5}
                required
                className="w-full bg-[#151515] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder-[#a3a3a3] focus:outline-none focus:ring-2 focus:ring-[#1ee231] focus:border-transparent transition-all resize-none"
              />
            </div>
          </div>

          {/* Deliverables */}
          <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-6">
            <h2 className="text-white font-semibold mb-1">Deliverables</h2>
            <p className="text-[#a3a3a3] text-sm mb-4">
              List exactly what you need. One deliverable per line.
            </p>
            <textarea
              value={deliverables}
              onChange={(e) => setDeliverables(e.target.value)}
              placeholder={`3 x 15-30 second vertical videos\n2 x static images\n1 x behind the scenes clip`}
              rows={4}
              className="w-full bg-[#151515] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder-[#a3a3a3] focus:outline-none focus:ring-2 focus:ring-[#1ee231] focus:border-transparent transition-all resize-none font-mono text-sm"
            />
          </div>

          {/* Budget and deadline */}
          <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-6 space-y-4">
            <h2 className="text-white font-semibold">Budget and timeline</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[#d4d4d4] text-sm font-medium mb-1.5">
                  Total budget
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a3a3a3] font-medium">
                    £
                  </span>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="500"
                    min="1"
                    step="1"
                    required
                    className="w-full bg-[#151515] border border-[#2a2a2a] rounded-xl pl-8 pr-4 py-3 text-white placeholder-[#a3a3a3] focus:outline-none focus:ring-2 focus:ring-[#1ee231] focus:border-transparent transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[#d4d4d4] text-sm font-medium mb-1.5">
                  Deadline
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  min={today}
                  required
                  className="w-full bg-[#151515] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#1ee231] focus:border-transparent transition-all [color-scheme:dark]"
                />
              </div>
            </div>
          </div>

          {/* Niches */}
          <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-6">
            <h2 className="text-white font-semibold mb-1">Target niches</h2>
            <p className="text-[#a3a3a3] text-sm mb-4">
              Creators whose niches match will see this brief in their feed.
            </p>
            <div className="flex flex-wrap gap-2">
              {NICHES.map((niche) => {
                const selected = selectedNiches.includes(niche)
                return (
                  <button
                    key={niche}
                    type="button"
                    onClick={() => toggleNiche(niche)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                      selected
                        ? 'bg-[#1ee231] text-[#151515] border-[#1ee231]'
                        : 'bg-[#151515] text-[#d4d4d4] border-[#2a2a2a] hover:border-[#1ee231] hover:text-white'
                    }`}
                  >
                    {niche}
                  </button>
                )
              })}
            </div>
            {selectedNiches.length > 0 && (
              <p className="text-[#a3a3a3] text-xs mt-3">{selectedNiches.length} selected</p>
            )}
          </div>

          {error && (
            <div className="bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-xl px-4 py-3">
              <p className="text-[#ef4444] text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <Link
              href="/briefs"
              className="flex-1 text-center border border-[#2a2a2a] text-[#a3a3a3] font-medium rounded-xl px-4 py-3 hover:border-white hover:text-white transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#1ee231] text-[#151515] font-semibold rounded-xl px-4 py-3 hover:bg-[#17c029] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save as draft'}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
