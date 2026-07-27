import type { NextConfig } from 'next'

const basePath = process.env.NODE_ENV === 'production' ? '/cave-learn' : ''

const nextConfig: NextConfig = {
  output: 'export',
  ...(basePath ? { basePath } : {}),
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
}

export default nextConfig
