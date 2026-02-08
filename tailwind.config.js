/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // We'll use class-based dark mode for consistency
  theme: {
    extend: {
      colors: {
        // Warm gray palette for dark mode
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          150: '#e5e7eb',
          200: '#e5e7eb',
          250: '#d1d5db',
          300: '#d1d5db',
          350: '#9ca3af',
          400: '#9ca3af',
          450: '#6b7280',
          500: '#6b7280',
          550: '#4b5563',
          600: '#4b5563',
          650: '#374151',
          700: '#374151',
          750: '#1f2937',
          800: '#1f2937',
          850: '#111827',
          900: '#111827',
          950: '#030712',
        },
      },
    },
  },
  plugins: [],
}
