/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  eslint: {
    // Deshabilitar la verificación de ESLint durante la compilación
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Deshabilitar la verificación de TypeScript durante la compilación
    ignoreBuildErrors: true,
  },
  env: {
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: 'dtpmbchjt',
  }
};

module.exports = nextConfig; 