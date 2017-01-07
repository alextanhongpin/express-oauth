const express = require('express')
const router = express.Router()
const request = require('request')
const qs = require('querystring')
const HttpStatus = require('http-status-codes')
const url = require('url')
const OauthController = require('../controllers/oauth.js')()
const base64 = require('../modules/base64.js')

const oauth = require('../modules/oauth.js')
const OAuthSDK = require('../modules/oauth/client.js')

const oauthSDK = OAuthSDK({
  client_id: '2452acdd895ac8e86ca91419bcded0f1',
  client_secret: 'baf449e64612534a1b1b7fcb98ebcf60',
  redirect_uri: 'http://localhost:8080/authorize/callback',
  oauth_uri: 'http://localhost:8080/oauth/authorize',
  token_uri: 'http://localhost:8080/oauth/token'
})
/*
 * GET /connect
 *
 * Description: Entry point to connect to the oauth
 *
**/
router.get('/connect', (req, res) => {
  res.render('connect')
})
/*
 * GET /authorize
 *
 * Description: Example authorize route from the third-party (client) app.
 * SDK is initialized once and can be used for the authorize, authorize
 * callback and refresh route
 *
**/
router.get('/authorize', oauthSDK.authenticate.bind(oauthSDK))
/*
 * POST /authorize/callback
 *
 * Description: Example callback URL registered by the client.
 * Upon successful authorization, user will
 * receive an authorization code that is valid for 5-10
 * minutes. Carry out the request to get the access token here
 *
**/
router.get('/authorize/callback', oauthSDK.authenticate.bind(oauthSDK), (req, res) => {
  // Do something with the access/refresh token pair
  res.status(HttpStatus.OK).json(req.user)
})
/*
 * POST /refresh
 *
 * Description: Trigger a service call internally to the auth server to
 * obtain a new access token
 *
**/
router.post('/refresh', oauthSDK.refresh.bind(oauthSDK), (req, res) => {
    // Do something with the access/refresh token pair
  res.status(HttpStatus.OK).json(req.user)
})
/*
 * GET /oauth/authorize
 *
 * Description: Validate the client_id, scopes, and
 * redirect url against the database, and render
 * the consent screen if it is valid. User has to be logged
 * in first.
 *
**/
router.get('/oauth/authorize', oauth.authorize, (req, res) => {
  // Encode the client first?
  res.locals.client = req.client

  res.locals.response_type = req.query.response_type
  res.locals.client_id = req.query.client_id
  res.locals.redirect_uri = req.query.redirect_uri
  // Set maximum length?
  // Set additional params?

  res.render('consent')
})
/*
 * POST /authorize
 *
 * Description: Validate the client's access to the
 * application and return a valid authorization code
 * should the user agree to the consent. Here an extra step
 * will be taken to validate if the user exists or not
 *
**/
router.post('/oauth/authorize', oauth.verify, oauth.authorize, (req, res) => {
  const redirect_uri = req.client.redirect_uris[0]
  OauthController.createAuthorizationCode({
    user_id: req.user.user_id
  }).then((response) => {
    const query = qs.stringify({
      code: response.code
      // state: csrf token
    })
    res.status(HttpStatus.OK).json({
      ok: true,
      redirect_uri: `${redirect_uri}?${query}`
    })
  })
})
/*
 * POST /oauth/token
 *
 * Description: Create an access/refresh token pairs
 * if the given authorization code is valid
 * If grant type is `refresh_token`, a new access token
 * will be provided
 *
**/
router.post('/oauth/token', oauth.verify, oauth.token, nocache, (req, res) => {
  // Create access/refresh token pair
  res.status(HttpStatus.OK).json({
    access_token: req.user.access_token,
    refresh_token: req.user.refresh_token,
    token_type: 'Bearer',
    expires_in: 3600
  })
})
/*
 * POST /oauth/refresh_token
 *
 * Description: Update the access token given a valid refresh token/useragent
 * pair
 *
**/
router.post('/oauth/refresh', oauth.refresh, nocache, (req, res) => {
  // Create access/refresh token pair
  res.status(HttpStatus.OK).json({
    access_token: req.user.access_token,
    token_type: 'Bearer',
    expires_in: 3600
  })
})
/*
 * POST /oauth/introspect
 *
 * Description: Validate if the access token is coming
 * from the provider. Will return a refresh token if the
 * verified token has expired. Refer to RFC 7662
 *
**/
// application/x-www-form-urlencoded
// Method POST
// Content-Type: application/x-www-form-urlencoded
// Accept: application/json
// Authorization: Bearer 1313213123 or Basic base64(clientId:clientSecret)
router.post('/oauth/introspect', oauth.verify, oauth.introspect, (req, res) => {
  res.status(HttpStatus.OK).json({
    active: req.active,
    expires_in: req.expires_in
  })
})

// OpenID Connect
router.get('/oauth/userinfo', oauth.verify, (req, res) => {
  // Do something
  console.log(req.user)
})

function nocache (req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate') // HTTP 1.1
  res.header('Expires', '-1') // Proxies
  res.header('Pragma', 'no-cache') // HTTP 1.0
  next()
}
  // Sample usage
  // oauth2.authorize({
  //   client_id: '',
  //   client_secret: '',
  //   callback_uri: '',
  //   scope: '',
  //   state: ''
  // })

module.exports = router
