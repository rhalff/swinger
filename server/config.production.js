module.exports = {
  restApiRoot: '/api',
  host: '0.0.0.0',
  port: 3000,
  url: 'http://localhost:3000/',
  storage: {
    provider: 'amazon',
    key: process.env.AMAZON_KEY,
    keyId: process.env.AMAZON_KEY_ID
  }
};
