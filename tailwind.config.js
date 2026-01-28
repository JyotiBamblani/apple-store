/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#0071e3',
        'primary-hover': '#0077ed',
        surface: '#ffffff',
        'surface-alt': '#f5f5f7',
        'text-primary': '#1d1d1f',
        'text-muted': '#6e6e73',
        success: '#0a6b0a',
        warning: '#c93400',
      },
      borderRadius: {
        DEFAULT: '12px',
        sm: '8px',
      },
      boxShadow: {
        DEFAULT: '0 2px 12px rgba(0, 0, 0, 0.08)',
        lg: '0 20px 60px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
};
