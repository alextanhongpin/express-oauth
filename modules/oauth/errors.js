// errors.js
//
// Description: A list of errors that will be thrown
//

const HttpStatusCode = require('http-status-codes')

const ACCESS_DENIED = 'The user has denied the request'
const INVALID_CLIENT = 'Client authentication failed'
const INVALID_GRANT = 'The provided grant was invalid'
const INVALID_REQUEST = 'The request is malformed and could not be processed'
const INVALID_SCOPE = 'The scope passed in is invalid'
const SERVER_ERROR = 'An error happened on the server that prevented a successful response from being generated'
const TEMPORARILY_UNAVAILABLE = 'The authorization server is temporarily unavailable'
const UNAUTHORIZED_CLIENT = 'The client application isn\'t authorized to make such request'
const UNSUPPORTED_GRANT_TYPE = 'The authorization grant type is not supported'
const UNSUPPORTED_RESPONSE_TYPE = 'An invalid response type was used'

class Errors {
  get AccessDenied () {
    return {
      error: 'Access Denied',
      description: ACCESS_DENIED,
      code: 401
    }
  }
  get InvalidClient () {
    return {
      error: 'Invalid Client',
      description: INVALID_CLIENT,
      code: 401
    }
  }
  get InvalidGrant () {
    return {
      error: 'Invalid Client',
      description: INVALID_GRANT,
      code: 400
    }
  }
  get InvalidRequest () {
    return {
      error: 'Invalid Request',
      description: INVALID_REQUEST,
      code: 400
    }
  }
  get InvalidScope () {
    return {
      error: 'Invalid Scope',
      description: INVALID_SCOPE,
      code: 400
    }
  }
  get ServerError () {
    return {
      error: 'Server Error',
      description: SERVER_ERROR,
      code: 500
    }
  }
  get TemporarilyUnavailable () {
    return {
      error: 'Temporarily Unavailable',
      description: TEMPORARILY_UNAVAILABLE,
      code: 500
    }
  }
  get UnauthorizedClient () {
    return {
      error: 'Unauthorized Client',
      description: UNAUTHORIZED_CLIENT,
      code: 400
    }
  }
  get UnsupportedGrantType () {
    return {
      error: 'Unsupported Grant Type',
      description: UNSUPPORTED_GRANT_TYPE,
      code: 400
    }
  }
  get UnsupportedResponseType () {
    return {
      error: 'Unsupported Response Type',
      description: UNSUPPORTED_RESPONSE_TYPE,
      code: 400
    }
  }
  get AuthError () {
    return {
      error: 'Invalid Credentials',
      description: 'The email or password you entered is invalid',
      code: 401
    }
  }
  get InvalidToken () {
    return {
      error: 'Invalid Token',
      description: 'The token has expired',
      code: 400
    }
  }
  get MissingTokenTypeHint () {
    return {
      error: 'Missing Token Type Hint',
      description: 'token_type_hint is missing from the request',
      code: 400
    }
  }
  get InvalidTokenTypeHint () {
    return {
      error: 'Invalid Token Type Hint',
      description: 'The token you requested is not supported',
      code: 400
    }
  }
  custom (name, description, code) {
    return { name, description, code }
  }
}
module.exports = function init () {
  return new Errors()
}
