import { NextApiRequest, NextApiResponse } from 'next'
import Bugsnag from '@bugsnag/js'
import BugsnagPluginAwsLambda from '@bugsnag/plugin-aws-lambda'

/**
 * The handled notify never makes it to Bugsnag and the following is seen in the serverless logs:
 * 
 * [GET] /api/handled 17:14:54:08
 * 2022-03-24T17:14:54.131Z	8a4d1fbf-5f21-4d6e-84c4-6d770625b2d3	ERROR	[bugsnag] Delivery may be unsuccessful: flush timed out after 2000ms2022-03-24T17:14:54.145Z	8c1055c6-d133-49d9-b39b-a1d090aed706	ERROR	[bugsnag] Session failed to send…Error: Client network socket disconnected before secure TLS connection was established    at connResetException (internal/errors.js:639:14)    at TLSSocket.onConnectEnd (_tls_wrap.js:1570:19)    at TLSSocket.emit (events.js:412:35)    at TLSSocket.emit (domain.js:475:12)    at endReadableNT (internal/streams/readable.js:1334:12)    at processTicksAndRejections (internal/process/task_queues.js:82:21) Error: Client network socket disconnected before secure TLS connection was established    at connResetException (internal/errors.js:639:14)    at TLSSocket.onConnectEnd (_tls_wrap.js:1570:19)    at TLSSocket.emit (events.js:412:35)    at TLSSocket.emit (domain.js:475:12)    at endReadableNT (internal/streams/readable.js:1334:12)    at processTicksAndRejections (internal/process/task_queues.js:82:21) {  code: 'ECONNRESET',  path: null,  host: 'sessions.bugsnag.com',  port: 443,  localAddress: undefined}
 */
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
  await require('@bugsnag/in-flight').flush(2000);
  response.status(200).json({
    body: request.body,
    query: request.query,
    cookies: request.cookies
  })
}

export default bugsnagHandler(handler)