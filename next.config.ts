import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";
const repoBasePath = isGithubPages ? "/Shashank-Portfolio" : "";

const nextConfig: NextConfig = {
  ...(isGithubPages
    ? {
        output: "export",
        basePath: repoBasePath,
        trailingSlash: true,
        images: {
          unoptimized: true,
        },
        env: {
          NEXT_PUBLIC_BASE_PATH: repoBasePath,
        },
      }
    : {
        cacheComponents: true,
        partialPrefetching: true,
      }),
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
