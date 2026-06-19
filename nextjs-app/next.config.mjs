/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Solana RPC and wallet adapter should not be SSR-bundled
  webpack: (config) => {
    config.resolve.fallback = { ...config.resolve.fallback, fs: false };
    return config;
  },
};

export default nextConfig;
