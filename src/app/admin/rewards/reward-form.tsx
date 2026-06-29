'use client'

import { useState, useRef } from 'react'
import { createReward, updateReward } from '@/app/actions/rewards'

const TIERS = [
  { value: 'rising', label: 'Rising (all creators)' },
  { value: 'verified', label: 'Verified' },
  { value: 'elite', label: 'Elite' },
  { value: 'ambassador', label: 'Ambassador' },
]

type Reward = {
  id: string
  partner_name: string
  offer_description: string
  discount_code: string
  discount_value: string
  minimum_tier: string
  expires_at: string | null
}

function Field({
  label,
  name,
  defaultValue,
  type = 'text',
  required,
  placeholder,
}: {
  label: string
  name: string
  defaultValue?: string
  type?: string
  required?: boolean
  placeholder?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[#8a8575] text-xs uppercase tracking-wider">
        {label}
        {required && <span className="text-[#ef4444] ml-1">*</span>}
      </label>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue ?? ''}
        required={required}
        placeholder={placeholder}
        className="bg-[#100F0C] border border-[#3a3730] rounded-xl px-4 py-2.5 text-white text-sm placeholder-[#8a8575] focus:outline-none focus:border-[#C6F23E] transition-colors"
      />
    </div>
  )
}

export function RewardForm({
  reward,
  onClose,
}: {
  reward?: Reward
  onClose: () => void
}) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = reward
      ? await updateReward(reward.id, formData)
      : await createReward(formData)

    setLoading(false)

    if (result.error) {
      setError(result.error)
    } else {
      onClose()
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Field
        label="Partner name"
        name="partner_name"
        defaultValue={reward?.partner_name}
        required
        placeholder="e.g. ASOS"
      />
      <Field
        label="Offer description"
        name="offer_description"
        defaultValue={reward?.offer_description}
        required
        placeholder="e.g. 20% off your next order"
      />
      <Field
        label="Discount code"
        name="discount_code"
        defaultValue={reward?.discount_code}
        required
        placeholder="e.g. SLIDE20"
      />
      <Field
        label="Discount value"
        name="discount_value"
        defaultValue={reward?.discount_value}
        required
        placeholder="e.g. 20% off or £10 off"
      />
      <div className="flex flex-col gap-1.5">
        <label className="text-[#8a8575] text-xs uppercase tracking-wider">Minimum tier</label>
        <select
          name="minimum_tier"
          defaultValue={reward?.minimum_tier ?? 'rising'}
          className="bg-[#100F0C] border border-[#3a3730] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#C6F23E] transition-colors"
        >
          {TIERS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>
      <Field
        label="Expiry date"
        name="expires_at"
        defaultValue={reward?.expires_at ?? ''}
        type="date"
      />

      {error && <p className="text-[#ef4444] text-sm">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-[#C6F23E] text-[#100F0C] font-semibold rounded-xl px-5 py-2.5 text-sm hover:bg-[#ADDA38] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : reward ? 'Save changes' : 'Add reward'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="border border-[#3a3730] text-[#8a8575] font-medium rounded-xl px-5 py-2.5 text-sm hover:border-[#4a4640] hover:text-white transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
