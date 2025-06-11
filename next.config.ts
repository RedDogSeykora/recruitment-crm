import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
};
const path = require('path');

module.exports = {
  webpack(config: { resolve: { alias: { [x: string]: any; }; }; }) {
    config.resolve.alias['@'] = path.resolve(__dirname);
    return config;
  },
};

export default nextConfig;
