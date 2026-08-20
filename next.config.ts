import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // `standalone` es para auto-hospedaje con Docker y rompe el empaquetado de
  // Vercel: falla con ENOENT buscando .next/next-server.js.nft.json.
  // En Vercel se omite; fuera de Vercel se mantiene para que el Dockerfile
  // de la plantilla siga funcionando.
  output: process.env.VERCEL ? undefined : "standalone",
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
