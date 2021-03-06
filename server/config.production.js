/***
 *
 * Environment variables for openshift:
 *
 * https://developers.openshift.com/en/managing-environment-variables.html
 *
 */
module.exports = {
  restApiRoot: '/api',
  host: process.env.OPENSHIFT_NODEJS_IP,
  port: process.env.OPENSHIFT_NODEJS_PORT,
  url: 'http://' + process.env.OPENSHIFT_APP_DNS,
  dataSources: {
    contentDB: {
      name: 'contentDB',
      connector: 'mongodb',
      url: process.env.OPENSHIFT_MONGODB_DB_URL,
      debug: false
    }
  },
  config: {
    storage: {
      provider: 'amazon',
      key: process.env.AWS_SECRET_KEY,
      keyId: process.env.AWS_ACCESS_KEY_ID
    }
  }
};
