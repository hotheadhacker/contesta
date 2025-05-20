/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, 'src'),
    }
    return config
  },
  images: {
    domains: ['github.com', 'cdn.pixabay.com', 'freelogopng.com', 'i.pinimg.com'],
  },
}

module.exports = nextConfig
