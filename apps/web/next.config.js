/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  transpilePackages: ["@repo/ui", "geist", "@ayasofyazilim/saas", "@ayasofyazilim/core-saas", "@ayasofyazilim/unirefund-saas-dev"],
  output: "standalone",
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "*.devtunnels.ms:3000"],
    },
  },
};
