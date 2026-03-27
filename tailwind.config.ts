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
        giohub: {
          'bg-dark': '#1C1C1C',
          'card': '#2C2C2C',
          'card-secondary': '#333333',
          'primary': '#FF4C4C',
          'primary-hover': '#FF7F50',
          'success': '#4CAF50',
          'orange': '#CA5C45',
          'red': '#A54040',
          'turquoise': '#40A5A4',
          'gray': '#555555',
        },
      },
    },
  },
  plugins: [],
}

export default config
