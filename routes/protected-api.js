const express = require('express')
const router = express.Router()

const UserController = require('../controllers/user.js')()

router.get('/protected-api', (req, res) => {
  UserController.getUsers().then((users) => {
    res.status(200).json(users)
  })
})

// router.get('/users/:id', (req, res) => {
//   UserController.getUserById(req.params.id).then((user) => {
//     res.locals.user = user
//     res.render('user')
//   })
// })

module.exports = router
