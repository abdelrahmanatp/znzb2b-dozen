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
        linen: {
          DEFAULT: '#F5F0E8',
          light: '#FAF8F5',
          dark: '#E8DFD0',
        },
        sand: '#E8DFD0',
        terracotta: {
          DEFAULT: '#C4622D',
          deep: '#A34E22',
          light: '#F0D5C5',
        },
        gold: {
          DEFAULT: '#B8860B',
          warm: '#D4A017',
          light: '#F5E9C4',
        },
        onyx: '#1A1714',
        espresso: '#2D2520',
        bark: '#5C4A3A',
        driftwood: '#8C7B6B',
        mist: '#C4B8AB',
        cloud: '#EDE8E1',
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
        heading: ['var(--font-cormorant)', 'Georgia', 'serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        display: ['4.5rem', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
      },
      maxWidth: {
        site: '1280px',
        'prose-lg': '72ch',
        narrow: '680px',
      },
      spacing: {
        'section-y': '6rem',
        'section-y-sm': '4rem',
      },
      borderRadius: {
        DEFAULT: '0px',
        sm: '2px',
        md: '4px',
        full: '9999px',
      },
      boxShadow: {
        card: '0 2px 8px rgba(26, 23, 20, 0.06)',
        'card-hover': '0 8px 24px rgba(26, 23, 20, 0.10)',
        nav: '0 1px 0 rgba(26, 23, 20, 0.08)',
        dropdown: '0 4px 16px rgba(26, 23, 20, 0.12)',
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
        'linen-texture':
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
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
