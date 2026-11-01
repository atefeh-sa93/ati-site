import type { NextConfig } from "next";

// GitHub Pages serves the site from /<repo>; set by the deploy workflow, empty locally.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // Static HTML in out/, hosted on GitHub Pages.
  output: "export",
  basePath,
  // Emit /fa/index.html instead of /fa.html so static hosts serve /fa/ directly.
  trailingSlash: true,
  // Used at build time by app/[lang]/og.png; bundling breaks it, so Node loads it directly.
  serverExternalPackages: ["fontkit"],
  // app/global-not-found.tsx becomes out/404.html, the page GitHub Pages serves for unknown URLs.
  experimental: { globalNotFound: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
