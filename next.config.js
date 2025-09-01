/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'picsum.photos',
      'images.unsplash.com',
      'localhost',
      'via.placeholder.com',
      'orulo-media.s3.amazonaws.com',
      'placehold.co',
      'bf9k2q8r0frrs4a6.public.blob.vercel-storage.com'
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000']
    },
  },
  eslint: {
    // Desabilitar a verificação de ESLint durante o build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Desabilitar a verificação de TypeScript durante o build
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Não incluir módulos Node.js no cliente
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
        http2: false,
      };
    }
    return config;
  },
}

module.exports = nextConfig
