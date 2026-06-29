import Link from 'next/link'

const BRIEF_CARDS = [
  { id: 1, niche: 'Beauty',    budget: '£450', brand: 'Glow Lab',     days: '12 days left', gradient: 'linear-gradient(135deg, #FF5C9D 0%, #7C5CFF 100%)' },
  { id: 2, niche: 'Travel',    budget: '£850', brand: 'Atlas Stay',   days: '8 days left',  gradient: 'linear-gradient(135deg, #4D8BFF 0%, #00C6FF 100%)' },
  { id: 3, niche: 'Food',      budget: '£300', brand: 'Pasta & Co.',  days: '5 days left',  gradient: 'linear-gradient(135deg, #FF8C42 0%, #FF5C9D 100%)' },
  { id: 4, niche: 'Gaming',    budget: '£600', brand: 'GameZone UK',  days: '18 days left', gradient: 'linear-gradient(135deg, #7C5CFF 0%, #4D8BFF 100%)' },
  { id: 5, niche: 'Fashion',   budget: '£750', brand: 'Studio Blanc', days: '10 days left', gradient: 'linear-gradient(135deg, #C6F23E 0%, #4D8BFF 100%)' },
  { id: 6, niche: 'Lifestyle', budget: '£350', brand: 'Calm Ritual',  days: '22 days left', gradient: 'linear-gradient(135deg, #FF5C9D 0%, #FF8C42 100%)' },
]

const REWARD_CARDS = [
  { brand: 'Selfridges',   offer: '15% off in-store',  gradient: 'linear-gradient(150deg, #FF5C9D 0%, #7C5CFF 100%)' },
  { brand: 'ASOS',         offer: '20% off everything', gradient: 'linear-gradient(150deg, #C6F23E 0%, #4D8BFF 100%)' },
  { brand: 'Cineworld',    offer: '2 for 1 tickets',    gradient: 'linear-gradient(150deg, #7C5CFF 0%, #4D8BFF 100%)' },
  { brand: 'Booking.com',  offer: '20% off stays',      gradient: 'linear-gradient(150deg, #FF8C42 0%, #FF5C9D 100%)' },
]

const TICKER_TEXT = 'BEAUTY ✦ FOOD ✦ TRAVEL ✦ FASHION ✦ GAMING ✦ FITNESS ✦ MUSIC ✦ LIFESTYLE ✦ TECH ✦ PARENTING ✦ '

