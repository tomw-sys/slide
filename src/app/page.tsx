import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#151515] text-white font-sans">

      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className="relative flex flex-col min-h-screen px-6 pt-8 pb-20 overflow-hidden">
        {/* Subtle radial glow */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 50% 0%, rgba(30,226,49,0.07) 0%, transparent 65%)',
          }}
        />

        {/* Nav */}
        <nav className="relative z-10 flex items-center justify-between max-w-5xl mx-auto w-full">
          <span className="text-white font-black text-2xl tracking-tight">Slide.</span>
          <div className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="text-[#a3a3a3] text-sm font-medium hover:text-white transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="bg-[#1c1c1c] border border-[#2a2a2a] text-white text-sm font-medium rounded-xl px-4 py-2 hover:border-[#3a3a3a] transition-colors"
            >
              Get started
            </Link>
          </div>
        </nav>

        {/* Hero content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center max-w-4xl mx-auto w-full mt-16 md:mt-0">
          {/* Label */}
          <div className="inline-flex items-center gap-2 bg-[#1ee231]/10 border border-[#1ee231]/20 rounded-full px-4 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1ee231] animate-pulse" />
            <span className="text-[#1ee231] text-xs font-semibold uppercase tracking-widest">
              Now open to creators
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-[1.05] tracking-tight mb-6">
            Slide into
            <br />
            <span className="text-[#1ee231]">the feed.</span>
          </h1>

          <p className="text-[#d4d4d4] text-lg sm:text-xl max-w-xl mb-10 leading-relaxed">
            The creator platform that pays twice. Swipe live brand briefs, get paid for every deal,
            and earn retail rewards just for being a member.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/sign-up/creator"
              className="w-full sm:w-auto bg-[#1ee231] text-[#151515] font-bold text-base rounded-xl px-8 py-4 hover:bg-[#17c029] transition-colors"
            >
              I&apos;m a Creator
            </Link>
            <Link
              href="/sign-up/brand"
              className="w-full sm:w-auto bg-transparent border border-white/25 text-white font-bold text-base rounded-xl px-8 py-4 hover:border-white/50 hover:bg-white/5 transition-all"
            >
              I&apos;m a Brand
            </Link>
          </div>

          <p className="text-[#a3a3a3] text-xs mt-6">
            Free to join. No agency fees.
          </p>
        </div>

        {/* Scroll nudge */}
        <div className="relative z-10 flex justify-center mt-12">
          <div className="flex flex-col items-center gap-2 opacity-40">
            <div className="w-px h-8 bg-white/30" />
            <span className="text-[10px] uppercase tracking-widest text-[#a3a3a3]">Scroll</span>
          </div>
        </div>
      </section>

      {/* ─── PROBLEM STRIP ────────────────────────────────────────── */}
      <section className="px-6 py-20 border-t border-[#2a2a2a]">
        <div className="max-w-5xl mx-auto">
          <p className="text-[#a3a3a3] text-xs uppercase tracking-widest font-semibold text-center mb-3">
            The old way is broken
          </p>
          <h2 className="text-white text-3xl sm:text-4xl font-black text-center mb-12">
            UGC in 2025 is a mess.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                n: '01',
                title: 'Slow and fragmented',
                body: 'Briefs buried in DMs. Weeks of back-and-forth before a deal is agreed.',
              },
              {
                n: '02',
                title: 'Quality is a gamble',
                body: 'Brands take a punt on unverified creators. Creators chase invoices that never arrive.',
              },
              {
                n: '03',
                title: 'No reason to stay',
                body:
                  'One job, then silence. No loyalty, no perks, no platform that works for creators between briefs.',
              },
            ].map((card) => (
              <div
                key={card.n}
                className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-6"
              >
                <span className="text-[#1ee231] text-xs font-black uppercase tracking-widest">
                  {card.n}
                </span>
                <h3 className="text-white font-bold text-lg mt-2 mb-2">{card.title}</h3>
                <p className="text-[#a3a3a3] text-sm leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── THE MECHANIC ─────────────────────────────────────────── */}
      <section className="px-6 py-20 border-t border-[#2a2a2a]">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-[#a3a3a3] text-xs uppercase tracking-widest font-semibold mb-3">
            The mechanic
          </p>
          <h2 className="text-white text-4xl sm:text-5xl font-black mb-4">
            Swipe. It&apos;s that simple.
          </h2>
          <p className="text-[#d4d4d4] text-base sm:text-lg max-w-xl mx-auto mb-12 leading-relaxed">
            Creators see a live brief card. Swipe right to Slide in, swipe left to Pass.
            No emails, no forms, no agency middlemen.
          </p>

          {/* Visual pill buttons — decorative */}
          <div className="flex items-center justify-center gap-6 mb-12">
            <div className="flex flex-col items-center gap-2">
              <div className="w-20 h-20 rounded-full bg-[#1c1c1c] border-2 border-[#ef4444]/40 flex items-center justify-center text-[#ef4444] text-3xl select-none">
                ←
              </div>
              <span className="text-[#a3a3a3] text-[10px] uppercase tracking-widest font-semibold">
                Pass
              </span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div
                className="w-24 h-24 rounded-full bg-[#1ee231] flex items-center justify-center text-[#151515] text-4xl select-none"
                style={{ boxShadow: '0 0 40px rgba(30,226,49,0.25)' }}
              >
                →
              </div>
              <span className="text-[#1ee231] text-[10px] uppercase tracking-widest font-semibold">
                Slide
              </span>
            </div>
          </div>

          {/* Brief card mock */}
          <div className="max-w-xs mx-auto bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl overflow-hidden">
            <div
              className="h-36 flex items-end p-4"
              style={{
                background:
                  'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 60%, rgba(28,28,28,0.8) 100%), linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
              }}
            >
              <div>
                <span className="bg-black/50 text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full border border-white/20">
                  Lifestyle
                </span>
              </div>
            </div>
            <div className="p-4">
              <p className="text-[#1ee231] text-2xl font-black">£850</p>
              <p className="text-white font-bold text-sm mt-1">Summer campaign — 3 reels</p>
              <p className="text-[#a3a3a3] text-xs mt-1">Prestige London · 14 days left</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS — CREATORS ──────────────────────────────── */}
      <section className="px-6 py-20 border-t border-[#2a2a2a]">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <p className="text-[#1ee231] text-xs uppercase tracking-widest font-semibold mb-2">
              For creators
            </p>
            <h2 className="text-white text-3xl sm:text-4xl font-black">
              From zero to paid in three steps.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                n: '1',
                title: 'Build your profile',
                body:
                  'Link your socials, pick your niches, and upload sample content to get verified. Takes ten minutes.',
              },
              {
                n: '2',
                title: 'Swipe live briefs',
                body:
                  'See paid briefs from real brands in your niche. Slide right on anything that fits. Pass on anything that does not.',
              },
              {
                n: '3',
                title: 'Get paid and earn rewards',
                body:
                  'Submit your content, the brand approves it, and payment hits your account. Plus retail discounts just for being a member.',
              },
            ].map((step) => (
              <div key={step.n} className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#1ee231]/10 border border-[#1ee231]/20 flex items-center justify-center">
                  <span className="text-[#1ee231] font-black text-sm">{step.n}</span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-base mb-1.5">{step.title}</h3>
                  <p className="text-[#a3a3a3] text-sm leading-relaxed">{step.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Link
              href="/sign-up/creator"
              className="inline-flex bg-[#1ee231] text-[#151515] font-bold rounded-xl px-6 py-3 text-sm hover:bg-[#17c029] transition-colors"
            >
              Join as a creator
            </Link>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS — BRANDS ────────────────────────────────── */}
      <section className="px-6 py-20 border-t border-[#2a2a2a]">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <p className="text-[#a3a3a3] text-xs uppercase tracking-widest font-semibold mb-2">
              For brands
            </p>
            <h2 className="text-white text-3xl sm:text-4xl font-black">
              Quality UGC without the agency bill.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                n: '1',
                title: 'Post a brief',
                body:
                  'Set your budget, deadline, and content requirements. Your brief goes live to verified creators in minutes.',
              },
              {
                n: '2',
                title: 'Browse verified creators',
                body:
                  'Search by niche, follower range, and engagement rate. Every creator on Slide is reviewed before they go live.',
              },
              {
                n: '3',
                title: 'Approve content and release payment',
                body:
                  'Payment sits in escrow until you approve the deliverables. No disputes, no chasing, no surprises.',
              },
            ].map((step) => (
              <div key={step.n} className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/5 border border-[#2a2a2a] flex items-center justify-center">
                  <span className="text-[#d4d4d4] font-black text-sm">{step.n}</span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-base mb-1.5">{step.title}</h3>
                  <p className="text-[#a3a3a3] text-sm leading-relaxed">{step.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Link
              href="/sign-up/brand"
              className="inline-flex bg-transparent border border-white/25 text-white font-bold rounded-xl px-6 py-3 text-sm hover:border-white/50 hover:bg-white/5 transition-all"
            >
              Post a brief
            </Link>
          </div>
        </div>
      </section>

      {/* ─── REWARDS WALLET ───────────────────────────────────────── */}
      <section className="px-6 py-20 border-t border-[#2a2a2a]">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[#1ee231] text-xs uppercase tracking-widest font-semibold mb-3">
                Rewards wallet
              </p>
              <h2 className="text-white text-3xl sm:text-4xl font-black mb-4">
                Membership that pays between briefs.
              </h2>
              <p className="text-[#a3a3a3] text-base leading-relaxed mb-6">
                Every Slide creator gets access to an exclusive rewards wallet. Retail discounts,
                dining offers, and brand perks — unlocked the moment you join, upgraded as you
                level up.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Rising', 'Verified', 'Elite', 'Ambassador'].map((tier, i) => (
                  <span
                    key={tier}
                    className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full border"
                    style={{
                      color: ['#a3a3a3', '#1ee231', '#f59e0b', '#a855f7'][i],
                      borderColor: ['#a3a3a3', '#1ee231', '#f59e0b', '#a855f7'][i] + '33',
                      backgroundColor: ['#a3a3a3', '#1ee231', '#f59e0b', '#a855f7'][i] + '1a',
                    }}
                  >
                    {tier}
                  </span>
                ))}
              </div>
            </div>

            {/* Sample reward cards */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { brand: 'ASOS', offer: '20% off everything', colour: '#f59e0b' },
                { brand: 'Cineworld', offer: '2 for 1 tickets', colour: '#3b82f6' },
                { brand: 'Booking.com', offer: '20% off stays', colour: '#1ee231' },
                { brand: 'Selfridges', offer: '15% off in-store', colour: '#a855f7' },
              ].map((r) => (
                <div
                  key={r.brand}
                  className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-4 flex flex-col justify-between min-h-[100px]"
                >
                  <span
                    className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full self-start"
                    style={{ color: '#151515', backgroundColor: '#1ee231' }}
                  >
                    Exclusive
                  </span>
                  <div className="mt-3">
                    <p
                      className="text-xl font-black leading-none"
                      style={{ color: r.colour }}
                    >
                      {r.offer}
                    </p>
                    <p className="text-[#a3a3a3] text-xs mt-1">{r.brand}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── DUAL CTA ─────────────────────────────────────────────── */}
      <section className="px-6 py-20 border-t border-[#2a2a2a]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-white text-3xl sm:text-4xl font-black text-center mb-12">
            Ready to get started?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Creator card */}
            <div className="bg-[#1c1c1c] border border-[#1ee231]/20 rounded-xl p-8 flex flex-col">
              <span className="text-[#1ee231] text-xs font-semibold uppercase tracking-widest mb-4">
                Creators
              </span>
              <h3 className="text-white text-2xl font-black mb-2">Start earning.</h3>
              <p className="text-[#a3a3a3] text-sm leading-relaxed flex-1 mb-6">
                Join for free, get verified, and start swiping live briefs from real brands.
                Payment in escrow, rewards from day one.
              </p>
              <Link
                href="/sign-up/creator"
                className="bg-[#1ee231] text-[#151515] font-bold rounded-xl px-6 py-3.5 text-sm text-center hover:bg-[#17c029] transition-colors"
              >
                Join as a creator
              </Link>
            </div>

            {/* Brand card */}
            <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-8 flex flex-col">
              <span className="text-[#a3a3a3] text-xs font-semibold uppercase tracking-widest mb-4">
                Brands and agencies
              </span>
              <h3 className="text-white text-2xl font-black mb-2">Find creators.</h3>
              <p className="text-[#a3a3a3] text-sm leading-relaxed flex-1 mb-6">
                Post a brief in minutes. Browse verified creators by niche, audience, and tier.
                Escrow payments mean no risk, no wasted budget.
              </p>
              <Link
                href="/sign-up/brand"
                className="bg-transparent border border-white/25 text-white font-bold rounded-xl px-6 py-3.5 text-sm text-center hover:border-white/50 hover:bg-white/5 transition-all"
              >
                Post a brief
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────────────────── */}
      <footer className="border-t border-[#2a2a2a] px-6 py-10">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-white font-black text-xl tracking-tight">Slide.</span>
          <p className="text-[#a3a3a3] text-sm">A Make Agency product</p>
          <p className="text-[#a3a3a3] text-sm">
            &copy; {new Date().getFullYear()} Slide. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  )
}
