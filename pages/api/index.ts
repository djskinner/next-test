import { NextApiRequest, NextApiResponse } from 'next'
import Bugsnag from '@bugsnag/js'
import BugsnagPluginAwsLambda from '@bugsnag/plugin-aws-lambda'

let count = 0;
Bugsnag.start({
  apiKey: process.env.BUGSNAG_API_KEY,
  plugins: [BugsnagPluginAwsLambda],
})

const bugsnagHandler = Bugsnag.getPlugin('awsLambda').createHandler()

function handler (
  request: NextApiRequest,
  response: NextApiResponse
) {
  count++
  Bugsnag.addMetadata('count', { count })
  Bugsnag.addMetadata('meta' + Math.random(), { some: 'stuff' + Math.random() })
  throw new Error('oops!');
  response.status(200).json({
    body: request.body,
    query: request.query,
    cookies: request.cookies
  })
}

export default bugsnagHandler(handler)