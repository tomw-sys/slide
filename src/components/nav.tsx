import Link from 'next/link'
import { signOut } from '@/app/actions/auth'

interface NavProps {
  displayName: string
  role: 'creator' | 'brand' | 'admin'
  links?: Array<{ label: string; href: string }>
}

export function Nav({ displayName, role, links }: NavProps) {
  const defaultLinks =
    role === 'brand'
      ? [
          { label: 'Briefs', href: '/briefs' },
          { label: 'Creators', href: '/creators' },
          { label: 'Deals', href: '/deals' },
        ]
      : role === 'admin'
      ? [
          { label: 'Creators', href: '/admin/creators' },
          { label: 'Rewards', href: '/admin/rewards' },
        ]
      : [
          { label: 'Swipe', href: '/swipe' },
          { label: 'Deals', href: '/deals' },
          { label: 'Rewards', href: '/rewards' },
        ]

  const navLinks = links ?? defaultLinks

  return (
    <nav className="border-b border-[#2a2a2a] px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link href="/dashboard" className="text-[#1ee231] text-xl font-bold tracking-tight">
          Slide
        </Link>
        <div className="hidden sm:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[#a3a3a3] text-sm hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-[#a3a3a3] text-sm hidden sm:block">{displayName}</span>
        <form action={signOut}>
          <button type="submit" className="text-[#a3a3a3] text-sm hover:text-white transition-colors">
            Sign out
          </button>
        </form>
      </div>
    </nav>
  )
}
