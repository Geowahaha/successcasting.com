import type { NextConfig } from "next";

const successCastingBackendOrigin =
  process.env.SUCCESSCASTING_BACKEND_ORIGIN ?? "http://43.128.75.149";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "successcasting.com" }],
        destination: "https://www.successcasting.com/:path*",
        permanent: true,
      },
      // Retired routes → real pages / homepage contact section
      { source: "/contact", destination: "/#contact", permanent: true },
      { source: "/about", destination: "/#contact", permanent: true },
      { source: "/services", destination: "/products", permanent: true },
      { source: "/promotions", destination: "/products", permanent: true },
      { source: "/rfq", destination: "/#contact", permanent: true },
      { source: "/designs", destination: "/", permanent: true },
      { source: "/designs/:slug*", destination: "/", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        // HTML pages: tell browsers not to cache so deploys show immediately.
        // s-maxage=60 (set by revalidate=60) still controls CDN/proxy cache.
        source: "/(|products|products/[^.]+|blog)",
        headers: [
          { key: "Cache-Control", value: "no-store" },
          { key: "Link", value: '</llms.txt>; rel="llms-txt"' },
        ],
      },
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "accelerometer=(), autoplay=(), encrypted-media=(), gyroscope=(), payment=(), usb=()",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/api/ai-sales/:path*", destination: `${successCastingBackendOrigin}/api/ai-sales/:path*` },
        { source: "/api/admin/:path*", destination: `${successCastingBackendOrigin}/api/admin/:path*` },
        { source: "/admin/:path*", destination: `${successCastingBackendOrigin}/admin/:path*` },
        { source: "/webhooks/:path*", destination: `${successCastingBackendOrigin}/webhooks/:path*` },
        { source: "/api/customers/:path*", destination: `${successCastingBackendOrigin}/api/customers/:path*` },
        { source: "/customers/:path*", destination: `${successCastingBackendOrigin}/customers/:path*` },
        { source: "/connect/:path*", destination: `${successCastingBackendOrigin}/connect/:path*` },
        { source: "/api/channels/:path*", destination: `${successCastingBackendOrigin}/api/channels/:path*` },
        { source: "/api/intent/:path*", destination: `${successCastingBackendOrigin}/api/intent/:path*` },
        { source: "/api/trust-match/:path*", destination: `${successCastingBackendOrigin}/api/trust-match/:path*` },
        { source: "/api/notifications/:path*", destination: `${successCastingBackendOrigin}/api/notifications/:path*` },
        { source: "/api/orders/:path*", destination: `${successCastingBackendOrigin}/api/orders/:path*` },
        { source: "/api/platforms/:path*", destination: `${successCastingBackendOrigin}/api/platforms/:path*` },
        { source: "/api/tokens/:path*", destination: `${successCastingBackendOrigin}/api/tokens/:path*` },
        { source: "/api/errors/:path*", destination: `${successCastingBackendOrigin}/api/errors/:path*` },
        { source: "/api/reports/:path*", destination: `${successCastingBackendOrigin}/api/reports/:path*` },
        { source: "/api/verified/:path*", destination: `${successCastingBackendOrigin}/api/verified/:path*` },
        { source: "/verified/:path*", destination: `${successCastingBackendOrigin}/verified/:path*` },
        { source: "/ai-search/:path*", destination: `${successCastingBackendOrigin}/ai-search/:path*` },
        { source: "/healthz", destination: `${successCastingBackendOrigin}/healthz` },
        { source: "/api/ops/health", destination: `${successCastingBackendOrigin}/api/ops/health` },
        { source: "/services/pulley-casting", destination: `${successCastingBackendOrigin}/services/pulley-casting` },
        { source: "/services/iron-metal-foundry", destination: `${successCastingBackendOrigin}/services/iron-metal-foundry` },
      ],
    };
  },
};

export default nextConfig;
