const express = require('express')
const router = express.Router()

const UserController = require('../controllers/user.js')()

router.get('/users', (req, res) => {
  UserController.getUsers().then((users) => {
    // Remove unnecessary details such as password
    res.status(200).json({
      users
    })
  })
})

router.get('/users/:id', (req, res) => {
  UserController.getUserById(req.params.id).then((user) => {
    res.status(200).json({
      user
    })
  })
})

router.get('/devices', (req, res) => {
  UserController.getDevices().then((devices) => {
    res.status(200).json({
      devices
    })
  })
})

module.exports = router
