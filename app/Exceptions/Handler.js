'use strict'

// adonis make:ehandler

const Raven = require('raven')

const Config = use('Config')
const Env = use('Env')
const Youch = use('Youch')

const BaseExceptionHandler = use('BaseExceptionHandler')

class ExceptionHandler extends BaseExceptionHandler {
  async handle (error, { request, response }) {
    if (error.name === 'ValidationException') {
      return response.status(error.status).send(error.messages)
    }

    if (Env.get('NODE_ENV') === 'development') {
      const youch = new Youch(error, request.request)
      const errorJson = await youch.toJSON()

      return response.status(error.status).send(errorJson)
    }

    return response.status(error.status)
  }

  async report (error) {
    Raven.config(Config.get('services.sentry.dsn'))
    Raven.captureException(error)
  }
}

module.exports = ExceptionHandler
