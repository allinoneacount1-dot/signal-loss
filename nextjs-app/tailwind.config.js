/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    // Hard reset — no rounded defaults, no default palette
    borderRadius: {
      none: '0',
      DEFAULT: '0',
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      // Signal Loss palette (strict)
      amber: {
        DEFAULT: '#FFB000',
        dim: '#B37D00',
      },
      green: {
        DEFAULT: '#33FF00',
        dim: '#1F9900',
      },
      red: {
        DEFAULT: '#FF2200',
        dim: '#991500',
      },
      bone: {
        DEFAULT: '#E0E0E0',
        dim: '#8A8A8A',
      },
      void: {
        DEFAULT: '#050505',
        2: '#0A0A0A',
      },
      grid: {
        DEFAULT: '#1A1A1A',
        2: '#2A2A2A',
      },
      // Allow Tailwind defaults for white/black/gray scale where useful
      white: '#FFFFFF',
      black: '#000000',
    },
    fontFamily: {
      display: ['var(--font-display)', 'Courier New', 'monospace'],
      body: ['var(--font-body)', 'Courier New', 'monospace'],
      data: ['var(--font-data)', 'Courier New', 'monospace'],
      accent: ['var(--font-accent)', 'Courier New', 'monospace'],
      mono: ['var(--font-body)', 'Courier New', 'monospace'],
    },
    extend: {
      fontSize: {
        '7xl': ['clamp(4rem, 10vw, 8rem)', { lineHeight: '0.9' }],
        '5xl': ['clamp(2.5rem, 5vw, 4rem)', { lineHeight: '1' }],
        'mono-tiny': ['0.625rem', { lineHeight: '1' }],
      },
      letterSpacing: {
        widest: '0.25em',
        ultra: '0.4em',
      },
      animation: {
        flicker: 'sl-flicker 0.1s infinite',
        blink: 'sl-blink 1s steps(1) infinite',
        decode: 'sl-decode 0.6s steps(20) forwards',
        scan: 'sl-scan 0.4s linear forwards',
        ticker: 'sl-ticker 0.5s steps(20) forwards',
      },
    },
  },
  plugins: [],
};
