
// Just remove it or use a regular import if needed
// import { someFunction } from 'next' // for actual JS modules
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Add remote image hosts you plan to use in production (CDNs, Cloudinary, etc.)
    domains: ['res.cloudinary.com', 'images.unsplash.com', 'assets.vercel.com'],
    // Allow local static images in /public by default; fine-tune sizes if needed
    formats: ['image/avif', 'image/webp'],
  },
}

module.exports = nextConfig
