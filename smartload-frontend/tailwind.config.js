/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: '#F8FAFB',
        card: '#FFFFFF',
        primary: {
          DEFAULT: '#1E3A5F',
          light: '#2D4F7A',
        },
        accent: {
          green: '#10B981',
          teal: '#14B8A6',
          coral: '#EF4444',
          amber: '#F59E0B',
          orange: '#F97316',
          blue: '#3B82F6',
        },
        text: {
          primary: '#1E293B',
          secondary: '#64748B',
        },
        border: {
          DEFAULT: '#E2E8F0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'brand': ['20px', { fontWeight: '700' }],
        'page-heading': ['24px', { fontWeight: '600' }],
        'card-heading': ['16px', { fontWeight: '600' }],
        'body': ['14px', { fontWeight: '400' }],
        'number': ['36px', { fontWeight: '700' }],
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(30, 58, 95, 0.06)',
        md: '0 6px 16px -4px rgba(30, 58, 95, 0.12)',
      },
    },
  },
  plugins: [],
}
