/** @type {import('next').NextConfig} */
module.exports = {
  output: "export",
  distDir: process.env.NODE_ENV === 'production' ? '../app' : '.next',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: [{
        loader: '@svgr/webpack',
        options: {
          titleProp: true,
        }
      }]
    })

    return config
  },
  experimental: {
    esmExternals: 'loose',
  },
  transpilePackages: ['@uiw/react-markdown-preview'],
}
