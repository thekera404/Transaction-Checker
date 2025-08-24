/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure clean builds
  experimental: {
    forceSwcTransforms: true,
  },
  
  // Build configuration
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Force clean builds
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
  
  // Headers for Farcaster
  async headers() {
    return [
      {
        source: "/.well-known/farcaster.json",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Cache-Control", value: "public, max-age=3600" }
        ]
      }
    ];
  }
};
export default nextConfig;
