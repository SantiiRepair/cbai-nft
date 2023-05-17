// eslint-disable-next-line @typescript-eslint/no-var-requires
const isProduction = process.env.NODE_ENV === 'production'
const withPWA = require('next-pwa')({
  dest: 'public'
})

module.exports = withPWA({
  disable: !isProduction
})
