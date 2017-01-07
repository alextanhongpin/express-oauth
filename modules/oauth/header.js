// oauth/header.js
//
// Description: Utility to extract token from header
//
const base64 = require('../base64.js')

function extractTokenFromHeader (header, tokenTypeHint) {
  if (!header) {
    return false
  }
  const headerCredentials = header.split(' ')
  if (headerCredentials.length !== 2) {
    return false
  }
  const [tokenType, token] = headerCredentials
  if (tokenType !== tokenTypeHint) {
    return false
  }
  return token
}

function Basic (header) {
  return extractTokenFromHeader(header, 'Basic')
}

function Bearer (header) {
  return extractTokenFromHeader(header, 'Bearer')
}

function Client (header) {
  const encodedToken = extractTokenFromHeader(header, 'Basic')
  if (!encodedToken) {
    return false
  }
  const decodedToken = base64.decode(encodedToken)
  if (decodedToken.indexOf(':') === -1) {
    return false
  }
  const [client_id, client_secret] = decodedToken.split(':')
  return { clientId, clientSecret }
}

module.exports = { Basic, Bearer, Client}
