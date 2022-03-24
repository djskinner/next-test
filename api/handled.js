const Bugsnag = require('@bugsnag/js')
const BugsnagPluginAwsLambda = require('@bugsnag/plugin-aws-lambda')

let count = 0;
Bugsnag.start({
  apiKey: process.env.BUGSNAG_API_KEY,
  plugins: [BugsnagPluginAwsLambda],
})

const bugsnagHandler = Bugsnag.getPlugin('awsLambda').createHandler()

async function _handler (event, context, callback) {
  count++
  Bugsnag.addMetadata('count', { count })
  Bugsnag.addMetadata('meta' + Math.random(), { some: 'stuff' + Math.random() })
  Bugsnag.notify(new Error('a handled error occurred'))
  return {
    statusCode: 200,
    headers: {},
    body: 'Hello world',
  };
};

module.exports.handler = bugsnagHandler(_handler)