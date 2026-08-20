import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Fija la raíz del proyecto: sin esto Next.js sube buscando un package.json
  // y puede quedarse con la carpeta de usuario del sistema.
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.jumpseller.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
