import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        deepworkos: {
          'bg-dark': '#0a0a0f',
          'bg-dark-secondary': '#12121a',
          'card': '#16161f',
          'card-secondary': '#1e1e2a',
          'card-hover': '#252533',
          'border': '#2a2a3a',
          'primary': '#ff4c4c',
          'primary-hover': '#ff7f50',
          'primary-glow': 'rgba(255, 76, 76, 0.4)',
          'success': '#00ff88',
          'success-glow': 'rgba(0, 255, 136, 0.4)',
          'turquoise': '#00d4ff',
          'turquoise-glow': 'rgba(0, 212, 255, 0.4)',
          'purple': '#bf5af2',
          'purple-glow': 'rgba(191, 90, 242, 0.4)',
          'orange': '#ff9f43',
          'orange-glow': 'rgba(255, 159, 67, 0.4)',
          'red': '#ff6b6b',
          'red-glow': 'rgba(255, 107, 107, 0.4)',
          'gray': '#555555',
          'gray-light': '#888899',
          'text': '#ffffff',
          'text-muted': '#aaaabc',
        },
        neon: {
          cyan: '#00ffff',
          magenta: '#ff00ff',
          green: '#00ff88',
          purple: '#bf5af2',
          blue: '#00d4ff',
          pink: '#ff6b9d',
          yellow: '#ffd93d',
        },
      },
      boxShadow: {
        'neon-primary': '0 0 10px rgba(255, 76, 76, 0.5), 0 0 20px rgba(255, 76, 76, 0.3), 0 0 30px rgba(255, 76, 76, 0.1)',
        'neon-success': '0 0 10px rgba(0, 255, 136, 0.5), 0 0 20px rgba(0, 255, 136, 0.3), 0 0 30px rgba(0, 255, 136, 0.1)',
        'neon-turquoise': '0 0 10px rgba(0, 212, 255, 0.5), 0 0 20px rgba(0, 212, 255, 0.3), 0 0 30px rgba(0, 212, 255, 0.1)',
        'neon-purple': '0 0 10px rgba(191, 90, 242, 0.5), 0 0 20px rgba(191, 90, 242, 0.3), 0 0 30px rgba(191, 90, 242, 0.1)',
        'neon-orange': '0 0 10px rgba(255, 159, 67, 0.5), 0 0 20px rgba(255, 159, 67, 0.3), 0 0 30px rgba(255, 159, 67, 0.1)',
        'glow-sm': '0 0 5px currentColor, 0 0 10px currentColor',
        'glow': '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
