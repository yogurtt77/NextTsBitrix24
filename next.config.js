/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['better-sqlite3'],
  images: {
    domains: ['localhost'],
    unoptimized: true
  }
}

module.exports = nextConfig
