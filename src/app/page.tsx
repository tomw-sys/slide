import Link from 'next/link'

export default function LandingPage() {
  return (
    <main
      style={{
        width: '100%',
        maxWidth: '1320px',
        margin: '0 auto',
        background: '#100F0C',
        overflow: 'hidden',
        fontFamily: 'var(--font-space-grotesk), "Space Grotesk", sans-serif',
        color: '#FBF8F1',
      }}
    >
      {/* ── Nav ── */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 40px' }}>
        <div style={{ fontFamily: 'var(--font-unbounded), Unbounded, sans-serif', fontWeight: 800, fontSize: '24px' }}>
          slide<span style={{ color: '#C6F23E' }}>.</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '22px', fontWeight: 600, fontSize: '14px', color: '#BDB8A8' }}>
          <Link href="/swipe" style={{ color: 'inherit', textDecoration: 'none' }}>creators</Link>
          <Link href="/briefs" style={{ color: 'inherit', textDecoration: 'none' }}>brands</Link>
          <Link href="/rewards" style={{ color: 'inherit', textDecoration: 'none' }}>rewards</Link>
          <Link
            href="/sign-up"
            style={{
              padding: '10px 20px',
              borderRadius: '999px',
              background: '#FF5C9D',
              color: '#100F0C',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            get started
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ position: 'relative', padding: '30px 40px 50px', textAlign: 'center' }}>
        {/* Floating badges */}
        <span
          style={{
            position: 'absolute',
            left: '90px',
            top: '30px',
            transform: 'rotate(-9deg)',
            fontFamily: 'var(--font-space-mono), "Space Mono", monospace',
            fontWeight: 700,
            fontSize: '12px',
            background: '#C6F23E',
            color: '#100F0C',
            padding: '8px 14px',
            borderRadius: '10px',
          }}
        >
          ★ no agency fees
        </span>
        <span
          style={{
            position: 'absolute',
            right: '80px',
            top: '60px',
            transform: 'rotate(7deg)',
            fontFamily: 'var(--font-space-mono), "Space Mono", monospace',
            fontWeight: 700,
            fontSize: '12px',
            background: '#7C5CFF',
            color: '#fff',
            padding: '8px 14px',
            borderRadius: '10px',
          }}
        >
          paid 2x ⚡
        </span>

        {/* Status pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#1C1A13',
            border: '1px solid #2B281E',
            borderRadius: '999px',
            padding: '8px 16px',
            fontFamily: 'var(--font-space-mono), "Space Mono", monospace',
            fontSize: '12px',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: '#C6F23E',
          }}
        >
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#C6F23E', display: 'inline-block' }} />
          now open to creators
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: 'var(--font-unbounded), Unbounded, sans-serif',
            fontWeight: 900,
            fontSize: '96px',
            lineHeight: 0.94,
            letterSpacing: '-0.03em',
            margin: '22px 0 0',
          }}
        >
          SLIDE
          <br />
          INTO THE
          <br />
          <span
            style={{
              background: 'linear-gradient(101deg, #C6F23E, #FF5C9D, #7C5CFF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            FEED.
          </span>
        </h1>

        <p style={{ fontSize: '19px', lineHeight: 1.5, color: '#BDB8A8', maxWidth: '520px', margin: '24px auto 0' }}>
          The creator platform that pays twice. Swipe live brand briefs, get paid every deal, stack retail perks just for being a member.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '28px' }}>
          <Link
            href="/sign-up/creator"
            style={{
              padding: '16px 30px',
              borderRadius: '999px',
              background: '#C6F23E',
              color: '#100F0C',
              fontWeight: 700,
              fontSize: '17px',
              textDecoration: 'none',
            }}
          >
            I&apos;m a Creator
          </Link>
          <Link
            href="/sign-up/brand"
            style={{
              padding: '16px 30px',
              borderRadius: '999px',
              background: 'transparent',
              border: '1.5px solid #3A362A',
              color: '#fff',
              fontWeight: 700,
              fontSize: '17px',
              textDecoration: 'none',
            }}
          >
            I&apos;m a Brand
          </Link>
        </div>
      </section>

      {/* ── Marquee ── */}
      <div
        style={{
          background: '#C6F23E',
          color: '#100F0C',
          padding: '14px 0',
          overflow: 'hidden',
          maskImage: 'linear-gradient(90deg, transparent, rgb(0,0,0) 4%, rgb(0,0,0) 96%, transparent)',
          WebkitMaskImage: 'linear-gradient(90deg, transparent, rgb(0,0,0) 4%, rgb(0,0,0) 96%, transparent)',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 0,
            width: 'max-content',
            animation: 'sl-marq 18s linear infinite',
          }}
        >
          {[0, 1].map((i) => (
            <div
              key={i}
              aria-hidden={i === 1 ? true : undefined}
              style={{
                display: 'flex',
                gap: '28px',
                fontFamily: 'var(--font-unbounded), Unbounded, sans-serif',
                fontWeight: 700,
                fontSize: '18px',
                paddingRight: '28px',
                whiteSpace: 'nowrap',
              }}
            >
              {['BEAUTY ✦', 'FOOD ✦', 'TRAVEL ✦', 'FASHION ✦', 'GAMING ✦', 'FITNESS ✦', 'MUSIC ✦'].map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── Creator grid ── */}
      <section style={{ padding: '54px 40px 20px' }}>
        <h2 style={{ fontFamily: 'var(--font-unbounded), Unbounded, sans-serif', fontWeight: 800, fontSize: '36px', letterSpacing: '-0.02em', margin: '0 0 24px' }}>
          12,400 creators.{' '}
          <span style={{ color: '#FF5C9D' }}>one feed.</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
          {[
            { handle: '@maya.studio', name: 'Maya R.',  niche: 'Lifestyle', rate: '£850',  gradient: 'linear-gradient(150deg, #FF5C9D, #7C5CFF)' },
            { handle: '@deji.eats',   name: 'Deji O.',  niche: 'Food',      rate: '£1.2k', gradient: 'linear-gradient(150deg, #4D8BFF, #C6F23E)' },
            { handle: '@priya.k',     name: 'Priya K.', niche: 'Beauty',    rate: '£980',  gradient: 'linear-gradient(150deg, #C6F23E, #FF5C9D)' },
            { handle: '@theo.fit',    name: 'Theo M.',  niche: 'Fitness',   rate: '£720',  gradient: 'linear-gradient(150deg, #7C5CFF, #4D8BFF)' },
          ].map((c) => (
            <div key={c.handle} className="sl-card-hover" style={{ background: '#1A1812', borderRadius: '20px', padding: '10px' }}>
              <div
                className="sl-ph"
                data-tag={c.handle}
                style={{ height: '170px', borderRadius: '13px', background: c.gradient }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 4px 4px' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>{c.name}</div>
                  <div style={{ fontSize: '11px', color: '#8E897A' }}>{c.niche}</div>
                </div>
                <div style={{ fontFamily: 'var(--font-space-mono), "Space Mono", monospace', fontWeight: 700, fontSize: '13px', background: '#243300', color: '#C6F23E', padding: '4px 8px', borderRadius: '8px' }}>
                  {c.rate}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Problem ── */}
      <section style={{ background: '#FF5C9D', color: '#100F0C', padding: '56px 40px', marginTop: '34px' }}>
        <div style={{ fontFamily: 'var(--font-space-mono), "Space Mono", monospace', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          the old way is broken
        </div>
        <h2 style={{ fontFamily: 'var(--font-unbounded), Unbounded, sans-serif', fontWeight: 900, fontSize: '56px', letterSpacing: '-0.02em', margin: '10px 0 30px' }}>
          UGC in 2026 is a MESS.
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {[
            { n: '01', title: 'Slow & fragmented',   body: 'Briefs buried in DMs. Weeks of back-and-forth before a deal is agreed.', rotate: '-1.5deg' },
            { n: '02', title: 'Quality is a gamble', body: 'Brands punt on unverified creators. Creators chase invoices that never arrive.', rotate: '1deg' },
            { n: '03', title: 'No reason to stay',   body: 'One job, then silence. No loyalty, no perks, no platform between briefs.', rotate: '-1deg' },
          ].map((p) => (
            <div key={p.n} style={{ background: '#100F0C', color: '#fff', borderRadius: '20px', padding: '26px', transform: `rotate(${p.rotate})` }}>
              <div style={{ fontFamily: 'var(--font-space-mono), "Space Mono", monospace', fontWeight: 700, color: '#C6F23E', fontSize: '14px' }}>{p.n}</div>
              <div style={{ fontFamily: 'var(--font-unbounded), Unbounded, sans-serif', fontWeight: 700, fontSize: '19px', margin: '12px 0 8px' }}>{p.title}</div>
              <div style={{ fontSize: '15px', lineHeight: 1.55, color: '#A9A491' }}>{p.body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Swipe mechanic ── */}
      <section style={{ padding: '60px 40px', textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-space-mono), "Space Mono", monospace', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7C5CFF' }}>
          the mechanic
        </div>
        <h2 style={{ fontFamily: 'var(--font-unbounded), Unbounded, sans-serif', fontWeight: 900, fontSize: '64px', letterSpacing: '-0.02em', margin: '10px 0 12px' }}>
          SWIPE.<br />that&apos;s it.
        </h2>
        <p style={{ fontSize: '18px', lineHeight: 1.5, color: '#BDB8A8', maxWidth: '520px', margin: '0 auto 36px' }}>
          See a live brief card. Swipe right to Slide in, left to Pass. No emails, no forms, no middlemen.
        </p>

        <div style={{ position: 'relative', height: '420px' }}>
          {/* Back card */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '30px',
              transform: 'translateX(-50%) rotate(8deg)',
              width: '300px',
              background: '#1A1812',
              borderRadius: '24px',
              padding: '14px',
            }}
          >
            <div className="sl-ph" data-tag="@brand" style={{ height: '200px', borderRadius: '16px', background: 'linear-gradient(150deg, #7C5CFF, #4D8BFF)' }} />
          </div>

          {/* Front card */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '14px',
              transform: 'translateX(-50%) rotate(-5deg)',
              width: '320px',
              background: '#1A1812',
              borderRadius: '24px',
              padding: '14px',
              boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
            }}
          >
            <div className="sl-ph" data-tag="LIFESTYLE" style={{ height: '220px', borderRadius: '16px', background: 'linear-gradient(150deg, #FF5C9D, #7C5CFF)' }} />
            <div style={{ padding: '14px 6px 4px', textAlign: 'left' }}>
              <div style={{ fontFamily: 'var(--font-unbounded), Unbounded, sans-serif', fontWeight: 700, fontSize: '18px' }}>Skincare GRWM</div>
              <div style={{ fontSize: '13px', color: '#8E897A', marginTop: '4px' }}>The Ordinary · 1 TikTok + 2 Stories</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px' }}>
                <div style={{ fontFamily: 'var(--font-space-mono), "Space Mono", monospace', fontWeight: 700, fontSize: '30px', color: '#C6F23E' }}>£850</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ width: '44px', height: '44px', borderRadius: '50%', border: '2px solid #FF5C9D', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF5C9D', fontSize: '18px' }}>←</span>
                  <span style={{ width: '54px', height: '54px', borderRadius: '50%', background: '#C6F23E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', boxShadow: '0 0 0 6px rgba(198,242,62,0.18)' }}>→</span>
                </div>
              </div>
            </div>
          </div>

          {/* Labels */}
          <span style={{ position: 'absolute', left: 'calc(50% - 220px)', top: '120px', transform: 'rotate(-12deg)', fontFamily: 'var(--font-space-mono), "Space Mono", monospace', fontWeight: 700, fontSize: '13px', color: '#FF5C9D', border: '2px solid #FF5C9D', padding: '6px 12px', borderRadius: '8px' }}>
            PASS
          </span>
          <span style={{ position: 'absolute', left: 'calc(50% + 150px)', top: '90px', transform: 'rotate(11deg)', fontFamily: 'var(--font-space-mono), "Space Mono", monospace', fontWeight: 700, fontSize: '13px', color: '#100F0C', background: '#C6F23E', padding: '6px 12px', borderRadius: '8px' }}>
            SLIDE ✓
          </span>
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ background: '#C6F23E', color: '#100F0C', padding: '56px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '46px' }}>
          {/* Creators */}
          <div>
            <div style={{ fontFamily: 'var(--font-space-mono), "Space Mono", monospace', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>for creators</div>
            <h2 style={{ fontFamily: 'var(--font-unbounded), Unbounded, sans-serif', fontWeight: 800, fontSize: '34px', letterSpacing: '-0.02em', margin: '8px 0 22px', lineHeight: 1 }}>
              zero → paid<br />in 3 steps
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { n: '1', title: 'Build your profile', body: 'Link socials, pick niches, get verified in ten minutes.' },
                { n: '2', title: 'Swipe live briefs',  body: 'Paid briefs from real brands in your niche. Slide right on the fits.' },
                { n: '3', title: 'Get paid + rewards', body: 'Brand approves, payment lands, retail perks stack up.' },
              ].map((s) => (
                <div key={s.n} style={{ display: 'flex', gap: '14px' }}>
                  <span style={{ fontFamily: 'var(--font-unbounded), Unbounded, sans-serif', fontWeight: 800, fontSize: '22px' }}>{s.n}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '16px' }}>{s.title}</div>
                    <div style={{ fontSize: '14px', color: '#2C3A00' }}>{s.body}</div>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/sign-up/creator"
              style={{ display: 'inline-block', marginTop: '22px', padding: '13px 24px', borderRadius: '999px', background: '#100F0C', color: '#C6F23E', fontWeight: 700, textDecoration: 'none' }}
            >
              Join as a creator →
            </Link>
          </div>

          {/* Brands */}
          <div>
            <div style={{ fontFamily: 'var(--font-space-mono), "Space Mono", monospace', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>for brands</div>
            <h2 style={{ fontFamily: 'var(--font-unbounded), Unbounded, sans-serif', fontWeight: 800, fontSize: '34px', letterSpacing: '-0.02em', margin: '8px 0 22px', lineHeight: 1 }}>
              quality UGC,<br />no agency bill
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { n: '1', title: 'Post a brief',            body: 'Set budget, deadline, deliverables — live in minutes.' },
                { n: '2', title: 'Browse verified creators', body: 'Filter by niche, reach and engagement. All reviewed.' },
                { n: '3', title: 'Approve + release',        body: 'Escrow holds payment until you approve. No surprises.' },
              ].map((s) => (
                <div key={s.n} style={{ display: 'flex', gap: '14px' }}>
                  <span style={{ fontFamily: 'var(--font-unbounded), Unbounded, sans-serif', fontWeight: 800, fontSize: '22px' }}>{s.n}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '16px' }}>{s.title}</div>
                    <div style={{ fontSize: '14px', color: '#2C3A00' }}>{s.body}</div>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/sign-up/brand"
              style={{ display: 'inline-block', marginTop: '22px', padding: '13px 24px', borderRadius: '999px', background: '#100F0C', color: '#fff', fontWeight: 700, textDecoration: 'none' }}
            >
              Post a brief →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Rewards wallet ── */}
      <section style={{ padding: '60px 40px' }}>
        <div style={{ fontFamily: 'var(--font-space-mono), "Space Mono", monospace', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#FF5C9D' }}>
          rewards wallet
        </div>
        <h2 style={{ fontFamily: 'var(--font-unbounded), Unbounded, sans-serif', fontWeight: 800, fontSize: '44px', letterSpacing: '-0.02em', margin: '8px 0' }}>
          pays between briefs.
        </h2>
        <p style={{ fontSize: '16px', lineHeight: 1.5, color: '#BDB8A8', maxWidth: '560px', margin: '0 0 28px' }}>
          Every Slide creator unlocks a rewards wallet — retail discounts, dining offers and brand perks, upgraded as you level up.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
          {[
            { title: '20% off everything', brand: 'ASOS',        color: '#FF7AB0', rotate: '-1.5deg' },
            { title: '2 for 1 tickets',    brand: 'Cineworld',   color: '#6FA8FF', rotate: '1deg' },
            { title: '20% off stays',      brand: 'Booking.com', color: '#C6F23E', rotate: '-1deg' },
            { title: '15% off in-store',   brand: 'Selfridges',  color: '#A98BFF', rotate: '1.5deg' },
          ].map((r) => (
            <div key={r.brand} style={{ background: '#1A1812', border: '1px solid #2B281E', borderRadius: '18px', padding: '20px', transform: `rotate(${r.rotate})` }}>
              <span style={{ fontFamily: 'var(--font-space-mono), "Space Mono", monospace', fontSize: '10px', background: '#243300', color: '#C6F23E', padding: '3px 8px', borderRadius: '6px' }}>EXCLUSIVE</span>
              <div style={{ fontFamily: 'var(--font-unbounded), Unbounded, sans-serif', fontWeight: 700, fontSize: '19px', color: r.color, margin: '14px 0 4px' }}>{r.title}</div>
              <div style={{ fontSize: '12px', color: '#8E897A' }}>{r.brand}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '20px' }}>
          <span style={{ padding: '8px 16px', borderRadius: '999px', background: '#1C1A13', border: '1px solid #2B281E', fontWeight: 600, fontSize: '13px', color: '#BDB8A8' }}>Rising</span>
          <span style={{ padding: '8px 16px', borderRadius: '999px', background: '#243300', color: '#C6F23E', fontWeight: 700, fontSize: '13px' }}>Verified</span>
          <span style={{ padding: '8px 16px', borderRadius: '999px', background: '#3A0F24', color: '#FF7AB0', fontWeight: 700, fontSize: '13px' }}>Elite</span>
          <span style={{ padding: '8px 16px', borderRadius: '999px', background: '#241A45', color: '#A98BFF', fontWeight: 700, fontSize: '13px' }}>Ambassador</span>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: '#7C5CFF', padding: '64px 40px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-unbounded), Unbounded, sans-serif', fontWeight: 900, fontSize: '64px', letterSpacing: '-0.03em', color: '#fff', margin: '0 0 24px' }}>
          ready to slide?
        </h2>
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
          <Link
            href="/sign-up/creator"
            style={{ padding: '16px 32px', borderRadius: '999px', background: '#C6F23E', color: '#100F0C', fontWeight: 700, fontSize: '17px', textDecoration: 'none' }}
          >
            Join as a creator
          </Link>
          <Link
            href="/sign-up/brand"
            style={{ padding: '16px 32px', borderRadius: '999px', background: '#100F0C', color: '#fff', fontWeight: 700, fontSize: '17px', textDecoration: 'none' }}
          >
            Post a brief
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '28px 40px' }}>
        <div style={{ fontFamily: 'var(--font-unbounded), Unbounded, sans-serif', fontWeight: 800, fontSize: '20px' }}>
          slide<span style={{ color: '#C6F23E' }}>.</span>
        </div>
        <div style={{ fontSize: '13px', color: '#6B6657', fontFamily: 'var(--font-space-mono), "Space Mono", monospace' }}>A Make Agency product</div>
        <div style={{ fontSize: '13px', color: '#6B6657', fontFamily: 'var(--font-space-mono), "Space Mono", monospace' }}>© 2026 Slide</div>
      </footer>

      {/* ── Keyframes + shared styles ── */}
      <style>{`
        @keyframes sl-marq {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        .sl-card-hover {
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }
        .sl-card-hover:hover {
          transform: translateY(-4px);
        }

        .sl-ph {
          position: relative;
          overflow: hidden;
        }
        .sl-ph::after {
          content: attr(data-tag);
          position: absolute;
          left: 10px;
          bottom: 9px;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.02em;
          color: rgba(255,255,255,0.92);
          background: rgba(0,0,0,0.28);
          padding: 3px 7px;
          border-radius: 7px;
          backdrop-filter: blur(4px);
        }

        @media (max-width: 768px) {
          h1 { font-size: 56px !important; }
          h2 { font-size: 32px !important; }
          .sl-grid-4 { grid-template-columns: repeat(2, 1fr) !important; }
          .sl-grid-3 { grid-template-columns: 1fr !important; }
          .sl-grid-2 { grid-template-columns: 1fr !important; }
          nav { padding: 16px 20px !important; }
          section { padding-left: 20px !important; padding-right: 20px !important; }
        }

        @media (prefers-reduced-motion: reduce) {
          .sl-marq { animation: none !important; }
          .sl-card-hover { transition: none !important; }
        }
      `}</style>
    </main>
  )
}
