// routes/device.js

const express = require('express')
const router = express.Router()
//
// GET /devices
//
// Description: Get a list of devices
//
router.get('/devices', (req, res) => {
  DeviceController
  .getDevices()
  .then((devices) => {
    res.locals.devices = devices
    res.render('devices')
  })
})
module.exports = router
