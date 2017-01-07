const express = require('express')
const app = express()
const PORT = process.env.PORT
const path = require('path')
const setupAuth = require('./common/auth.js')
const database = require('./common/database.js')
const morgan = require('morgan')

const bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use(morgan('dev'))

const initRoutes = require('./routes/_main.js')
app.set('view engine', 'ejs')

// Set static folder
app.use(express.static(path.join(__dirname, 'static')))

const passport = require('passport')
app.use(passport.initialize())

initRoutes(app, setupAuth(passport))

app.listen(PORT, () => {
  console.log(`listening to port *:${PORT}. press ctrl + c to cancel`)
})

module.exports = app
