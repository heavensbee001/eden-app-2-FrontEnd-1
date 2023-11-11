module.exports = {
  reactStrictMode: true,
  transpilePackages: [
    "@eden/package-ui",
    "@eden/package-context",
    "@eden/package-graphql",
    "@eden/package-mock",
  ],
  images: {
    domains: [
      "pbs.twimg.com",
      "app.lottiefiles.com",
      "storage.cloud.google.com",
      "storage.googleapis.com",
    ],
    formats: ["image/avif"],
  },
};
