// const Errors = require('./oauth-errors.js')
const Errors = require('./oauth/errors.js')
const HeaderUtils = require('./oauth/header.js')
const qs = require('querystring')
const url = require('url')
const HttpStatus = require('http-status-codes')
const ClientController = require('../controllers/client.js')()
const UserController = require('../controllers/user.js')()
const DeviceController = require('../controllers/device.js')()
const OauthController = require('../controllers/oauth.js')()
// const base64 = require('../modules/base64.js')
/*
 * authorize()
 *
 * Description: Carry out the authorization code grant flow
 * for authentication
 *
**/
function authorize (req, res, next) {
  const {
    response_type,
    client_id,
    client_secret,
    redirect_uri,
    scope,
    state
  } = req.method === 'GET' ? req.query : req.body

  const fields = [
    // Check if a valid callback uri is provided first
    {
      name: 'redirect_uri',
      required: true,
      error: qs.stringify(Errors.InvalidRequest)
      // error: Errors.INVALID_REQUEST,
      // errorDescription: Errors.getErrorDescriptionFrom(Errors.INVALID_REQUEST)
    },
    {
      name: 'response_type',
      required: true,
      // `code` for authorization code grant flow
      expected: 'code',
      error: qs.stringify(Errors.UnsupportedResponseType)
      // error: Errors.UNSUPPORTED_RESPONSE_TYPE,
      // errorDescription: Errors.getErrorDescriptionFrom(Errors.UNSUPPORTED_RESPONSE_TYPE)
    },
    {
      name: 'client_id',
      required: true,
      error: qs.stringify(Errors.UnauthorizedClient)
      // error: Errors.UNAUTHORIZED_CLIENT,
      // errorDescription: Errors.getErrorDescriptionFrom(Errors.UNAUTHORIZED_CLIENT)
    }
    // {
    //   name: 'client_secret',
    //   required: true,
    //   error: Errors.UNAUTHORIZED_CLIENT,
    //   errorDescription: Errors.getErrorDescriptionFrom(Errors.UNAUTHORIZED_CLIENT)
    // }
  ]

  // Validate each fields, return the appropriate error messages if any encountered
  const errors = fields.filter((field) => {
    if (req.method === 'GET') {
      const MISSING_FIELD = field.required && !req.query[field.name]
      const INCORRECT_VALUE = field.expected && field.expected !== req.query[field.name]
      return (MISSING_FIELD || INCORRECT_VALUE)
    } else {
      const MISSING_FIELD = field.required && !req.body[field.name]
      const INCORRECT_VALUE = field.expected && field.expected !== req.body[field.name]
      return (MISSING_FIELD || INCORRECT_VALUE)
    }
  })
  if (errors.length) {
    const field = errors[0]

    // Manage expectations
    // Redirect them to the url with the errors
    if (redirect_uri) {
      return res.redirect(`${redirect_uri}?${field.error}`)
    } else {
      const returnURL = url.format({
        protocol: req.protocol,
        hostname: req.hostname,
        pathname: req.originalUrl
      })
      return res.redirect(`${returnURL}?${field.error}`)
    }
  } else {
    ClientController.getOneByClientId(client_id).catch((err) => {
      next(err)
    }).then((client) => {
      if (!client) {
        res.redirect(`${redirect_uri}?${qs.stringify(Errors.InvalidClient)}`)
      } else if (client && client.redirect_uris.indexOf(redirect_uri) === -1) {
        res.redirect(`${redirect_uri}?${qs.stringify(Errors.InvalidClient)}`)
      } else {
        req.client = client
        req.client.redirect_uri = client.redirect_uris[client.redirect_uris.indexOf(redirect_uri)]
        next()
      }
    })
  }
}
/*
 * token()
 *
 * Description: Generate the access/refresh token pair
 * when the given authorization code is valid. Also check
 * the client id and secret agains the redirect_uri. Include scope
 * `offline_access` to include refresh token in the response
 *
**/
function token (req, res, next) {
  const authorizationHeader = req.headers.authorization
  const code = req.body.code
  const grantType = req.body.grant_type

  if (!grantType) {
    return next(Errors.InvalidGrant)
  }
  // Other grant type can be refresh token etc
  if (grantType !== 'authorization_code') {
    return next(Errors.UnsupportedGrantType)
  }
  const token = HeaderUtils.Client(authorizationHeader)
  if (!token) {
    return next(Errors.InvalidRequest)
  }

  ClientController
  .getBySecret({
    client_id: token.clientId,
    client_secret: token.clientSecret
  })
  .then((client) => {
    if (!client) {
      return next(Errors.UnauthorizedClient)
    }
    req.client = client
    return OauthController.getCode(code).then((response) => {
      if (!response) {
        // No code found
        return next(Errors.InvalidRequest)
      } else {
        // response.useragent === client.useragent
      // Probably validate the user agent first
      // Remove the code (Can only be used once)
        return response.remove()
      }
    })
  }).then((data) => {
    // create access/refresh token pair
    return OauthController.createToken({
      // useragent: req.headers
      client_id: req.client._id
    }).then((token) => {
      req.user = token
      next()
    })
  })
}
/*
 * introspect()
 *
 * Description: Token introspection according to RFC 7662,
 * returns the validity of the access/refresh token
 *
**/
function introspect (req, res, next) {
  // params: token, token_type_hint
  const token = req.body.token
  const tokenTypeHint = req.body.token_type_hint
  const validTokenTypes = ['access_token', 'refresh_token']

  if (!tokenTypeHint) {
    next(Errors.MissingTokenTypeHint)
  }
  if (validTokenTypes.indexOf(tokenTypeHint) === -1) {
    // not a valid token type
    next(Errors.InvalidTokenTypeHint)
  }
  OauthController
  .verifyToken(token)
  .then((data) => {
    req.expires_in = Math.floor(data.exp - Date.now() / 1000)
    req.active = true
    next()
      // scope:
      // client_id
      // username
      // token_type
      // exp
      // iat
      // nbf
      // sub
      // aud
      // iss
      // jti
      // user_id: data.user_id,
  }).catch((err) => {
    return next(Errors.UnauthorizedClient)
  })
}
/*
 * refresh()
 *
 * Description: Provide a new access token if the provided refresh
 * token and user agent matches
 *
**/
function refresh (req, res, next) {
  const grantType = req.body.grant_type
  const authorizationHeader = req.headers.authorization
  const refreshToken = req.body.refresh_token
  const useragent = req.headers['user-agent']

  if (!grantType) {
    return next(Errors.InvalidGrant)
  }
  if (grantType !== 'refresh_token') {
    return next(Errors.UnsupportedGrantType)
  }
  const token = HeaderUtils.Client(authorizationHeader)
  if (!token) {
    return next(Errors.InvalidRequest)
  }
  ClientController
  .getBySecret({
    client_id: token.clientId,
    client_secret: token.clientSecret
  })
  .then((client) => {
    if (!client) {
      return next(Errors.UnauthorizedClient)
    }
    req.client = client
    // create access/refresh token pair
    return DeviceController
    .verifyDevice({
      refresh_token,
      useragent
    })
  })
  .then((device) => {
    if (!device) {
      return next(Errors.UnauthorizedClient)
    } else {
      device.access_token = device.createAccessToken(device.user_id)
      device.save().then((token) => {
        req.user = token
        next()
      })
    }
  })
}
/*
 * validate()
 *
 * Description: Validate the authorization token in the header to see
 * if the user has the right to access an api endpoint. Returns the User
 * Object tied to req.user
 *
**/
function verify (req, res, next) {
  const authorizationHeader = req.headers.authorization
  const accessToken = HeaderUtils.Bearer(authorizationHeader)
  if (!accessToken) {
    return next(Errors.InvalidRequest)
  }

  UserController
  .verifyToken(accessToken)
  .then((user) => {
    req.user = user
    next()
  }).catch((err) => {
    // return next({
    //   name: 'Invalid Token',
    //   message: 'Token Expired'
    // })
    return next(Errors.InvalidRequest)
  })
}

module.exports = { authorize, token, introspect, refresh, verify }
