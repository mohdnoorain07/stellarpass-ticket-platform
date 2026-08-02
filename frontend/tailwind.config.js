/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Matter', 'Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['Fabrikatmono', 'JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
        matter: ['Matter', 'Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        fabrikatmono: ['Fabrikatmono', 'JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },
      fontSize: {
        caption: ['14px', { lineHeight: '21px', letterSpacing: '-0.14px' }],
        body: ['16px', { lineHeight: '24px', letterSpacing: '-0.16px' }],
        subheading: ['20px', { lineHeight: '25px', letterSpacing: '-0.2px' }],
        'heading-sm': ['24px', { lineHeight: '28px', letterSpacing: '-0.8px' }],
        heading: ['48px', { lineHeight: '54px', letterSpacing: '-1.92px' }],
        display: ['60px', { lineHeight: '65px', letterSpacing: '-2.58px' }],
      },
      colors: {
        obsidian: {
          ember: '#0f1115',
          DEFAULT: '#0f1115',
        },
        cocoa: {
          dark: '#171a21',
          DEFAULT: '#171a21',
        },
        molten: {
          core: '#1b1f27',
          DEFAULT: '#1b1f27',
        },
        signal: {
          red: '#ff6a3d',
          DEFAULT: '#ff6a3d',
        },
        flare: {
          orange: '#ff6a3d',
          DEFAULT: '#ff6a3d',
        },
        blush: {
          warm: '#ff7e57',
          DEFAULT: '#ff7e57',
        },
        peach: {
          vapor: '#f7f8fa',
          DEFAULT: '#f7f8fa',
        },
        linen: {
          DEFAULT: '#ffffff',
        },
        ash: {
          warm: '#3a3f4b',
          DEFAULT: '#3a3f4b',
        },
        black: {
          pure: '#000000',
          DEFAULT: '#000000',
        },
        mist: {
          DEFAULT: '#7e8794',
        },
        brand: {
          DEFAULT: '#ff6a3d',
          hover: '#ff7e57',
          subtle: '#2a150e',
          light: '#ff7e57',
        },
        surface: {
          DEFAULT: '#f7f8fa',
          secondary: '#eef0f2',
          tertiary: '#e5e7eb',
          elevated: '#ffffff',
          dark: '#0f1115',
          'dark-secondary': '#171a21',
          'dark-tertiary': '#1b1f27',
          'dark-elevated': '#1b1f27',
        },
      },
      backgroundImage: {
        'altius-gradient': 'linear-gradient(180deg, #ff6a3d, #e55a2b)',
        'altius-gradient-hover': 'linear-gradient(180deg, #ff7e57, #ff6a3d)',
        'heat-spectrum': 'linear-gradient(180deg, #ff6a3d, transparent)',
        'thermal-glow': 'radial-gradient(ellipse at 50% 0%, rgba(255, 106, 61, 0.08) 0%, transparent 70%)',
        'thermal-glow-dark': 'radial-gradient(ellipse at 50% 0%, rgba(255, 106, 61, 0.12) 0%, transparent 70%)',
      },
      borderRadius: {
        tags: '4px',
        cards: '8px',
        inputs: '4px',
        buttons: '4px',
      },
      boxShadow: {
        'ember-glow': 'rgba(255, 106, 61, 0.15) 0px 0px 20px 0px inset',
        'ember-glow-sm': 'rgba(255, 106, 61, 0.1) 0px 0px 10px 0px inset',
        'card': '0 0 0 1px rgba(255, 255, 255, 0.06)',
        'card-hover': '0 0 0 1px rgba(255, 106, 61, 0.2)',
        'card-light': '0 0 0 1px rgba(0, 0, 0, 0.06)',
        'card-light-hover': '0 0 0 1px rgba(0, 0, 0, 0.12)',
        'modal': '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 106, 61, 0.15)',
        'glass': '0 0 0 1px rgba(255, 255, 255, 0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.3s ease-out forwards',
        'slide-down': 'slideDown 0.2s ease-out forwards',
        'scale-in': 'scaleIn 0.2s ease-out forwards',
        'spin-slow': 'spin 2s linear infinite',
        'theme-switch': 'themeSwitch 0.4s ease-in-out forwards',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'heat-wave': 'heatWave 3s ease-in-out infinite',
        'bar-peak': 'barPeak 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        themeSwitch: {
          '0%': { transform: 'rotate(0deg) scale(1)' },
          '50%': { transform: 'rotate(180deg) scale(1.2)' },
          '100%': { transform: 'rotate(360deg) scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        heatWave: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        barPeak: {
          '0%, 100%': { transform: 'scaleY(0.3)', opacity: '0.5' },
          '50%': { transform: 'scaleY(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
