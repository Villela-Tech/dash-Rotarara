/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@nivo/core', '@nivo/pie', '@nivo/bar', '@nivo/line']
};

module.exports = nextConfig; 