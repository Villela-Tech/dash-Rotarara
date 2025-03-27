/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@nivo/core', '@nivo/pie', '@nivo/bar', '@nivo/line'],
  output: 'standalone',
  generateEtags: false,
  poweredByHeader: false,
  images: {
    unoptimized: true
  }
};

module.exports = nextConfig; 