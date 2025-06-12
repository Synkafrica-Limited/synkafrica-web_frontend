
// Just remove it or use a regular import if needed
// import { someFunction } from 'next' // for actual JS modules
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['your-image-domain.com'], // Replace or remove as needed
  },
}

module.exports = nextConfig
