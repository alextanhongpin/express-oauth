// user.js
//
// Description: The user schema should contain only the necessary crendentials
// (private information) for authentication/authorization.
// Other related fields that are meant to be kept public can be stored
// in a different database

const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')

const userSchema = mongoose.Schema({
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  modified_at: {
    type: Date,
    default: Date.now
  },
  last_login: {
    type: Date,
    default: Date.now
  },
  displayName: String,
  emailVerified: Boolean,
  photoURL: String
  // On second thought, make this another collection
  // access_token: String,
  // refresh_token: String,
  // useragents: [String]
})

userSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password)
}

userSchema.pre('save', function (next) {
  this.modified_at = Date.now()
  next()
})

module.exports = mongoose.model('User', userSchema)
