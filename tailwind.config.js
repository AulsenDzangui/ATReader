/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: [
    './**/*.njk',
  ],
  theme: {
    extend: {
      colors: {
        'text': 'var(--text)',
        'background': 'var(--background)',
        'primary': 'var(--primary)',
        'secondary': 'var(--secondary)',
        'accent': 'var(--accent)',
        'primary-light': 'var(--primary-light)',
        'secondary-light': 'var(--secondary-light)',
        'gray': 'var(--gray)',
      },
    },
  },
  plugins: [],
}

