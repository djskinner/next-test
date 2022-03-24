import { NextApiRequest, NextApiResponse } from 'next'
import Bugsnag from '@bugsnag/js'
import BugsnagPluginAwsLambda from '@bugsnag/plugin-aws-lambda'

let count = 0;
Bugsnag.start({
  apiKey: process.env.BUGSNAG_API_KEY,
  plugins: [BugsnagPluginAwsLambda],
})

const bugsnagHandler = Bugsnag.getPlugin('awsLambda').createHandler()

async function handler (
  request: NextApiRequest,
  response: NextApiResponse
) {
  count++
  Bugsnag.addMetadata('count', { count })
  Bugsnag.addMetadata('meta' + Math.random(), { some: 'stuff' + Math.random() })
  Bugsnag.notify(new Error('a handled error occurred'))
  response.status(200).json({
    body: request.body,
    query: request.query,
    cookies: request.cookies
  })
  
  await require('@bugsnag/in-flight').flush(2000)
}

export default bugsnagHandler(handler)