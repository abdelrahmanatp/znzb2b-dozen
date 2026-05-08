import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Stitch "Modern Editorial Commerce" — Navy / Teal / Neutral
        // Token names preserved for backward-compat; values updated to new brand
        linen: {
          DEFAULT: '#F8F9FA',   // surface
          light: '#FFFFFF',     // surface-container-lowest
          dark: '#F3F4F5',      // surface-container-low
        },
        sand: '#F3F4F5',        // surface-container-low (section alternates)
        terracotta: {
          DEFAULT: '#1D2D6B',   // primary-container (heritage navy)
          deep: '#021656',      // primary (deep navy)
          light: '#DDE1FF',     // primary-fixed (light navy tint)
        },
        gold: {
          DEFAULT: '#006a6a',   // secondary (teal)
          warm: '#2BBDBD',      // brighter teal
          light: '#74F6F6',     // secondary-container
        },
        onyx: '#191c1d',        // on-surface (near-black)
        espresso: '#191c1d',
        bark: '#454650',        // on-surface-variant (body text)
        driftwood: '#767681',   // outline (muted text)
        mist: '#C6C5D1',        // outline-variant (borders)
        cloud: '#EDEEEF',       // surface-container (subtle bg)
        success: {
          DEFAULT: '#2D6A4F',
          light: '#D8F0E6',
        },
        warning: {
          DEFAULT: '#92400E',
          light: '#FEF3C7',
        },
        error: {
          DEFAULT: '#991B1B',
          light: '#FEE2E2',
        },
      },
      fontFamily: {
        heading: ['var(--font-playfair)', 'Georgia', 'serif'],
        body: ['var(--font-manrope)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        display: ['4.5rem', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
      },
      maxWidth: {
        site: '1440px',
        'prose-lg': '72ch',
        narrow: '680px',
      },
      spacing: {
        'section-y': '8rem',
        'section-y-sm': '5rem',
      },
      borderRadius: {
        DEFAULT: '0px',
        sm: '2px',
        md: '4px',
        full: '9999px',
      },
      boxShadow: {
        card: '0 2px 8px rgba(29, 45, 107, 0.06)',
        'card-hover': '0 8px 24px rgba(29, 45, 107, 0.10)',
        nav: '0 1px 0 rgba(29, 45, 107, 0.08)',
        dropdown: '0 4px 16px rgba(29, 45, 107, 0.10)',
        whisper: '0 20px 40px -10px rgba(29, 45, 107, 0.10)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.4s ease-out forwards',
        'fade-in': 'fade-in 0.3s ease-out forwards',
      },
      backgroundImage: {
        'editorial-gradient':
          'linear-gradient(to right, rgba(2, 22, 86, 0.05) 0%, rgba(255,255,255,0) 100%)',
      },
      screens: {
        xs: '375px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
}

export default config
