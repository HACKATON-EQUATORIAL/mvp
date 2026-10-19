import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: (process.env.NEXT_DEV_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((hostname) => hostname.trim())
    .filter(Boolean),
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "microphone=(self), camera=(), geolocation=()",
          },
        ],
      },
      {
        // Voz pré-gerada: o caminho muda com a voz e o texto, então nunca expira.
        source: "/voz/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        condition: { not: { path: "*.module.css" } },
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
