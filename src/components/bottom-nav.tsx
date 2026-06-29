'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

function SwipeIcon({ active }: { active: boolean }) {
  const c = active ? '#C6F23E' : '#5C584C'
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      {/* Back card */}
      <rect x="6" y="5" width="14" height="14" rx="2" stroke={c} fill={active ? c : 'none'} fillOpacity={active ? 0.12 : 0} />
      {/* Front card */}
      <rect x="4" y="7" width="14" height="14" rx="2" stroke={c} fill={active ? c : 'none'} fillOpacity={active ? 0.18 : 0} />
    </svg>
  )
}

function BriefsIcon({ active }: { active: boolean }) {
  const c = active ? '#C6F23E' : '#5C584C'
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
        stroke={c}
        fill={active ? c : 'none'}
        fillOpacity={active ? 0.15 : 0}
      />
      <polyline points="14 2 14 8 20 8" stroke={c} />
      <line x1="16" y1="13" x2="8" y2="13" stroke={c} />
      <line x1="16" y1="17" x2="8" y2="17" stroke={c} />
      <line x1="10" y1="9" x2="8" y2="9" stroke={c} />
    </svg>
  )
}

function RewardsIcon({ active }: { active: boolean }) {
  const c = active ? '#C6F23E' : '#5C584C'
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        stroke={c}
        fill={active ? c : 'none'}
        fillOpacity={active ? 0.18 : 0}
      />
    </svg>
  )
}

const TABS = [
  { href: '/swipe',   label: 'Swipe',   Icon: SwipeIcon },
  { href: '/briefs',  label: 'Briefs',  Icon: BriefsIcon },
  { href: '/rewards', label: 'Rewards', Icon: RewardsIcon },
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
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(23, 21, 15, 0.95)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: 9999,
          border: '1px solid rgba(255,255,255,0.08)',
          padding: '5px 5px',
        }}
      >
        {TABS.map(({ href, label, Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
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
                <Icon active={active} />
              </span>
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
                {label}
              </span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
