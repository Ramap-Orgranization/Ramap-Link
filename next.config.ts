import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Link previews read Open Graph tags from the document head.
  htmlLimitedBots: /.*/,
};

export default nextConfig;
