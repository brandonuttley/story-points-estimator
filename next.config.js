/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
      unoptimized: true,
    },
    basePath: '/story-points-estimator',
    distDir: 'out',
  }
  
  module.exports = nextConfig