/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // basePath: '/sites/support-managerbot', // Commented out for local dev
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
