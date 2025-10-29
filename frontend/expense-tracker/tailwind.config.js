/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: '#875cf5',
        border: 'rgb(var(--border))',
        input: 'rgb(var(--input))',
        ring: 'rgb(var(--ring))',
        background: 'rgb(var(--background))',
        foreground: 'rgb(var(--foreground))',
        primary: 'rgb(var(--primary))',
        primaryForeground: 'rgb(var(--primary-foreground))',
        secondary: 'rgb(var(--secondary))',
        secondaryForeground: 'rgb(var(--secondary-foreground))',
        destructive: 'rgb(var(--destructive))',
        destructiveForeground: 'rgb(var(--destructive-foreground))',
        muted: 'rgb(var(--muted))',
        mutedForeground: 'rgb(var(--muted-foreground))',
        accent: 'rgb(var(--accent))',
        accentForeground: 'rgb(var(--accent-foreground))',
        popover: 'rgb(var(--popover))',
        popoverForeground: 'rgb(var(--popover-foreground))',
        card: 'rgb(var(--card))',
        cardForeground: 'rgb(var(--card-foreground))',
      },
      screens: {
        '3xl': '1920px',
      },
    },
  },
  plugins: [],
}
