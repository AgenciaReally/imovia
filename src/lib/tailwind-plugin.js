// Arquivo para auxiliar na configuração do Tailwind
const plugin = require('tailwindcss/plugin');

module.exports = plugin(function({ addBase, theme }) {
  addBase({
    ':root': {
      '--radius': '0.5rem',
    },
  })
})
