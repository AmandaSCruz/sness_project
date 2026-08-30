module.exports = {
  apps: [
    {
      name: "sness-project",
      script: "server.js",
      env: {
        NODE_ENV: "production",
        PORT: 8000,
      },
    },
  ],
};
