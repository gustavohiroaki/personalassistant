import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    config.externals = config.externals || [];
    if (isServer) {
      config.externals.push({
        mysql: "commonjs mysql",
        mysql2: "commonjs mysql2",
        pg: "commonjs pg",
        "pg-native": "commonjs pg-native",
        "pg-query-stream": "commonjs pg-query-stream",
        tedious: "commonjs tedious",
        oracledb: "commonjs oracledb",
      });
    } else {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        mysql: false,
        mysql2: false,
        pg: false,
        "pg-native": false,
        "pg-query-stream": false,
        tedious: false,
        oracledb: false,
      };
    }
    return config;
  },
  experimental: {
    turbo: {
      resolveAlias: {
        mysql: require.resolve("fs"),
        mysql2: require.resolve("fs"),
        pg: require.resolve("fs"),
        "pg-native": require.resolve("fs"),
        "pg-query-stream": require.resolve("fs"),
        tedious: require.resolve("fs"),
        oracledb: require.resolve("fs"),
      },
    },
  },
};
export default nextConfig;
