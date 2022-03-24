const Bugsnag = require("@bugsnag/browser");
const BugsnagPluginAwsLambda = require('@bugsnag/plugin-aws-lambda');

Bugsnag.start({
  apiKey: process.env.BUGSNAG_API_KEY,
  plugins: [BugsnagPluginAwsLambda],
})

exports.handler = async function (event, context, callback) {
  Bugsnag.notify(new Error('some handled error from vercel AWS mode'))
  return {
    statusCode: 200,
    headers: {},
    body: 'Hello world',
  };
};

module.exports.handler = bugsnagHandler(_handler)
