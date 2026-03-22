/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Unsplash
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // Supabase Storage
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
};

module.exports = nextConfig;