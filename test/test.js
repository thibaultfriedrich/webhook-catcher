import express from 'express'
import dotenv from 'dotenv'
import winston from 'winston'
import WebhookCatcher from '../src/webhook-catcher'

if (process.env.NODE_ENV !== 'production') {
  try {
    dotenv.config()
  } catch (err) {
    winston.error(err)
    process.exit(2)
  }
}

const app = express()

const catcher = new WebhookCatcher({
  services: [ 'bitbucket' ],
  token: 'c3598e25b9473a0ed71e6d87b6907af9',
})

app
.use('/webhook', catcher.router)
.get('/', (req, res) => {
    res.send('ok')
})

// catcher.on('pull-request', (pullRequest) => {
//   // pull request
//   console.log(pullRequest)
// })

catcher.on('all', (event) => {
  console.log(event.toJson())
})


const server = app.listen(process.env.PORT, () => {
  winston.info(`listening on port ${server.address().port}`)
})
