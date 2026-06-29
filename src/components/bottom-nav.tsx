'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  {
    href: '/swipe',
    label: 'Swipe',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M12 4.5C10 6.5 7 9 7 12.5a5 5 0 0 0 10 0c0-3.5-3-6-5-8z"
          stroke={active ? '#C6F23E' : '#5C584C'}
          fill={active ? '#C6F23E' : 'none'}
          fillOpacity={active ? 0.18 : 0}
        />
        <path d="M9 14.5l3 3 3-3" stroke={active ? '#C6F23E' : '#5C584C'} />
      </svg>
    ),
  },
  {
    href: '/briefs',
    label: 'Briefs',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <rect
          x="4" y="4" width="16" height="16" rx="3"
          stroke={active ? '#C6F23E' : '#5C584C'}
          fill={active ? '#C6F23E' : 'none'}
          fillOpacity={active ? 0.14 : 0}
        />
        <path d="M8 9h8M8 13h5" stroke={active ? '#C6F23E' : '#5C584C'} />
      </svg>
    ),
  },
  {
    href: '/rewards',
    label: 'Rewards',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M12 3l2.2 6.7H21l-5.6 4.1 2.1 6.7L12 16.5l-5.5 4 2.1-6.7L3 9.7h6.8z"
          stroke={active ? '#C6F23E' : '#5C584C'}
          fill={active ? '#C6F23E' : 'none'}
          fillOpacity={active ? 0.18 : 0}
        />
      </svg>
    ),
  },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <div
      className="fixed z-40"
      style={{
        bottom: 'max(calc(env(safe-area-inset-bottom) + 12px), 16px)',
        left: '50%',
        transform: 'translateX(-50%)',
      }}
    >
      {/* Neon green bloom behind the pill */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 380,
          height: 140,
          background: 'radial-gradient(ellipse at center, rgba(198,242,62,0.32) 0%, rgba(198,242,62,0.12) 45%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Pill */}
      <nav
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(16,15,12,0.88)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: 9999,
          border: '1px solid rgba(255,255,255,0.08)',
          padding: '5px 5px',
        }}
      >
        {TABS.map((tab) => {
          const active = pathname === tab.href || pathname.startsWith(tab.href + '/')
          return (
            <Link
              key={tab.href}
              href={tab.href}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 80,
                padding: '9px 20px 7px',
                borderRadius: 9999,
                background: active ? 'rgba(198,242,62,0.09)' : 'transparent',
                WebkitTapHighlightColor: 'transparent',
                gap: 2,
              }}
              className="tap-scale"
            >
              <span
                style={
                  active
                    ? { filter: 'drop-shadow(0 0 7px rgba(198,242,62,0.6))' }
                    : undefined
                }
              >
                {tab.icon(active)}
              </span>
              {/* Label: visible on active, invisible (space reserved) on inactive */}
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: active ? '#C6F23E' : '#5C584C',
                  lineHeight: '12px',
                  height: 12,
                  display: 'block',
                  userSelect: 'none',
                }}
              >
                {tab.label}
              </span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
