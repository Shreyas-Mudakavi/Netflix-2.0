/** @type {import('next').NextConfig} */

const withTM = require('next-transpile-modules')([
  '@stripe/firestore-stripe-payments',
])
// send the modules you want to use

module.exports = withTM({
  reactStrictMode: true,
  images: {
    domains: ['image.tmdb.org', 'www.logo.wine', 'rb.gy'],
  },
})
