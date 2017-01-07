// oauth/client.js
//
// Description: The client sdk for implementing the oauth
// oauth-sdk.js
//
// Description: SDK for third-party client to integrate the login
// into their server side
//
const request = require('request')
const base64 = require('../base64.js')
const qs = require('querystring')
const url = require('url')

class OAuthSDK {
  constructor (props) {
    // Validate all props
    const required = ['client_id', 'client_secret', 'redirect_uri', 'oauth_uri']
    // required.map((field) => {
    //   return props[field] !== undefined
    // }).any((x) => x)
    this.client_id = props.client_id
    this.client_secret = props.client_secret
    this.redirect_uri = props.redirect_uri
    this.oauth_uri = props.oauth_uri
    this.token_uri = props.token_uri
  }

  authenticate (req, res, next) {
    // Check the url
    if (url.parse(req.url).pathname !== url.parse(this.redirect_uri).pathname) {
      // handle authorization
      const query = qs.stringify({
        // scope: ['email']
        client_id: this.client_id,
        response_type: 'code',
        redirect_uri: this.redirect_uri
      })
      return res.redirect(`${this.oauth_uri}?${query}`)
    } else {
      // handle authorization callback
      const authorizationHeader = base64.encode(`${this.client_id}:${this.client_secret}`)
      request({
        method: 'POST',
        url: this.token_uri,
        headers: {
          'Authorization': `Basic ${authorizationHeader}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: req.query.code,
          grant_type: 'authorization_code'
          // redirect_uri: ''
        })
      }, (err, response, body) => {
        if (!err && response.statusCode === 200) {
          const response = JSON.parse(body)
          req.user = response
          next()
          // res.status(200).json({
          //   response
          // })
        }
      })
    }
  }

  refresh (req, res, next) {
    const authorizationHeader = base64.encode(`${this.client_id}:${this.client_secret}`)
    request({
      method: 'POST',
      url: 'http://localhost:8080/oauth/refresh',
      headers: {
        'Authorization': `Basic ${authorizationHeader}`,
        'Content-Type': 'application/json',
        'User-Agent': req.headers['user-agent']
      },
      body: JSON.stringify({
        code: req.query.code,
        grant_type: 'refresh_token',
        refresh_token: req.body.refresh_token
        // redirect_uri: ''
      })
    }, (err, response, body) => {
      if (!err && response.statusCode === 200) {
        const response = JSON.parse(body)
        req.user = response
        // Do something
        next()
      } else {
        res.status(400).json(err)
      }
    })
  }
}

module.exports = function init (props) {
  return new OAuthSDK(props)
}
