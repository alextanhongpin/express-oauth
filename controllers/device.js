// device.js
//
// Description: Controllers for devices

const Device = require('../models/device.js')

class DeviceController {

  getDevices () {
    return Device.find()
  }

  createDevice (params) {
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

  deleteDevices () {
    return Device.remove({})
  }
}

module.exports = function init (options) {
  return new DeviceController(options)
}
