import type { Config } from 'tailwindcss'

/**
 * The admin borrows the site's two brand colours so the two apps read as one
 * product, but leans on a cooler neutral ramp — an editing surface wants more
 * contrast steps than a reading surface does.
 */
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      colors: {
        ink: '#141009',
        body: '#57503F',
        muted: '#8C8474',
        paper: '#FFFFFF',
        mist: '#F8F6F1',
        rule: '#E8E2D6',
        gold: { 50: '#FBF8F0', 100: '#F4ECD9', 300: '#D9BF89', 500: '#A9791F', 600: '#8A5F1E', 700: '#6E4A17' },
        bark: { 100: '#EDE4D8', 400: '#9A7350', 500: '#7A5636', 600: '#5F4327', 700: '#4A3320' },
        night: { 700: '#241C12', 800: '#19130C', 900: '#100C07' },
      },
      letterSpacing: { label: '0.16em' },
      boxShadow: {
        soft: '0 1px 2px rgba(20,16,9,.04), 0 3px 10px rgba(20,16,9,.05)',
        card: '0 2px 6px rgba(20,16,9,.05), 0 14px 34px rgba(20,16,9,.07)',
        float: '0 20px 50px rgba(20,16,9,.14), 0 4px 12px rgba(20,16,9,.06)',
      },
    },
  },
  plugins: [],
}

export default config
