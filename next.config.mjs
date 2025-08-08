/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  modularizeImports: {
    "lucide-react": {
      transform: "lucide-react/icons/{{member}}",
    },
  },
  compiler: {
    removeConsole: {
      exclude: ["error"],
    },
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig