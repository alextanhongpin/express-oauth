// code.js
//
// Description: Used to store the temp code for validating the users
// Can be removed in favor of memory-cache such as redis
//
const mongoose = require('mongoose')
const crypto = require('crypto')

const codeSchema = mongoose.Schema({
  code: {
    type: String,
    required: true
  },
  // The user's account that is tied to the auth server
  // At the end you can access the user's details (username, email)
  // from the userinfo endpoint
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Optional, if you want to cross-check the device that carries
  // the request
  useragent: {
    type: String
  },
  created_at: {
    type: Date,
    default: Date.now,
    expires: 300 // 5 minutes TTL
  }
})

codeSchema.methods.generateCode = function (password) {
  return crypto.randomBytes(16).toString('hex')
}

module.exports = mongoose.model('Code', codeSchema)
