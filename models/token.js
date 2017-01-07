// token.js
//
// Description: The token schema contains the necessary client tokens
// and is tied to a client secret

const mongoose = require('mongoose')
const crypto = require('crypto')

const tokenSchema = mongoose.Schema({
  access_token: {
    type: String,
    required: true
  },
  refresh_token: {
    type: String,
    required: true
  },
  modified_at: {
    type: Date,
    default: Date.now
  },
  created_at: {
    type: Date,
    default: Date.now
    // expires: 300 // 5 minutes TTL
  },
  useragent: String,
  // owner_id: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User',
  //   required: true
  // },
  client_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  }
})

tokenSchema.methods.generateToken = function (password) {
  return crypto.randomBytes(16).toString('hex')
}

module.exports = mongoose.model('Token', tokenSchema)
