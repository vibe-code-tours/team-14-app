// Only init Cloudflare dev runtime when running under wrangler dev.
// wrangler sets WRANGLER=1; this must NOT run under plain `next dev` (Docker)
// because the OpenNext polyfills crash with a native assertion error.
if (process.env.WRANGLER) {
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
