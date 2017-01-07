const express = require('express')
const router = express.Router()
const HttpStatus = require('http-status-codes')

const ClientController = require('../controllers/client.js')()

const ValidationErrors = {
  InvalidClientId: {
    error: 'Invalid Request',
    description: 'ClientId missing from req.params',
    code: 400
  }
}

router.get('/clients/:id/edit', (req, res) => {
  const request = (req, res, next) => {
    const _id = req.params.id
    if (!_id) {
      return next(ValidationErrors.InvalidClientId)
    }
    return { _id }
  }
  const response = (req, res, next) => {
    return (client) => {
      res.locals.client = client
      res.render('client-edit')
    }
  }
  ClientController
  .getClient(request(req, res, next))
  .then(response(req, res, next))
})

router.put('/clients/:id', (req, res) => {
  ClientController
  .updateClient(req.body)
  .then((data) => {
    res.status(HttpStatus.NO_CONTENT).json({
      ok: true
    })
  })
})

router.get('/clients', (req, res) => {
  ClientController
  .getClients()
  .then((clients) => {
    res.locals.clients = clients
    res.render('clients')
  })
})

router.get('/clients/register', (req, res) => {
  res.render('clients-register')
})

router.post('/clients/register', (req, res) => {
  ClientController
  .createClient(req.body)
  .then((client) => {
    res.redirect('/clients')
  })
  .catch((err) => {
    res.status(HttpStatus.BAD_REQUEST).json({
      err
    })
  })
})

router.delete('/clients/:id', (req, res) => {
  ClientController
  .removeClient(req.params.id)
  .then((data) => {
    res.status(HttpStatus.NO_CONTENT).json({
      ok: true
    })
  })
})

module.exports = router
