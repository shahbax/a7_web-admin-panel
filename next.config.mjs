import path from "node:path"
import { fileURLToPath } from "node:url"

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
    ],
  },
  // Pin the project root so a stray lockfile in a parent folder is never used.
  turbopack: { root: path.dirname(fileURLToPath(import.meta.url)) },
}

export default nextConfig
