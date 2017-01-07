
const Code = require('../models/code')
const Token = require('../models/token')
const jwt = require('../modules/jwt.js')
class OAuthController {
  createAuthorizationCode (params) {
    const code = new Code()
    // The authorization code must be tied to the user's ID
    code.code = code.generateCode()
    code.user_id = params.user_id
    return code.save()
  }
  getCode (code) {
    return Code.findOne({ code })
  }

  createToken (params) {
    return jwt.sign({
      user_id: params.user_id,
      client_id: params.client_id
    }, '5m').then((access_token) => {
      const token = new Token()
      token.access_token = access_token
      token.refresh_token = token.generateToken()
      token.client_id = params.client_id
      return token.save()
    })
  }

  verifyToken (access_token) {
    return jwt.verify(access_token)
  }
}

module.exports = function init (options) {
  return new OAuthController(options)
}
