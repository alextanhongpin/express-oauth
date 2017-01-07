// device.js
//
// Description: A list of devices that are connected to the user's account
// with different access/refresh token pairs.
// If the access token is removed, user can request a new one from the
// refresh token.
// If the refresh token is removed, user can no longer login until
// theu request a new one.

const mongoose = require('mongoose')
const crypto = require('crypto')
const jwt = require('../modules/jwt.js')

const deviceSchema = mongoose.Schema({
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
  useragent: {
    type: String,
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

deviceSchema.methods.createRefreshToken = function () {
  return crypto.randomBytes(16).toString('hex')
}

deviceSchema.methods.createAccessToken = function (user_id) {
  // Set a 1 minute expiration date
  return jwt.signSync({ user_id }, '1m')
}

deviceSchema.pre('save', function (next) {
  this.modified_at = Date.now()
  next()
})

module.exports = mongoose.model('Device', deviceSchema)
