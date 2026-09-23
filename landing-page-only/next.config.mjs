/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export — required for free Cloudflare Pages hosting
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
