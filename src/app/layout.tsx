import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Slide',
  description: 'The UGC creator platform. Brands meet creators.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased text-white font-sans">
        {/* Textured background: radial gradient vignette + SVG grain overlay */}
        <div className="fixed inset-0 -z-10 pointer-events-none" aria-hidden="true">
          {/* Radial gradient — lighter centre, darker edges */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at 50% 25%, #1a1a1a 0%, #0e0e0e 100%)',
            }}
          />
          {/* SVG fractal noise grain at ~4% opacity */}
          <svg
            className="absolute inset-0 w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <filter id="slide-grain">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.68"
                numOctaves="4"
                stitchTiles="stitch"
              />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#slide-grain)" opacity="0.038" />
          </svg>
        </div>
        {children}
      </body>
    </html>
  )
}
