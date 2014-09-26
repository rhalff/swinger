/***
 *
 * Environment variables for openshift:
 *
 * https://developers.openshift.com/en/managing-environment-variables.html
 *
 */
module.exports = {
  restApiRoot: '/api',
  host: process.env.OPENSHIFT_IP,
  port: process.env.OPENSHIFT_PORT,
  url: 'http://' + process.env.OPENSHIFT_APP_DNS,
  config: {
    storage: {
      provider: 'amazon',
      key: process.env.AWS_SECRET_KEY,
      keyId: process.env.AWS_ACCESS_KEY_ID
    }
  }
};