export default function LandingPage() {
  return (
    <div className="bg-[#100F0C] text-white overflow-x-hidden">

      {/* ── NAV ─────────────────────────────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6"
        style={{
          background: '#100F0C',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          paddingTop: 'max(env(safe-area-inset-top), 14px)',
          paddingBottom: 14,
        }}
      >
        <span className="font-display font-black text-xl text-white">
          slide<span style={{ color: '#C6F23E' }}>.</span>
        </span>

        <div className="hidden md:flex items-center gap-8">
          {(['creators', 'brands', 'rewards'] as const).map((label) => (
            <a
              key={label}
              href={`#${label}`}
              className="text-sm text-[#8a8575] hover:text-white transition-colors"
            >
              {label}
            </a>
          ))}
        </div>

        <Link
          href="/sign-up/creator"
          className="text-sm font-bold text-white rounded-full px-5 py-2.5 transition-opacity hover:opacity-85"
          style={{ background: '#FF5C9D' }}
        >
          get started
        </Link>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-28 pb-20 overflow-hidden">
        {/* Ambient glows */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% -10%, rgba(198,242,62,0.09) 0%, transparent 60%)' }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 88% 45%, rgba(255,92,157,0.07) 0%, transparent 50%)' }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 10% 60%, rgba(124,92,255,0.06) 0%, transparent 50%)' }}
        />

        {/* Floating pills — desktop only */}
        <div
          className="absolute hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold select-none"
          style={{
            top: '34%', left: '6%',
            background: 'rgba(198,242,62,0.1)',
            border: '1px solid rgba(198,242,62,0.25)',
            color: '#C6F23E',
          }}
        >
          ★ no agency fees
        </div>

        <div
          className="absolute hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold select-none"
          style={{
            top: '38%', right: '6%',
            background: 'rgba(124,92,255,0.12)',
            border: '1px solid rgba(124,92,255,0.28)',
            color: '#9C7CFF',
          }}
        >
          paid 2x ↗
        </div>

        {/* "NOW OPEN" — center top, visible from sm+ */}
        <div
          className="hidden sm:flex items-center gap-2 rounded-full px-3.5 py-1.5 mb-10 text-xs font-bold uppercase tracking-widest select-none"
          style={{
            background: '#17150F',
            border: '1px solid #3a3730',
            color: '#8a8575',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#C6F23E] animate-pulse flex-shrink-0" />
          NOW OPEN TO CREATORS
        </div>

        {/* Headline */}
        <h1
          className="font-display text-center leading-[0.9] tracking-tight mb-8"
          style={{ fontSize: 'clamp(3rem, 11vw, 8.5rem)' }}
        >
          SLIDE INTO<br />
          THE{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #C6F23E 0%, #FF5C9D 55%, #7C5CFF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            FEED.
          </span>
        </h1>

        <p className="text-[#8a8575] text-base sm:text-lg max-w-lg text-center mb-10 leading-relaxed">
          The creator platform that pays twice. Swipe live brand briefs, get paid every deal, stack retail perks just for being a member.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-sm sm:max-w-none sm:justify-center">
          <Link
            href="/sign-up/creator"
            className="w-full sm:w-auto text-base font-bold rounded-full px-9 py-4 text-center transition-opacity hover:opacity-90"
            style={{ background: '#C6F23E', color: '#100F0C' }}
          >
            I&apos;m a Creator
          </Link>
          <Link
            href="/sign-up/brand"
            className="w-full sm:w-auto text-base font-bold rounded-full px-9 py-4 text-center transition-all hover:bg-white/5"
            style={{ border: '1.5px solid rgba(255,255,255,0.18)', color: 'white' }}
          >
            I&apos;m a Brand
          </Link>
        </div>
      </section>

      {/* ── TICKER ──────────────────────────────────────────────────── */}
      <div style={{ background: '#C6F23E', overflow: 'hidden' }}>
        <div className="animate-ticker py-3.5">
          {[...Array(4)].map((_, i) => (
            <span
              key={i}
              className="font-black text-sm uppercase tracking-widest whitespace-nowrap pr-0"
              style={{ color: '#100F0C' }}
            >
              {TICKER_TEXT}
            </span>
          ))}
        </div>
      </div>

      {/* ── SOCIAL PROOF ────────────────────────────────────────────── */}
      <section className="pt-24 pb-16" style={{ borderTop: '1px solid #1a1a1a' }}>
        <div className="text-center px-6 mb-10">
          <p className="text-[#5C584C] text-xs uppercase tracking-widest font-bold mb-6">who&apos;s already on slide</p>
          <h2
            className="font-display font-black leading-tight"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)' }}
          >
            12,400 creators.{' '}
            <span style={{ color: '#FF5C9D' }}>one feed.</span>
          </h2>
        </div>

        {/* Carousel */}
        <div style={{ overflow: 'hidden' }}>
          <div className="animate-carousel gap-4 px-4">
            {[...BRIEF_CARDS, ...BRIEF_CARDS].map((card, i) => (
              <div
                key={i}
                className="flex-shrink-0 rounded-2xl overflow-hidden"
                style={{ width: 220 }}
              >
                {/* Card image area */}
                <div
                  className="relative flex items-end p-4"
                  style={{ height: 140, background: card.gradient }}
                >
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)' }}
                  />
                  <span
                    className="relative z-10 text-[10px] font-bold uppercase tracking-wider text-white px-2.5 py-1 rounded-full"
                    style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.2)' }}
                  >
                    {card.niche}
                  </span>
                </div>
                {/* Card body */}
                <div className="p-4" style={{ background: '#17150F', border: '1px solid #2a2a2a', borderTop: 'none' }}>
                  <p className="font-black text-2xl" style={{ color: '#C6F23E' }}>{card.budget}</p>
                  <p className="text-white text-sm font-semibold mt-1 truncate">{card.brand}</p>
                  <p className="text-[#5C584C] text-xs mt-0.5">{card.days}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS — CREATORS ─────────────────────────────────── */}
      <section id="creators" className="px-6 py-24" style={{ borderTop: '1px solid #1a1a1a' }}>
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: '#C6F23E' }}>
              for creators.
            </p>
            <h2
              className="font-display font-black leading-tight"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
            >
              from zero to paid<br />in three steps.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                n: '01',
                title: 'build your profile',
                body: 'Link your socials, pick your niches, upload sample content. Get verified in 72 hours. Takes ten minutes.',
              },
              {
                n: '02',
                title: 'swipe live briefs',
                body: 'See paid briefs from real brands in your niche. Slide right on anything that fits. Pass on anything that does not.',
              },
              {
                n: '03',
                title: 'get paid + earn rewards',
                body: 'Submit content, brand approves, payment hits your account. Retail discounts and perks from day one.',
              },
            ].map((step) => (
              <div
                key={step.n}
                className="rounded-2xl p-7 flex flex-col gap-4"
                style={{ background: '#0F0E0B', border: '1px solid #2a2a2a' }}
              >
                <span className="font-black text-xs uppercase tracking-widest" style={{ color: '#3a3730' }}>
                  {step.n}
                </span>
                <h3 className="text-white font-black text-lg leading-tight">{step.title}</h3>
                <p className="text-[#8a8575] text-sm leading-relaxed flex-1">{step.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Link
              href="/sign-up/creator"
              className="inline-flex font-bold rounded-full px-7 py-3.5 text-sm transition-opacity hover:opacity-90"
              style={{ background: '#C6F23E', color: '#100F0C' }}
            >
              join as a creator →
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS — BRANDS ───────────────────────────────────── */}
      <section id="brands" className="px-6 py-24" style={{ borderTop: '1px solid #1a1a1a' }}>
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <p className="text-[#5C584C] text-xs font-black uppercase tracking-widest mb-3">
              for brands.
            </p>
            <h2
              className="font-display font-black leading-tight"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
            >
              quality UGC<br />without the agency bill.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                n: '01',
                title: 'post a brief',
                body: 'Set your budget, deadline, and deliverables. Brief goes live to verified creators in minutes — no calls needed.',
              },
              {
                n: '02',
                title: 'browse verified creators',
                body: 'Search by niche, follower range, and engagement. Every creator on Slide is reviewed before going live.',
              },
              {
                n: '03',
                title: 'approve and release payment',
                body: 'Payment sits in escrow until you approve the content. No disputes, no chasing invoices, no surprises.',
              },
            ].map((step) => (
              <div
                key={step.n}
                className="rounded-2xl p-7 flex flex-col gap-4"
                style={{ background: '#0F0E0B', border: '1px solid #2a2a2a' }}
              >
                <span className="font-black text-xs uppercase tracking-widest" style={{ color: '#3a3730' }}>
                  {step.n}
                </span>
                <h3 className="text-white font-black text-lg leading-tight">{step.title}</h3>
                <p className="text-[#8a8575] text-sm leading-relaxed flex-1">{step.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Link
              href="/sign-up/brand"
              className="inline-flex font-bold rounded-full px-7 py-3.5 text-sm transition-all hover:bg-white/5"
              style={{ border: '1.5px solid rgba(255,255,255,0.18)', color: 'white' }}
            >
              post a brief →
            </Link>
          </div>
        </div>
      </section>

      {/* ── THE MECHANIC ────────────────────────────────────────────── */}
      <section className="px-6 py-24 text-center" style={{ borderTop: '1px solid #1a1a1a' }}>
        <div className="max-w-2xl mx-auto">
          <p className="text-[#5C584C] text-xs font-black uppercase tracking-widest mb-6">the mechanic</p>
          <h2
            className="font-display font-black leading-tight mb-6"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)' }}
          >
            swipe. it&apos;s<br />that simple.
          </h2>
          <p className="text-[#8a8575] text-base sm:text-lg max-w-md mx-auto mb-14 leading-relaxed">
            Creators see a live brief card. Swipe right to Slide in, swipe left to Pass. No emails, no forms, no middlemen.
          </p>

          {/* Decorative action buttons */}
          <div className="flex items-center justify-center gap-6 mb-14">
            <div className="flex flex-col items-center gap-3">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black select-none"
                style={{ border: '2px solid #FF5C9D', color: '#FF5C9D', background: 'rgba(255,92,157,0.06)' }}
              >
                ←
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#FF5C9D' }}>Pass</span>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-black select-none"
                style={{ background: '#C6F23E', color: '#100F0C', boxShadow: '0 0 48px rgba(198,242,62,0.28)' }}
              >
                →
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#C6F23E' }}>Slide</span>
            </div>
          </div>

          {/* Mock brief card */}
          <div
            className="max-w-xs mx-auto rounded-2xl overflow-hidden text-left"
            style={{ border: '1px solid #2a2a2a' }}
          >
            <div
              className="relative flex items-end p-5"
              style={{
                height: 160,
                background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.25) 55%, transparent 100%), linear-gradient(135deg, #1a0a2e 0%, #0f1a3e 50%, #0a2a1e 100%)',
              }}
            >
              <span
                className="text-[10px] font-bold uppercase tracking-wider text-white px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.15)' }}
              >
                Lifestyle
              </span>
            </div>
            <div className="p-5" style={{ background: '#0F0E0B' }}>
              <p className="font-black text-3xl leading-none" style={{ color: '#C6F23E' }}>£850</p>
              <p className="text-white font-bold text-sm mt-2">Summer campaign — 3 reels</p>
              <p className="text-[#5C584C] text-xs mt-1">Prestige London · 14 days left</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── REWARDS ─────────────────────────────────────────────────── */}
      <section id="rewards" className="px-6 py-24" style={{ borderTop: '1px solid #1a1a1a' }}>
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: '#C6F23E' }}>
              rewards wallet
            </p>
            <h2
              className="font-display font-black leading-tight"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
            >
              membership that pays<br />between briefs.
            </h2>
            <p className="text-[#8a8575] text-base mt-4 max-w-lg leading-relaxed">
              Every Slide creator gets access to an exclusive rewards wallet. Retail discounts and brand perks unlocked the moment you join, upgraded as you level up.
            </p>
          </div>

          {/* Reward cards row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {REWARD_CARDS.map((r) => (
              <div
                key={r.brand}
                className="relative rounded-2xl overflow-hidden"
                style={{ background: r.gradient, minHeight: 120 }}
              >
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)' }}
                />
                <div className="relative z-10 p-5 flex flex-col justify-between h-full" style={{ minHeight: 120 }}>
                  <span
                    className="self-start text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(0,0,0,0.35)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}
                  >
                    Exclusive
                  </span>
                  <div className="mt-4">
                    <p className="text-white font-black text-base leading-tight">{r.offer}</p>
                    <p className="text-white/60 text-xs mt-1">{r.brand}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tier ladder */}
          <div className="flex flex-wrap gap-2 mt-8">
            {[
              { label: 'Rising',     colour: '#8a8575' },
              { label: 'Verified',   colour: '#C6F23E' },
              { label: 'Elite',      colour: '#f59e0b' },
              { label: 'Ambassador', colour: '#a855f7' },
            ].map(({ label, colour }) => (
              <span
                key={label}
                className="text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full"
                style={{ color: colour, background: `${colour}18`, border: `1px solid ${colour}33` }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── DUAL CTA ────────────────────────────────────────────────── */}
      <section className="px-6 py-24" style={{ borderTop: '1px solid #1a1a1a' }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-[#5C584C] text-xs font-black uppercase tracking-widest text-center mb-3">ready when you are</p>
          <h2
            className="font-display font-black text-center mb-12"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            two sides. one platform.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Creator */}
            <div
              className="rounded-2xl p-8 flex flex-col"
              style={{ background: '#0F0E0B', border: '1px solid rgba(198,242,62,0.15)' }}
            >
              <span className="text-xs font-black uppercase tracking-widest mb-5" style={{ color: '#C6F23E' }}>
                creators
              </span>
              <h3 className="font-display text-3xl font-black mb-3">start earning →</h3>
              <p className="text-[#8a8575] text-sm leading-relaxed flex-1 mb-8">
                Join free, get verified, and start swiping briefs from real brands. Payment in escrow, rewards from day one.
              </p>
              <Link
                href="/sign-up/creator"
                className="text-center font-bold rounded-full px-6 py-4 text-sm transition-opacity hover:opacity-90"
                style={{ background: '#C6F23E', color: '#100F0C' }}
              >
                Join as a creator
              </Link>
            </div>

            {/* Brand */}
            <div
              className="rounded-2xl p-8 flex flex-col"
              style={{ background: '#0F0E0B', border: '1px solid #2a2a2a' }}
            >
              <span className="text-[#5C584C] text-xs font-black uppercase tracking-widest mb-5">
                brands and agencies
              </span>
              <h3 className="font-display text-3xl font-black mb-3">find creators →</h3>
              <p className="text-[#8a8575] text-sm leading-relaxed flex-1 mb-8">
                Post a brief in minutes. Browse verified creators by niche, audience, and tier. Escrow payments mean zero risk.
              </p>
              <Link
                href="/sign-up/brand"
                className="text-center font-bold rounded-full px-6 py-4 text-sm transition-all hover:bg-white/5"
                style={{ border: '1.5px solid rgba(255,255,255,0.18)', color: 'white' }}
              >
                Post a brief
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────── */}
      <footer className="px-6 py-10" style={{ borderTop: '1px solid #1a1a1a' }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-display font-black text-xl text-white">
            slide<span style={{ color: '#C6F23E' }}>.</span>
          </span>
          <p className="text-[#5C584C] text-sm">A Make Agency product</p>
          <p className="text-[#5C584C] text-sm">
            &copy; {new Date().getFullYear()} Slide. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  )
}
