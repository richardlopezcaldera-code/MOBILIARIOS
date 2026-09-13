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
    // El optimizador de imagenes de Vercel tiene cuota en el plan Hobby.
    // Al agotarse devuelve 402 y TODAS las fotos que no estaban ya en cache
    // salen rotas en la tienda (comprobado el 13-09-2026 en las banquetas ISO).
    // Servimos directo desde el CDN de Jumpseller, que ya entrega las fotos
    // en un tamano razonable. Si algun dia se contrata Vercel Pro, basta con
    // quitar esta linea para volver a optimizar.
    unoptimized: true,
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
