module.exports = {
  apps: [
    {
      name: 'firmachain-wallet-connect-relay',
      script: 'ts-node -r ./src/server.ts',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
