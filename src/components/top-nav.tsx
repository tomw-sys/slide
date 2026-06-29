'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from '@/app/actions/auth'

interface TopNavProps {
  displayName: string
  role: 'creator' | 'brand' | 'admin'
  tier?: string
  avatarUrl?: string
}

const TIER_COLOUR: Record<string, string> = {
  rising:     '#8a8575',
  verified:   '#C6F23E',
  elite:      '#f59e0b',
  ambassador: '#a855f7',
}

const CREATOR_LINKS = [
  {
    label: 'Swipe',
    href: '/swipe',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" stroke="currentColor">
        <path d="M12 4.5C10 6.5 7 9 7 12.5a5 5 0 0 0 10 0c0-3.5-3-6-5-8z"/>
        <path d="M9 14.5l3 3 3-3"/>
      </svg>
    ),
  },
  {
    label: 'Briefs',
    href: '/briefs',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" stroke="currentColor">
        <rect x="4" y="4" width="16" height="16" rx="3"/>
        <path d="M8 9h8M8 13h5"/>
      </svg>
    ),
  },
  {
    label: 'Deals',
    href: '/deals',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" stroke="currentColor">
        <path d="M20 12V22H4V12"/>
        <path d="M22 7H2v5h20V7z"/>
        <path d="M12 22V7"/>
        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
      </svg>
    ),
  },
  {
    label: 'Rewards',
    href: '/rewards',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" stroke="currentColor">
        <path d="M12 3l2.2 6.7H21l-5.6 4.1 2.1 6.7L12 16.5l-5.5 4 2.1-6.7L3 9.7h6.8z"/>
      </svg>
    ),
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" stroke="currentColor">
        <circle cx="12" cy="8" r="4"/>
        <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/>
      </svg>
    ),
  },
]

const BRAND_LINKS = [
  {
    label: 'Briefs',
    href: '/briefs',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" stroke="currentColor">
        <rect x="4" y="4" width="16" height="16" rx="3"/>
        <path d="M8 9h8M8 13h5"/>
      </svg>
    ),
  },
  {
    label: 'Creators',
    href: '/creators',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" stroke="currentColor">
        <circle cx="9" cy="7" r="4"/>
        <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75M21 21v-2a4 4 0 0 0-3-3.87"/>
      </svg>
    ),
  },
  {
    label: 'Deals',
    href: '/deals',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" stroke="currentColor">
        <path d="M20 12V22H4V12"/>
        <path d="M22 7H2v5h20V7z"/>
        <path d="M12 22V7"/>
      </svg>
    ),
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" stroke="currentColor">
        <circle cx="12" cy="8" r="4"/>
        <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/>
      </svg>
    ),
  },
]

const ADMIN_LINKS = [
  {
    label: 'Creators',
    href: '/admin/creators',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" stroke="currentColor">
        <circle cx="9" cy="7" r="4"/>
        <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
      </svg>
    ),
  },
  {
    label: 'Rewards',
    href: '/admin/rewards',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" stroke="currentColor">
        <path d="M12 3l2.2 6.7H21l-5.6 4.1 2.1 6.7L12 16.5l-5.5 4 2.1-6.7L3 9.7h6.8z"/>
      </svg>
    ),
  },
]

export function TopNav({ displayName, role, tier, avatarUrl }: TopNavProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => { setDrawerOpen(false) }, [pathname])

  const initial = (displayName || 'U')[0].toUpperCase()
  const tierColour = tier ? (TIER_COLOUR[tier] ?? '#8a8575') : null
  const links = role === 'brand' ? BRAND_LINKS : role === 'admin' ? ADMIN_LINKS : CREATOR_LINKS

  return (
    <>
      {/* Sticky solid header */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5"
        style={{
          paddingTop: 'max(env(safe-area-inset-top), 16px)',
          paddingBottom: 12,
          background: '#100F0C',
          borderBottom: '1px solid #3a3730',
        }}
      >
        {/* Hamburger — three lines, bottom one shorter */}
        <button
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
          className="w-10 h-10 flex flex-col justify-center gap-[5px] tap-scale"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <span className="h-[1.5px] bg-white rounded-full" style={{ width: 22 }} />
          <span className="h-[1.5px] bg-white rounded-full" style={{ width: 22 }} />
          <span className="h-[1.5px] bg-white rounded-full" style={{ width: 14 }} />
        </button>

        {/* Wordmark */}
        <Link
          href="/dashboard"
          className="font-display font-black text-xl tracking-tight text-white"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          Slide<span className="text-[#C6F23E]">.</span>
        </Link>

        {/* Avatar → /profile */}
        <Link
          href="/profile"
          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold overflow-hidden border border-white/10 tap-scale"
          style={{
            backgroundColor: '#3a3730',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
          ) : (
            initial
          )}
        </Link>
      </header>

      {/* Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Panel */}
          <div className="relative flex flex-col w-72 max-w-[85vw] h-full bg-[#17150F] animate-slide-in-left shadow-2xl">
            {/* Close */}
            <button
              onClick={() => setDrawerOpen(false)}
              aria-label="Close menu"
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/8 flex items-center justify-center text-[#5C584C] hover:text-white transition-colors tap-scale"
              style={{
                marginTop: 'max(env(safe-area-inset-top), 12px)',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>

            {/* User block */}
            <div
              className="px-5 pb-5 border-b border-[#3a3730]"
              style={{ paddingTop: 'max(calc(env(safe-area-inset-top) + 24px), 40px)' }}
            >
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-black mb-3 overflow-hidden border-2 border-[#4a4640]" style={{ backgroundColor: '#3a3730' }}>
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  initial
                )}
              </div>
              <p className="text-white font-bold text-base leading-snug">{displayName}</p>
              {tier && tierColour && (
                <span
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider mt-1.5 px-2 py-0.5 rounded-full"
                  style={{ color: tierColour, backgroundColor: `${tierColour}1a` }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tierColour }} />
                  {tier}
                </span>
              )}
            </div>

            {/* Links */}
            <nav className="flex-1 p-3 overflow-y-auto">
              {links.map((link) => {
                const active = pathname === link.href || (link.href !== '/profile' && pathname.startsWith(link.href + '/'))
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl mb-0.5 transition-colors text-sm font-medium"
                    style={{
                      color: active ? '#C6F23E' : '#8a8575',
                      backgroundColor: active ? 'rgba(198,242,62,0.08)' : 'transparent',
                      WebkitTapHighlightColor: 'transparent',
                    }}
                  >
                    <span style={{ color: active ? '#C6F23E' : '#5C584C' }}>{link.icon}</span>
                    {link.label}
                  </Link>
                )
              })}
            </nav>

            {/* Sign out */}
            <div className="p-3 border-t border-[#3a3730]" style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 20px)' }}>
              <form action={signOut}>
                <button
                  type="submit"
                  className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-[#5C584C] hover:text-white hover:bg-white/5 transition-colors text-sm font-medium"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" stroke="currentColor">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
