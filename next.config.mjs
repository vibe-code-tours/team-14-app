// Only init Cloudflare dev runtime when deployed on Cloudflare
// (CLOUDFLARE_WORKER_PLATFORM is set by wrangler/miniflare)
if (typeof process !== "undefined" && process.env?.CF_WORKER) {
  const { initOpenNextCloudflareForDev } = await import(
    "@opennextjs/cloudflare"
  );
  initOpenNextCloudflareForDev();
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  serverExternalPackages: ["bcryptjs", "pg", "pg-cloudflare"],
};

export default nextConfig;
