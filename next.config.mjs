/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['*.brs.devtunnels.ms']
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com'
      },
      {
        protocol: 'https',
        hostname: 'api.qrserver.com'
      },
    ]
  }
};
export default nextConfig;