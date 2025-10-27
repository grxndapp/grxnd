import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'yt3.ggpht.com',
      },
      {
        protocol: 'https',
        hostname: 'yt3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'scontent-lhr6-1.cdninstagram.com',
      },
      {
        protocol: 'https',
        hostname: 'ph10.freevar.com',
      },
      {
        protocol: 'https',
        hostname: 'minweb.freevar.com',
      },
      {
        protocol: 'https',
        hostname: 'detix-website.vercel.app',
      },
      {
        protocol: 'https',
        hostname: 'qualysservs.com',
      },
      {
        protocol: 'https',
        hostname: 'visora.vercel.app',
      },
      {
        protocol: 'https',
        hostname: 'static.mypocketskill.com'
      }
    ]
  }
};

export default nextConfig;
