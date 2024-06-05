import MillionLint from '@million/lint';
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['*.brs.devtunnels.ms']
    }
  },
  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: 's3.amazonaws.com'
    }]
  }
};
export default MillionLint.next({
  rsc: true
})(nextConfig);