module.exports = {
  apps: [
    {
      name: 'firmachain-wallet-connect-relay',
      script: './src/server.ts',
      interpreter: 'ts-node',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};