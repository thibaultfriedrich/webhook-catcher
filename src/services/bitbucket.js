import Router from './router'

import { PullRequestEvent, PushEvent } from '../events'

export default class Bitbucket extends Router {
  constructor ({ token = '' }) {
    super(token, 'bitbucket')

    this.router.use('/:token/:appName', (req, res, next) => {
      if (token) {
        if (req.params.token && req.params.token === token) {
          next()
        } else {
          res.send(401)
        }
      } else {
        next()
      }
    })

    this.router.post('/:token/:appName', (req, res) => {
      if (req.body.repository) {
        if (req.body.push && req.body.push.changes && req.body.push.changes.length > 0 && req.body.push.changes[0].new.type === 'branch') {
          res.sendStatus(204)
          this.emit('push', new PushEvent(req.params.appName, req.body.repository, req.body.push.changes[0].new.name))
        } else if (req.body.pullrequest && req.body.title && req.body.description && req.body.source && req.body.destination) {
          res.sendStatus(204)
          this.emit('pull-request', new PullRequestEvent(req.params.appName, req.body.repository, req.body.source, req.body.destination, req.body.title, req.body.description))
        } else {
          res.sendStatus(400)
        }
      } else {
        res.sendStatus(400)
      }
    })

    this.router.post('*', (req, res) => {
      res.status(404).send('ko')
    })
  }
}
