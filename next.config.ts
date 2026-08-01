import type { NextConfig } from "next";

const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;

// When photos move off this project (NEXT_PUBLIC_IMAGE_BASE_URL points at a
// CDN/storage domain instead of being empty), next/image needs that host
// allow-listed. Derive it from the same env var instead of hardcoding it, so
// switching hosts is a one-line env change, not a code change too.
const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [];
if (imageBaseUrl) {
  const url = new URL(imageBaseUrl);
  remotePatterns.push({
    protocol: url.protocol.replace(":", "") as "http" | "https",
    hostname: url.hostname,
  });
}

const nextConfig: NextConfig = {
  images: { remotePatterns },
};

export default nextConfig;
