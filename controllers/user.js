const User = require('../models/user.js')
const Device = require('../models/device.js')

const jwt = require('../modules/jwt.js')
class UserController {
  getUsers () {
    return User.find({})
  }

  getUserById (_id) {
    return User.findOne({_id})
  }

  getDevices () {
    return Device.find()
  }

  createDevice (params) {
    // Check if the user is already tied to a device or not
    // If yes, reuse it
    // const device = new Device()
    // device.user_id = params.user_id
    // device.access_token = device.createAccessToken(params.user_id)
    // device.refresh_token = device.createRefreshToken()
    // device.useragent = params.useragent
    // return device.save()
    const device = new Device()
    return Device.findOneAndUpdate({
      user_id: params.user_id,
      useragent: params.useragent
    }, {
      $set: {
        access_token: device.createAccessToken(params.user_id),
        refresh_token: device.createRefreshToken(),
        useragent: params.useragent,
        user_id: params.user_id
      }
    }, {
      upsert: true,
      new: true
    })
  }

  verifyDevice (params) {
    return Device.findOne({
      refresh_token: params.refresh_token,
      useragent: params.useragent
    })
  }

  verifyToken (access_token) {
    return jwt.verify(access_token)
  }

  deleteUsers () {
    return User.remove({})
  }
  deleteDevices () {
    return Device.remove({})
  }
}

module.exports = function init (options) {
  return new UserController(options)
}
