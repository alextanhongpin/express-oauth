// auth.js
//
// Description: Carry out normal user authentication flow

const express = require('express')
const router = express.Router()
const validator = require('email-validator')
const Errors = require('../modules/oauth/errors.js')()

const UserController = require('../controllers/user.js')()
const DeviceController = require('../controllers/device.js')()

module.exports = function init (options) {
  const passport = options.passport
  //
  // GET /register
  //
  // Description: The registration page for new users
  //
  router.get('/register', (req, res) => {
    res.render('register')
  })
  //
  // POST /register
  //
  // Description: Form submission for registration
  //
  router.post('/register',
    validateEmailAndPassword,
    passport.authenticate('register', {
      session: false
    }), (req, res) => {
    // Associate the user account with a device
      DeviceController.createDevice({
        user_id: req.user.id,
        useragent: req.headers['user-agent']
      }).then((device) => {
        res.status(200).json({
          access_token: device.access_token,
          refresh_token: device.refresh_token
        })
      })
    })
  //
  // GET /login
  //
  // Description: The login page for existing users
  //
  router.get('/login', (req, res) => {
    res.render('login')
  })
  //
  // POST /login
  //
  // Description: Form submission for login
  //
  router.post('/login',
    validateEmailAndPassword,
    passport.authenticate('login', {
      session: false
    }), function (req, res) {
      DeviceController.createDevice({
        user_id: req.user.id,
        useragent: req.headers['user-agent']
      }).then((device) => {
        res.status(200).json({
          access_token: device.access_token,
          refresh_token: device.refresh_token
        })
      })
    })
  //
  // GET /users
  //
  // Description: Get a list of users
  //
  router.get('/users', (req, res) => {
    UserController.getUsers().then((users) => {
      res.locals.users = users
      res.render('users')
    })
  })
  /*
   * POST /login-service
   *
   * Description: The login service is called only when the user
   * wants to access the consent screen when the user is not logged in
  **/
  router.post('/login-service', (req, res) => {

  })

  router.post('/logout', (req, res) => {
    console.log('logout')
  })
  return router
}

function validateEmailAndPassword (req, res, next) {
  if (!req.body.password || !validator.validate(req.body.email)) {
    return next(Errors.AuthError)
  }
  next()
}
