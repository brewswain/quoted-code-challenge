/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "firebasestorage.googleapis.com",
        protocol: "https",
        port: "",
        
      },
      {
        hostname: "kirby.nintendo.com",
        protocol: "https",
        port: ""
      }
    ],
  },
};

module.exports = nextConfig;
