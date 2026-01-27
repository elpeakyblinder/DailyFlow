import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '2vjlrdbftsxsitev.public.blob.vercel-storage.com',
        port: '',
      },

    ],
  },
};

export default nextConfig;